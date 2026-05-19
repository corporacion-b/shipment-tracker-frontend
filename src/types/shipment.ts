export interface LocationRead {
  id_location: number | null;
  country_code: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ShipmentUser {
  id_user: number;
  email: string;
}

export interface Shipment {
  id_shipment: number;
  tracking_id: string;
  status: string;
  weight: number | null;
  created_at: string;
  updated_at: string;
  user: ShipmentUser;
  initial_location: LocationRead | null;
  end_location: LocationRead | null;
  current_location: LocationRead | null;
}

export interface ShipmentListResponse {
  items: Shipment[];
  total: number;
  page: number;
  page_size: number;
}

export interface ShipmentHistoryEvent {
  event_timestamp: string;
  status: string;
  description: string | null;
  city: string;
  country_code: string;
}

export interface ShipmentHistoryResponse {
  tracking_id: string;
  history: ShipmentHistoryEvent[];
}

export interface DwellTime {
  tracking_id: string;
  status: string;
  country_code: string;
  city: string;
  current_status_timestamp: string;
  dwell_time_hours: number;
  dwell_time_days: number;
}

export interface ShipmentFilters {
  q: string;
  status: string;
  sort: string;
  page: number;
  pageSize: number;
}
