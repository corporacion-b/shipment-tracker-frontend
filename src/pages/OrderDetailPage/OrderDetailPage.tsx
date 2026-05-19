import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { OrderDetailPanel } from "../../components/orders/OrderDetailPanel";
import {
  getShipment,
  getShipmentDwellTime,
  getShipmentHistory,
  refreshShipment,
} from "../../services/shipmentsApi";
import styles from "./OrderDetailPage.module.css";

export function OrderDetailPage() {
  const { trackingId } = useParams();
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ["shipment", trackingId],
    queryFn: () => getShipment(trackingId as string),
    enabled: Boolean(trackingId),
  });

  const historyQuery = useQuery({
    queryKey: ["shipment-history", trackingId],
    queryFn: () => getShipmentHistory(trackingId as string),
    enabled: Boolean(trackingId),
  });

  const dwellQuery = useQuery({
    queryKey: ["shipment-dwell", trackingId],
    queryFn: () => getShipmentDwellTime(trackingId as string),
    enabled: Boolean(trackingId),
    retry: false,
  });

  const refreshMutation = useMutation({
    mutationFn: refreshShipment,
    onSuccess: (shipment) => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["shipment", shipment.tracking_id] });
      queryClient.invalidateQueries({ queryKey: ["shipment-history", shipment.tracking_id] });
      queryClient.invalidateQueries({ queryKey: ["shipment-dwell", shipment.tracking_id] });
    },
  });

  if (!trackingId) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Link className={styles.backLink} to="/orders">
            <ArrowLeft size={17} />
            Pedidos
          </Link>
          <h1>Detalle del pedido</h1>
        </div>
      </header>

      {detailQuery.error && <p className={styles.error}>{detailQuery.error.message}</p>}
      {historyQuery.error && <p className={styles.error}>{historyQuery.error.message}</p>}
      {refreshMutation.error && <p className={styles.error}>{refreshMutation.error.message}</p>}

      {detailQuery.isLoading ? (
        <div className={styles.loading}>
          <Loader2 size={18} className={styles.spinner} />
          Cargando pedido...
        </div>
      ) : (
        <div className={styles.detailWrap}>
          <OrderDetailPanel
            shipment={detailQuery.data ?? null}
            history={historyQuery.data?.history ?? []}
            dwellTime={dwellQuery.data ?? null}
            isLoading={detailQuery.isLoading}
            onRefresh={() => refreshMutation.mutate(trackingId)}
            isRefreshing={refreshMutation.isPending}
            layout="wide"
          />
        </div>
      )}
    </div>
  );
}
