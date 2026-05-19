import type { CSSProperties } from "react";
import { getStatusColor, getStatusLabel } from "../../utils/status";
import styles from "./StatusBadge.module.css";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={styles.badge} style={{ "--status-color": getStatusColor(status) } as CSSProperties}>
      {getStatusLabel(status)}
    </span>
  );
}
