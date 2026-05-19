import type { Shipment } from "../../types/shipment";
import { hasValidCoordinates } from "../../utils/coordinates";
import { formatDate } from "../../utils/dates";
import { StatusBadge } from "../ui/StatusBadge";
import styles from "./OrdersTable.module.css";

interface OrdersTableProps {
  shipments: Shipment[];
  selectedTrackingId: string | null;
  onSelect: (trackingId: string) => void;
}

export function OrdersTable({ shipments, selectedTrackingId, onSelect }: OrdersTableProps) {
  return (
    <section className={styles.card} aria-label="Tabla de pedidos">
      <div className={styles.header}>
        <h2>Pedidos</h2>
        <span>{shipments.length} visibles</span>
      </div>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Guia</th>
              <th>Status</th>
              <th>Ubicacion</th>
              <th>Peso</th>
              <th>Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr
                key={shipment.tracking_id}
                className={shipment.tracking_id === selectedTrackingId ? styles.selected : undefined}
                onClick={() => onSelect(shipment.tracking_id)}
              >
                <td>
                  <strong>{shipment.tracking_id}</strong>
                  <small>#{shipment.id_shipment}</small>
                </td>
                <td>
                  <StatusBadge status={shipment.status} />
                </td>
                <td>
                  <span>{shipment.current_location?.city ?? "Sin ubicacion"}</span>
                  <small>
                    {hasValidCoordinates(shipment.current_location) ? "Con coordenadas" : "Sin coordenadas validas"}
                  </small>
                </td>
                <td>{shipment.weight === null ? "N/A" : `${shipment.weight} kg`}</td>
                <td>{formatDate(shipment.updated_at)}</td>
              </tr>
            ))}
            {shipments.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No hay pedidos con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
