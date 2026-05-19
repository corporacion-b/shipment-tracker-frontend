import { format, parseISO } from "date-fns";

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Sin fecha";
  }

  const parsed = value.includes("T") ? parseISO(value) : new Date(value.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return format(parsed, "dd/MM/yyyy HH:mm");
}
