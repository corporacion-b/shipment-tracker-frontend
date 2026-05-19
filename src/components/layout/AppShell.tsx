import { LogOut, MapPinned, PackageSearch, Table2 } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import packageImage from "../../public/Paquete.jpeg";
import styles from "./AppShell.module.css";

export function AppShell() {
  const { logout, user } = useAuth();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Navegacion principal">
        <div className={styles.brand}>
          <img className={styles.brandMark} src={packageImage} alt="" />
          <div>
            <strong>Shipment Tracker</strong>
            <span>Control de pedidos</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            <MapPinned size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            <Table2 size={18} />
            Pedidos
          </NavLink>
        </nav>

        <div className={styles.profile}>
          <PackageSearch size={18} />
          <span>{user?.email}</span>
        </div>
        <button className={styles.logout} type="button" onClick={logout}>
          <LogOut size={18} />
          Salir
        </button>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
