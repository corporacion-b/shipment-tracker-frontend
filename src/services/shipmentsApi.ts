import { apiRequest } from "./apiClient";
import type {
  DwellTime,
  Shipment,
  ShipmentFilters,
  ShipmentHistoryResponse,
  ShipmentListResponse,
} from "../types/shipment";

export function getShipments(filters: ShipmentFilters) {
  const params = new URLSearchParams();
  params.set("page", String(filters.page));
  params.set("page_size", String(filters.pageSize));
  params.set("sort", filters.sort);

  if (filters.q.trim()) {
    params.set("q", filters.q.trim());
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  return apiRequest<ShipmentListResponse>(`/shipments?${params.toString()}`);
}

export function getShipment(trackingId: string) {
  return apiRequest<Shipment>(`/shipments/${encodeURIComponent(trackingId)}`);
}

export function refreshShipment(trackingId: string) {
  return apiRequest<Shipment>(`/shipments/${encodeURIComponent(trackingId)}/refresh`, {
    method: "POST",
  });
}

export function getShipmentHistory(trackingId: string) {
  return apiRequest<ShipmentHistoryResponse>(`/history/${encodeURIComponent(trackingId)}`);
}

export function getShipmentDwellTime(trackingId: string) {
  return apiRequest<DwellTime>(`/dwell-time/${encodeURIComponent(trackingId)}`);
}
