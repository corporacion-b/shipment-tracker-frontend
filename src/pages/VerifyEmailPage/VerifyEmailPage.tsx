import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { ApiError } from "../../services/apiClient";
import { verifyEmail } from "../../services/authApi";
import { useAuth } from "../../providers/AuthProvider";
import logoBanner from "../../public/Logo-Banner.png";
import packageImage from "../../public/Paquete.jpeg";
import styles from "../LoginPage/LoginPage.module.css";

type VerificationState = "loading" | "success" | "error";

export function VerifyEmailPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const requestedRef = useRef(false);
  const [state, setState] = useState<VerificationState>("loading");
  const [message, setMessage] = useState("Verificando tu correo...");

  useEffect(() => {
    if (requestedRef.current) {
      return;
    }

    requestedRef.current = true;
    if (!token) {
      setState("error");
      setMessage("El enlace de verificacion no incluye un token valido.");
      return;
    }

    verifyEmail(token)
      .then((response) => {
        setState("success");
        setMessage(response.message);
      })
      .catch((error) => {
        setState("error");
        setMessage(error instanceof ApiError ? error.message : "No se pudo verificar el correo.");
      });
  }, [token]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const icon =
    state === "loading" ? (
      <Loader2 className={styles.spinner} size={28} />
    ) : state === "success" ? (
      <CheckCircle2 size={28} />
    ) : (
      <XCircle size={28} />
    );

  return (
    <main className={styles.page}>
      <section className={styles.formPane} aria-labelledby="verify-title">
        <div className={styles.formWrap}>
          <div className={styles.brandRow}>
            <img className={styles.packageMark} src={packageImage} alt="" />
            <p className={styles.kicker}>Shipment Tracker</p>
          </div>
          <h1 id="verify-title">{state === "success" ? "Correo verificado" : "Verificacion de correo"}</h1>
          <div className={styles.checkEmailPanel}>
            <div className={styles.checkIcon} aria-hidden="true">
              {icon}
            </div>
            <p className={state === "success" ? styles.success : state === "error" ? styles.error : undefined}>
              {message}
            </p>
            <Link className={styles.submit} to="/login">
              Iniciar sesion
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.visualPane} aria-hidden="true">
        <img className={styles.bannerImage} src={logoBanner} alt="" />
        <div className={styles.visualOverlay}>
          <p className={styles.bannerCopy}>Rastrea tus envios en toda la Republica Mexicana</p>
        </div>
      </section>
    </main>
  );
}
