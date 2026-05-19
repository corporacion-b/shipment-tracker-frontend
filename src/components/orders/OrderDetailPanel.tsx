import { Clock3, MapPin, Package, RefreshCcw, Route } from "lucide-react";
import type { DwellTime, Shipment, ShipmentHistoryEvent } from "../../types/shipment";
import { formatDate } from "../../utils/dates";
import { StatusBadge } from "../ui/StatusBadge";
import styles from "./OrderDetailPanel.module.css";

interface OrderDetailPanelProps {
  shipment: Shipment | null;
  history: ShipmentHistoryEvent[];
  dwellTime: DwellTime | null;
  isLoading: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  layout?: "compact" | "wide";
}

export function OrderDetailPanel({
  shipment,
  history,
  dwellTime,
  isLoading,
  onRefresh,
  isRefreshing,
  layout = "compact",
}: OrderDetailPanelProps) {
  if (isLoading) {
    return <aside className={styles.panel}>Cargando detalle...</aside>;
  }

  if (!shipment) {
    return (
      <aside className={styles.panel}>
        <div className={styles.empty}>
          <Package size={28} />
          <p>Selecciona un pedido en el mapa.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${styles.panel} ${layout === "wide" ? styles.widePanel : ""}`}>
      <div className={styles.detailColumn}>
        <header className={styles.header}>
          <div>
            <span>Pedido</span>
            <h2>{shipment.tracking_id}</h2>
          </div>
          <button type="button" onClick={onRefresh} disabled={isRefreshing} aria-label="Actualizar desde DHL">
            <RefreshCcw size={18} />
          </button>
        </header>

        <div className={styles.statusRow}>
          <StatusBadge status={shipment.status} />
          <span>{shipment.weight === null ? "Peso N/A" : `${shipment.weight} kg`}</span>
        </div>

        <section className={styles.block}>
          <h3>
            <MapPin size={16} />
            Ubicacion actual
          </h3>
          <p>{shipment.current_location?.city ?? "Sin ciudad"}</p>
          <span>{shipment.current_location?.country_code ?? "Sin pais"}</span>
          <small>
            Lat {shipment.current_location?.latitude ?? "N/A"} / Lng {shipment.current_location?.longitude ?? "N/A"}
          </small>
        </section>

        <section className={styles.grid}>
          <div>
            <span>Creado</span>
            <strong>{formatDate(shipment.created_at)}</strong>
          </div>
          <div>
            <span>Actualizado</span>
            <strong>{formatDate(shipment.updated_at)}</strong>
          </div>
        </section>

        {dwellTime && (
          <section className={styles.block}>
            <h3>
              <Clock3 size={16} />
              Tiempo inmovil
            </h3>
            <p>{dwellTime.dwell_time_days} dias</p>
            <span>{dwellTime.dwell_time_hours} horas estimadas</span>
          </section>
        )}

        <section className={styles.block}>
          <h3>
            <Route size={16} />
            Ruta
          </h3>
          <div className={styles.route}>
            <span>{shipment.initial_location?.city ?? "Origen N/A"}</span>
            <span>{shipment.end_location?.city ?? "Destino N/A"}</span>
          </div>
        </section>
      </div>

      <section className={styles.timeline}>
        <h3>Historial</h3>
        {history.length === 0 ? (
          <p className={styles.muted}>No hay eventos de historial disponibles.</p>
        ) : (
          history.map((event) => (
            <article key={`${event.event_timestamp}-${event.status}-${event.city}`}>
              <span />
              <div>
                <strong>{event.status}</strong>
                <p>{event.description ?? "Sin descripcion"}</p>
                <small>
                  {event.city}, {event.country_code} · {formatDate(event.event_timestamp)}
                </small>
              </div>
            </article>
          ))
        )}
      </section>
    </aside>
  );
}
