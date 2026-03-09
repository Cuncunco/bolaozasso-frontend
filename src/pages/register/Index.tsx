import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage("");

      await signUp({
        name,
        email,
        password,
      });

      navigate("/pools", { replace: true });
    } catch {
      setErrorMessage("Não foi possível criar a conta");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
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
            marginBottom: "24px",
          }}
        />

        <form
          onSubmit={handleRegister}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: "70px" }}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                color: "#9ca3af",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#eee712",
              fontWeight: "bold",
              cursor: "pointer",
              color:"black"
            }}
          >
            {isLoading ? "Criando..." : "CRIAR CONTA"}
          </button>

          <Link
            to="/login"
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #4b5563",
              color: "#fff",
              textAlign: "center",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            JÁ TENHO CONTA
          </Link>
        </form>

        {errorMessage && (
          <div
            style={{
              marginTop: "16px",
              padding: "10px",
              borderRadius: "8px",
              background: "#7f1d1d",
              color: "#fecaca",
            }}
          >
            {errorMessage}
          </div>
        )}

        <p
          style={{
            color: "#9ca3af",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          Crie sua conta para entrar nos bolões.
        </p>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #374151",
  backgroundColor: "#1f2937",
  color: "#fff",
  fontSize: "16px",
  outline: "none",
};