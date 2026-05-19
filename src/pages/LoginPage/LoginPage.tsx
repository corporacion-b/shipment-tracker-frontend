import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ApiError } from "../../services/apiClient";
import { useAuth } from "../../providers/AuthProvider";
import logoBanner from "../../public/Logo-Banner.png";
import packageImage from "../../public/Paquete.jpeg";
import styles from "./LoginPage.module.css";

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo valido."),
  password: z.string().min(8, "La contrasena debe tener al menos 8 caracteres."),
});

type LoginForm = z.infer<typeof loginSchema>;

function getLoginRedirect(pathname?: string) {
  if (!pathname || pathname.startsWith("/dashboard/")) {
    return "/dashboard";
  }

  return pathname;
}

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const from = getLoginRedirect((location.state as { from?: { pathname?: string } } | null)?.from?.pathname);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(values: LoginForm) {
    setServerError("");
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "No se pudo iniciar sesion.");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.formPane} aria-labelledby="login-title">
        <div className={styles.formWrap}>
          <div className={styles.brandRow}>
            <img className={styles.packageMark} src={packageImage} alt="" />
            <p className={styles.kicker}>Shipment Tracker</p>
          </div>
          <h1 id="login-title">Iniciar sesión</h1>
          <p className={styles.subtitle}></p>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <label className={styles.field}>
              <span>Correo</span>
              <input
                autoComplete="email"
                type="email"
                placeholder="usuario@correo.com"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && <small>{errors.email.message}</small>}
            </label>

            <label className={styles.field}>
              <span>Contrasena</span>
              <div className={styles.passwordInput}>
                <input
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimo 8 caracteres"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <small>{errors.password.message}</small>}
            </label>

            <button className={styles.forgotPassword} type="button">
              Olvidaste tu contrasena?
            </button>

            {serverError && <p className={styles.error}>{serverError}</p>}

            <button className={styles.submit} type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className={styles.spinner} size={18} /> : null}
              Iniciar sesion
            </button>

            <button className={styles.registerButton} type="button">
              Registrarse
            </button>
          </form>
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
