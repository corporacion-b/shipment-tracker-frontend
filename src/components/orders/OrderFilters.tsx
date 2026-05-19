import { Search } from "lucide-react";
import type { ShipmentFilters } from "../../types/shipment";
import { STATUS_OPTIONS } from "../../utils/status";
import styles from "./OrderFilters.module.css";

interface OrderFiltersProps {
  filters: ShipmentFilters;
  onChange: (filters: ShipmentFilters) => void;
}

export function OrderFilters({ filters, onChange }: OrderFiltersProps) {
  return (
    <section className={styles.filters} aria-label="Filtros de pedidos">
      <label className={styles.search}>
        <Search size={18} />
        <input
          value={filters.q}
          onChange={(event) => onChange({ ...filters, q: event.target.value, page: 1 })}
          placeholder="Buscar guia o id"
        />
      </label>

      <label>
        <span>Status</span>
        <select
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value, page: 1 })}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Orden</span>
        <select value={filters.sort} onChange={(event) => onChange({ ...filters, sort: event.target.value })}>
          <option value="-updated_at">Actualizados recientes</option>
          <option value="updated_at">Actualizados antiguos</option>
          <option value="-created_at">Creados recientes</option>
          <option value="created_at">Creados antiguos</option>
          <option value="tracking_id">Guia A-Z</option>
          <option value="status">Status A-Z</option>
        </select>
      </label>
    </section>
  );
}
