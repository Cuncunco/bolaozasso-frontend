import { useContext, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      console.log("Tentando cadastrar:", {
        name: name.trim(),
        email: email.trim(),
        passwordLength: password.trim().length,
      });

      await signUp({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      navigate("/pools", { replace: true });
    } catch (error: any) {
      console.error("ERRO FINAL NO REGISTER:", error);
      console.error("REGISTER response:", error?.response);
      console.error("REGISTER data:", error?.response?.data);
      console.error("REGISTER status:", error?.response?.status);

      const msg =
        error?.response?.data?.message ||
        "Não foi possível criar a conta";

      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#1f2937",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="/logo.svg"
          alt="Bolãozasso"
          style={logoStyle}
        />

        <h1 style={{ color: "#fff", fontSize: "28px", marginBottom: "6px" }}>
          Criar conta
        </h1>

        <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
          Crie sua conta para entrar nos bolões.
        </p>

        <form onSubmit={handleRegister} style={formStyle}>
          <input
            type="text"
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

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" disabled={isLoading} style={primaryButton}>
            {isLoading ? "Criando..." : "CRIAR CONTA"}
          </button>

          <Link to="/login" style={secondaryButton}>
            JÁ TENHO CONTA
          </Link>
        </form>

        {errorMessage && (
          <div
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "#7f1d1d",
              color: "#fecaca",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </div>
        )}
      </div>
    </main>
  );
}

const logoStyle: CSSProperties = {
  width: "220px",
  marginBottom: "20px",
};

const formStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #374151",
  backgroundColor: "#111827",
  color: "#fff",
  fontSize: "16px",
};

const primaryButton: CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#F7DD43",
  color: "#111827",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButton: CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #4b5563",
  textAlign: "center",
  textDecoration: "none",
  color: "#fff",
  fontWeight: 700,
};