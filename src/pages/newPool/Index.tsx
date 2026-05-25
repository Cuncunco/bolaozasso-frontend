import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/Api";
import toast from "react-hot-toast";

export default function NewPool() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handlePoolCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Informe um nome para seu bolão");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/pools", { title });
      toast.success("Bolão criado com sucesso!");
      navigate(`/pools/${response.data.id}`, { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Não foi possível criar o bolão.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .new-pool-input {
          width: 100%;
          max-width: 500px;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(247,221,67,0.16);
          background: #0a0a14;
          color: #fff;
          font-size: 16px;
          text-align: center;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .new-pool-input:focus {
          border-color: rgba(247,221,67,0.5);
          box-shadow: 0 0 0 3px rgba(247,221,67,0.08);
        }
        .new-pool-input::placeholder { color: #2a2a3a; }
      `}</style>

      <main style={{ backgroundColor: "transparent", color: "#fff" }}>
        <div style={{
          width: "100%",
          maxWidth: 700,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 24,
        }}>
          <img
            src="/logo.svg"
            alt="Bolãozasso"
            style={{ width: "clamp(200px, 50vw, 360px)", maxWidth: "100%", marginBottom: 24 }}
          />

          <h1 style={{
            fontSize: "clamp(20px, 5vw, 26px)",
            textAlign: "center",
            marginBottom: 28,
            lineHeight: 1.4,
            fontWeight: 800,
          }}>
            Crie seu bolão e<br />compartilhe com amigos!
          </h1>

          <form
            onSubmit={handlePoolCreate}
            style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
          >
            <input
              className="new-pool-input"
              placeholder="Nome do seu bolão"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              }}
            >
              {isLoading ? "Criando..." : "CRIAR MEU BOLÃO"}
            </button>
          </form>

          <p style={{ color: "#3a3a50", fontSize: 13, textAlign: "center", marginTop: 20, maxWidth: 480, lineHeight: 1.6 }}>
            Após criar, você receberá um código único para convidar participantes.
          </p>
        </div>
      </main>
    </>
  );
}
