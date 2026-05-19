const STATUS_COLORS: Record<string, string> = {
  CREATED: "#737373",
  PENDING: "#737373",
  TRANSIT: "#F4510B",
  IN_TRANSIT: "#F4510B",
  OUT_FOR_DELIVERY: "#2563EB",
  DELIVERED: "#16A34A",
  DELAYED: "#EA580C",
  CANCELLED: "#DC2626",
  CANCELED: "#DC2626",
  UNKNOWN: "#737373",
};

const STATUS_LABELS: Record<string, string> = {
  CREATED: "Creado",
  PENDING: "Pendiente",
  TRANSIT: "En transito",
  IN_TRANSIT: "En transito",
  OUT_FOR_DELIVERY: "En reparto",
  DELIVERED: "Entregado",
  DELAYED: "Retrasado",
  CANCELLED: "Cancelado",
  CANCELED: "Cancelado",
  UNKNOWN: "Sin estado",
};

const PENDING_STATUSES = new Set(["CREATED", "PENDING", "UNKNOWN"]);

export function normalizeStatus(status: string | null | undefined) {
  return String(status || "UNKNOWN").trim().toUpperCase().replace(/\s+/g, "_");
}

export function getStatusColor(status: string | null | undefined) {
  return STATUS_COLORS[normalizeStatus(status)] ?? STATUS_COLORS.UNKNOWN;
}

export function getStatusLabel(status: string | null | undefined) {
  const normalized = normalizeStatus(status);
  return STATUS_LABELS[normalized] ?? normalized.replace(/_/g, " ");
}

export function isPendingStatus(status: string | null | undefined) {
  const normalized = normalizeStatus(status);
  return PENDING_STATUSES.has(normalized) || !STATUS_COLORS[normalized];
}

export const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "CREATED", label: "Creado" },
  { value: "PENDING", label: "Pendiente" },
  { value: "TRANSIT", label: "En transito" },
  { value: "OUT_FOR_DELIVERY", label: "En reparto" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "DELAYED", label: "Retrasado" },
  { value: "CANCELLED", label: "Cancelado" },
];
