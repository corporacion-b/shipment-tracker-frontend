import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import packageImage from "../../public/Paquete.jpeg";
import type { Shipment } from "../../types/shipment";
import { getMappableShipments } from "../../utils/coordinates";
import { formatDate } from "../../utils/dates";
import { getStatusColor, getStatusLabel, isPendingStatus, normalizeStatus } from "../../utils/status";
import styles from "./OrderMap.module.css";

interface OrderMapProps {
  shipments: Shipment[];
  selectedTrackingId: string | null;
  onSelect: (trackingId: string) => void;
}

function createMarkerIcon(status: string, selected: boolean) {
  const color = getStatusColor(status);
  const size = selected ? 42 : 34;
  const borderWidth = selected ? 4 : 3;

  return L.divIcon({
    className: "",
    html: `<span style="display:grid;place-items:center;width:${size}px;height:${size}px;border-radius:999px;background:white;border:${borderWidth}px solid ${color};box-shadow:0 10px 24px rgba(23,23,23,.24);overflow:hidden;"><img src="${packageImage}" alt="" style="width:100%;height:100%;object-fit:cover;" /></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const LEGEND_ITEMS = [
  {
    label: "Entregados",
    color: getStatusColor("DELIVERED"),
    matches: (status: string) => ["DELIVERED"].includes(normalizeStatus(status)),
  },
  {
    label: "En reparto",
    color: getStatusColor("OUT_FOR_DELIVERY"),
    matches: (status: string) => ["OUT_FOR_DELIVERY"].includes(normalizeStatus(status)),
  },
  {
    label: "Pendientes",
    color: getStatusColor("CREATED"),
    matches: isPendingStatus,
  },
  {
    label: "Cancelados",
    color: getStatusColor("CANCELLED"),
    matches: (status: string) => ["CANCELLED", "CANCELED"].includes(normalizeStatus(status)),
  },
];

export function OrderMap({ shipments, selectedTrackingId, onSelect }: OrderMapProps) {
  const mappable = getMappableShipments(shipments);
  const legendItems = LEGEND_ITEMS.map((item) => ({
    ...item,
    count: shipments.filter((shipment) => item.matches(shipment.status)).length,
  }));

  return (
    <section className={styles.mapCard} aria-label="Mapa de pedidos">
      <MapContainer
        center={[23.6345, -102.5528]}
        zoom={5}
        minZoom={5.2}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={5} zoomToBoundsOnClick={false}>
          {mappable.map((shipment) => {
            const location = shipment.current_location;
            if (!location?.latitude || !location.longitude) {
              return null;
            }

            return (
              <Marker
                key={shipment.tracking_id}
                position={[location.latitude, location.longitude]}
                icon={createMarkerIcon(shipment.status, shipment.tracking_id === selectedTrackingId)}
                eventHandlers={{
                  click: () => onSelect(shipment.tracking_id),
                }}
              >
                <Popup>
                  <div className={styles.popup}>
                    <strong>{shipment.tracking_id}</strong>
                    <span>{getStatusLabel(shipment.status)}</span>
                    <span>
                      {location.city}, {location.country_code}
                    </span>
                    <small>Actualizado {formatDate(shipment.updated_at)}</small>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {mappable.length === 0 && (
        <div className={styles.noCoordinates}>
          No hay pedidos con coordenadas validas para mostrar en el mapa.
        </div>
      )}

      <div className={styles.legend} aria-label="Resumen de estados de pedidos">
        {legendItems.map((item) => (
          <div className={styles.legendItem} key={item.label}>
            <img className={styles.legendIcon} src={packageImage} alt="" style={{ borderColor: item.color }} />
            <span>{item.label}</span>
            <strong>{item.count}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
