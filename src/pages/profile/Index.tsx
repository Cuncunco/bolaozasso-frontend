import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate("/login", { replace: true });
  }

  return (
    <main
      style={{
        minHeight: "100%",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>Perfil</h1>

        <p style={{ marginBottom: "8px" }}>
          <strong>Nome:</strong> {user?.name || "-"}
        </p>

        <p style={{ marginBottom: "24px" }}>
          <strong>E-mail:</strong> {user?.email || "-"}
        </p>

        <button
          onClick={handleLogout}
          style={{
            padding: "14px 16px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#dc2626",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </div>
    </main>
  );
}