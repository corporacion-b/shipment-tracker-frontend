import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ApiError } from "../../services/apiClient";
import { useAuth } from "../../providers/AuthProvider";
import { register as registerRequest, resendVerification } from "../../services/authApi";
import logoBanner from "../../public/Logo-Banner.png";
import packageImage from "../../public/Paquete.jpeg";
import styles from "./LoginPage.module.css";

type AuthMode = "login" | "register" | "checkEmail";

const baseAuthSchema = z.object({
  email: z.string().email("Ingresa un correo valido."),
  password: z.string().min(8, "La contrasena debe tener al menos 8 caracteres."),
  confirmPassword: z.string().optional(),
});

type AuthForm = z.infer<typeof baseAuthSchema>;

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
  const [serverMessage, setServerMessage] = useState("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const from = getLoginRedirect((location.state as { from?: { pathname?: string } } | null)?.from?.pathname);
  const authSchema = useMemo(
    () =>
      baseAuthSchema.superRefine((values, context) => {
        if (mode === "register" && values.password !== values.confirmPassword) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Las contrasenas no coinciden.",
            path: ["confirmPassword"],
          });
        }
      }),
    [mode],
  );

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setServerError("");
    setServerMessage("");
    reset({
      email: nextMode === "login" ? getValues("email") : registeredEmail || getValues("email"),
      password: "",
      confirmPassword: "",
    });
  }

  async function onSubmit(values: AuthForm) {
    setServerError("");
    setServerMessage("");
    if (mode === "register") {
      try {
        const response = await registerRequest({
          email: values.email,
          password: values.password,
        });
        setRegisteredEmail(response.email);
        setServerMessage(response.message);
        setMode("checkEmail");
      } catch (error) {
        setServerError(error instanceof ApiError ? error.message : "No se pudo crear la cuenta.");
      }
      return;
    }

    try {
      await login({ email: values.email, password: values.password });
      navigate(from, { replace: true });
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "No se pudo iniciar sesion.");
    }
  }

  async function handleResendVerification() {
    const email = registeredEmail || getValues("email");
    if (!email) {
      setServerError("Ingresa tu correo para reenviar la verificacion.");
      return;
    }

    setServerError("");
    setServerMessage("");
    try {
      const response = await resendVerification(email);
      setRegisteredEmail(email);
      setServerMessage(response.message);
      setMode("checkEmail");
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "No se pudo reenviar el correo.");
    }
  }

  const isRegisterMode = mode === "register";
  const isCheckEmailMode = mode === "checkEmail";

  return (
    <main className={styles.page}>
      <section className={styles.formPane} aria-labelledby="login-title">
        <div className={styles.formWrap}>
          <div className={styles.brandRow}>
            <img className={styles.packageMark} src={packageImage} alt="" />
            <p className={styles.kicker}>Shipment Tracker</p>
          </div>
          <h1 id="login-title">
            {isCheckEmailMode ? "Verifica tu correo" : isRegisterMode ? "Crear cuenta" : "Iniciar sesión"}
          </h1>
          <p className={styles.subtitle}>
            {isCheckEmailMode
              ? `Enviamos un enlace de verificacion a ${registeredEmail || "tu correo"}.`
              : isRegisterMode
                ? "Crea tu cuenta y confirma tu correo para activar el acceso."
                : ""}
          </p>

          {isCheckEmailMode ? (
            <div className={styles.checkEmailPanel}>
              <div className={styles.checkIcon} aria-hidden="true">
                <MailCheck size={28} />
              </div>
              <p>
                Abre el enlace desde tu bandeja de entrada. Si no aparece, revisa spam o solicita otro correo.
              </p>
              {serverMessage && <p className={styles.success}>{serverMessage}</p>}
              {serverError && <p className={styles.error}>{serverError}</p>}
              <button className={styles.submit} type="button" onClick={handleResendVerification}>
                Reenviar verificacion
              </button>
              <button className={styles.registerButton} type="button" onClick={() => switchMode("login")}>
                Volver a iniciar sesion
              </button>
            </div>
          ) : (
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
                    autoComplete={isRegisterMode ? "new-password" : "current-password"}
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

              {isRegisterMode && (
                <label className={styles.field}>
                  <span>Confirmar contrasena</span>
                  <input
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repite tu contrasena"
                    aria-invalid={Boolean(errors.confirmPassword)}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && <small>{errors.confirmPassword.message}</small>}
                </label>
              )}

              {!isRegisterMode && (
                <button className={styles.forgotPassword} type="button">
                  Olvidaste tu contrasena?
                </button>
              )}

              {serverError && <p className={styles.error}>{serverError}</p>}
              {serverError.includes("verificar tu correo") && (
                <button className={styles.inlineAction} type="button" onClick={handleResendVerification}>
                  Reenviar correo de verificacion
                </button>
              )}

              <button className={styles.submit} type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className={styles.spinner} size={18} /> : null}
                {isRegisterMode ? "Crear cuenta" : "Iniciar sesion"}
              </button>

              <button
                className={styles.registerButton}
                type="button"
                onClick={() => switchMode(isRegisterMode ? "login" : "register")}
              >
                {isRegisterMode ? "Ya tengo cuenta" : "Registrarse"}
              </button>
            </form>
          )}
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
