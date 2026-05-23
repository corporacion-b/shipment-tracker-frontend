import incubatorImage from "../../public/Mag-incubadora.png";
import styles from "./NotificationsPage.module.css";

export function NotificationsPage() {
  return (
    <section className={styles.page} aria-labelledby="notifications-title">
      <div className={styles.content}>
        <img className={styles.image} src={incubatorImage} alt="" />
        <h1 id="notifications-title">Disponible pronto......</h1>
      </div>
    </section>
  );
}
