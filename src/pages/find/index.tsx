import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/Api";
import toast from "react-hot-toast";

export default function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  async function handleJoinPool(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) { toast.error("Informe o código"); return; }

    try {
      setIsLoading(true);
      await api.post("/pools/join", { code: cleanCode });
      toast.success("Você entrou no bolão com sucesso");
      setCode("");
      setTimeout(() => navigate("/pools", { replace: true }), 800);
    } catch (err: any) {
      if (err?.response?.data?.message === "Pool not found.") { toast.error("Bolão não encontrado"); return; }
      if (err?.response?.data?.message === "You already joined this pool.") { toast.error("Você já está nesse bolão"); return; }
      if (err?.response?.status === 404) { toast.error("Bolão não encontrado"); return; }
      toast.error("Não foi possível entrar no bolão");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .find-input {
          width: 100%;
          max-width: 500px;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(247,221,67,0.16);
          background: #0a0a14;
          color: #fff;
          font-size: 18px;
          text-align: center;
          font-family: monospace;
          letter-spacing: 0.1em;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .find-input:focus {
          border-color: rgba(247,221,67,0.5);
          box-shadow: 0 0 0 3px rgba(247,221,67,0.08), 0 0 20px rgba(247,221,67,0.05);
        }
        .find-input::placeholder { color: #2a2a3a; letter-spacing: 0.05em; font-size: 15px; font-family: inherit; }
      `}</style>

      <main style={{ color: "#fff", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{
          width: "100%",
          maxWidth: 680,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 24,
        }}>
          <h1 style={{
            fontSize: "clamp(20px, 5vw, 28px)",
            textAlign: "center",
            marginBottom: 8,
            fontWeight: 800,
            lineHeight: 1.3,
          }}>
            Encontre um bolão
          </h1>
          <p style={{ color: "#4a5060", marginBottom: 32, textAlign: "center", fontSize: 14 }}>
            Digite o código único do bolão para entrar.
          </p>

          <form
            onSubmit={handleJoinPool}
            style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
          >
            <input
              className="find-input"
              placeholder="Código do bolão"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                maxWidth: 500,
                padding: "14px 16px",
                borderRadius: 12,
                border: "none",
                background: "#F7DD43",
                color: "#06060b",
                fontWeight: 800,
                fontSize: 15,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.65 : 1,
                letterSpacing: "0.04em",
                boxShadow: "0 0 20px rgba(247,221,67,0.2)",
                transition: "box-shadow 0.2s",
              }}
            >
              {isLoading ? "Buscando..." : "ENTRAR NO BOLÃO"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
