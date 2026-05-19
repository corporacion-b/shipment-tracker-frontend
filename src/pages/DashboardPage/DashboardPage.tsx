import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, RefreshCcw } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrderDetailPanel } from "../../components/orders/OrderDetailPanel";
import { OrderFilters } from "../../components/orders/OrderFilters";
import { OrderMap } from "../../components/orders/OrderMap";
import {
  getShipment,
  getShipmentDwellTime,
  getShipmentHistory,
  getShipments,
  refreshShipment,
} from "../../services/shipmentsApi";
import type { ShipmentFilters } from "../../types/shipment";
import styles from "./DashboardPage.module.css";

const DEFAULT_FILTERS: ShipmentFilters = {
  q: "",
  status: "",
  sort: "-updated_at",
  page: 1,
  pageSize: 50,
};

export function DashboardPage() {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(trackingId ?? null);
  const [newTrackingId, setNewTrackingId] = useState("");

  useEffect(() => {
    if (trackingId) {
      setSelectedTrackingId(trackingId);
    }
  }, [trackingId]);

  const shipmentsQuery = useQuery({
    queryKey: ["shipments", filters],
    queryFn: () => getShipments(filters),
  });

  const shipments = shipmentsQuery.data?.items ?? [];

  const selectedFromList = useMemo(
    () => shipments.find((shipment) => shipment.tracking_id === selectedTrackingId) ?? null,
    [selectedTrackingId, shipments],
  );

  const detailQuery = useQuery({
    queryKey: ["shipment", selectedTrackingId],
    queryFn: () => getShipment(selectedTrackingId as string),
    enabled: Boolean(selectedTrackingId) && !selectedFromList,
  });

  const historyQuery = useQuery({
    queryKey: ["shipment-history", selectedTrackingId],
    queryFn: () => getShipmentHistory(selectedTrackingId as string),
    enabled: Boolean(selectedTrackingId),
  });

  const dwellQuery = useQuery({
    queryKey: ["shipment-dwell", selectedTrackingId],
    queryFn: () => getShipmentDwellTime(selectedTrackingId as string),
    enabled: Boolean(selectedTrackingId),
    retry: false,
  });

  const refreshMutation = useMutation({
    mutationFn: refreshShipment,
    onSuccess: (shipment) => {
      setSelectedTrackingId(shipment.tracking_id);
      setNewTrackingId("");
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["shipment", shipment.tracking_id] });
      queryClient.invalidateQueries({ queryKey: ["shipment-history", shipment.tracking_id] });
      queryClient.invalidateQueries({ queryKey: ["shipment-dwell", shipment.tracking_id] });
    },
  });

  const selectedShipment = selectedFromList ?? detailQuery.data ?? null;

  function handleSelect(tracking: string) {
    setSelectedTrackingId(tracking);
    navigate(`/dashboard/${encodeURIComponent(tracking)}`, { replace: true });
  }

  function handleAddShipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = newTrackingId.trim();
    if (trimmed) {
      refreshMutation.mutate(trimmed);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Rastreo de pedidos</h1>
        </div>
        <form className={styles.addForm} onSubmit={handleAddShipment}>
          <input
            value={newTrackingId}
            onChange={(event) => setNewTrackingId(event.target.value)}
            placeholder="Numero de guia DHL"
            aria-label="Numero de guia DHL"
          />
          <button type="submit" disabled={refreshMutation.isPending || !newTrackingId.trim()}>
            {refreshMutation.isPending ? <Loader2 size={17} className={styles.spinner} /> : <Plus size={17} />}
            Agregar
          </button>
        </form>
      </header>

      {refreshMutation.error && <p className={styles.error}>{refreshMutation.error.message}</p>}
      {shipmentsQuery.error && <p className={styles.error}>{shipmentsQuery.error.message}</p>}

      <div className={styles.toolbar}>
        <OrderFilters filters={filters} onChange={setFilters} />
        <button type="button" onClick={() => shipmentsQuery.refetch()}>
          <RefreshCcw size={17} />
          Refrescar mapa
        </button>
      </div>

      {shipmentsQuery.isLoading ? (
        <div className={styles.loading}>Cargando pedidos...</div>
      ) : (
        <div className={styles.grid}>
          <div className={styles.primaryColumn}>
            <OrderMap shipments={shipments} selectedTrackingId={selectedTrackingId} onSelect={handleSelect} />
          </div>
          <OrderDetailPanel
            shipment={selectedShipment}
            history={historyQuery.data?.history ?? []}
            dwellTime={dwellQuery.data ?? null}
            isLoading={detailQuery.isLoading}
            onRefresh={() => selectedTrackingId && refreshMutation.mutate(selectedTrackingId)}
            isRefreshing={refreshMutation.isPending}
          />
        </div>
      )}
    </div>
  );
}
