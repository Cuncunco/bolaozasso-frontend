import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage("");

      await signIn({
        email,
        password,
      });

      navigate("/pools", { replace: true });
    } catch (error) {
      setErrorMessage("E-mail ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "#111827",
        padding: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="/logo.svg"
          alt="Bolãozasso"
          style={{
            width: "300px",
            maxWidth: "100%",
            height: "auto",
            marginBottom: "24px",
          }}
        />

        <form
          onSubmit={handleSignIn}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          <input
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "10px",
              border: "1px solid #374151",
              backgroundColor: "#1f2937",
              color: "#ffffff",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 48px 14px 16px",
                borderRadius: "10px",
                border: "1px solid #374151",
                backgroundColor: "#1f2937",
                color: "#ffffff",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                color: "#9ca3af",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#eee712",
              color: "#111827",
              fontWeight: 700,
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Entrando..." : "ENTRAR"}
          </button>

          <Link
            to="/register"
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "10px",
              border: "1px solid #4b5563",
              backgroundColor: "transparent",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "16px",
              textAlign: "center",
              textDecoration: "none",
              boxSizing: "border-box",
            }}
          >
            CRIAR CONTA
          </Link>
        </form>

        {errorMessage && (
          <div
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "#7f1d1d",
              color: "#fecaca",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </div>
        )}

        <p
          style={{
            color: "#9ca3af",
            textAlign: "center",
            marginTop: "24px",
            fontSize: "14px",
          }}
        >
          Use seu e-mail e senha cadastrados.
        </p>
      </div>
    </main>
  );
}