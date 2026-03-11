import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage("");

      await signIn({ email, password });

      navigate("/pools", { replace: true });
    } catch {
      setErrorMessage("E-mail ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <MainLayout>
      <img src="/logo.svg" alt="Bolãozasso" style={logoStyle} />

      <Title>Entrar</Title>
      <Subtitle>Entre para acessar seus bolões.</Subtitle>

      <form onSubmit={handleSignIn} style={formStyle}>
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
            style={inputStyle}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={showPasswordStyle}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        <button type="submit" disabled={isLoading} style={primaryButton}>
          {isLoading ? "Entrando..." : "ENTRAR"}
        </button>

        <Link to="/register" style={secondaryButton}>
          CRIAR CONTA
        </Link>
      </form>

      {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
    </MainLayout>
  );
}

function MainLayout({ children }: any) {
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
        {children}
      </div>
    </main>
  );
}

function ErrorBox({ children }: any) {
  return (
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
      {children}
    </div>
  );
}


const Title = ({ children }: any) => (
  <h1 style={{ color: "#fff", fontSize: "28px", marginBottom: "6px" }}>
    {children}
  </h1>
);

const Subtitle = ({ children }: any) => (
  <p style={{ color: "#9ca3af", marginBottom: "24px" }}>{children}</p>
);

const logoStyle: React.CSSProperties = {
  width: "220px",
  marginBottom: "20px",
};

const formStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #374151",
  backgroundColor: "#111827",
  color: "#fff",
  fontSize: "16px",
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#F7DD43",
  color: "#111827",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #4b5563",
  textAlign: "center",
  textDecoration: "none",
  color: "#fff",
  fontWeight: 700,
};

const showPasswordStyle: React.CSSProperties = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  border: "none",
  background: "transparent",
  color: "#9ca3af",
  cursor: "pointer",
};