import { useAuth } from "../../hooks/UseAuth";

export default function Dashboard() {
  const { signOut, user } = useAuth();

  return (
    <main style={{ padding: "24px", color: "white" }}>
      <h1>Dashboard</h1>
      <p>Usuário: {user?.name || user?.email || "logado"}</p>
      <button onClick={signOut}>Sair</button>
    </main>
  );
}