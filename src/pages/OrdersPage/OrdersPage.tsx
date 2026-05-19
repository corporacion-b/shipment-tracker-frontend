import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderFilters } from "../../components/orders/OrderFilters";
import { OrdersTable } from "../../components/orders/OrdersTable";
import { getShipments } from "../../services/shipmentsApi";
import type { ShipmentFilters } from "../../types/shipment";
import styles from "./OrdersPage.module.css";

const DEFAULT_FILTERS: ShipmentFilters = {
  q: "",
  status: "",
  sort: "-updated_at",
  page: 1,
  pageSize: 100,
};

export function OrdersPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(null);
  const shipmentsQuery = useQuery({
    queryKey: ["shipments", filters],
    queryFn: () => getShipments(filters),
  });

  function handleSelect(trackingId: string) {
    setSelectedTrackingId(trackingId);
    navigate(`/orders/${encodeURIComponent(trackingId)}`);
  }

  return (
    <div className={styles.page}>
      <header>
        <h1>Pedidos relacionados al usuario</h1>
      </header>
      <OrderFilters filters={filters} onChange={setFilters} />
      {shipmentsQuery.error && <p className={styles.error}>{shipmentsQuery.error.message}</p>}
      {shipmentsQuery.isLoading ? (
        <div className={styles.loading}>Cargando pedidos...</div>
      ) : (
        <OrdersTable
          shipments={shipmentsQuery.data?.items ?? []}
          selectedTrackingId={selectedTrackingId}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
