import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/Api";
import toast from "react-hot-toast";

export default function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const isMobile = window.innerWidth <= 640;

  const navigate = useNavigate();

  async function handleJoinPool(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const cleanCode = code.trim().toUpperCase();

      if (!cleanCode) {
      toast.error("Informe o código");
      return;
    }
      await api.post("/pools/join", { code: cleanCode });

      toast.success("Você entrou no bolão com sucesso");
      setCode("");

      setTimeout(() => {
        navigate("/pools", { replace: true });
      }, 800);
    } catch (err: any) {
      console.log("JOIN POOL ERROR:", {
        status: err?.response?.status,
        data: err?.response?.data,
      });

      if (err?.response?.data?.message === "Pool not found.") {
    toast.error("Bolão não encontrado");
    return;
    }

    if (err?.response?.data?.message === "You already joined this pool.") {
      toast.error("Você já está nesse bolão");
      return;
    }

    if (err?.response?.status === 404) {
      toast.error("Bolão não encontrado");
      return;
    }

    toast.error("Não foi possível entrar no bolão");

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
    style={{
        color: "#fff",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: isMobile ? "12px" : "24px",
  }}
>
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: isMobile ? "12px" : "24px",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(22px, 5vw, 28px)",
            textAlign: "center",
            marginBottom: isMobile ? "16px" : "24px",
            lineHeight: 1.3,
          }}
        >
          Encontre um bolão através de <br />
          seu código único
        </h1>

        <form
          onSubmit={handleJoinPool}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <input
            placeholder="Qual código do bolão?"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "14px 16px",
              borderRadius: "10px",
              border: "1px solid #374151",
              backgroundColor: "#1f2937",
              color: "#fff",
              fontSize: "16px",
              textAlign: "center",
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "14px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#F7DD43",
              color: "#111827",
              fontWeight: 700,
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Buscando..." : "BUSCAR BOLÃO"}
          </button>
        </form>

        {errorMessage && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "#7f1d1d",
              color: "#fecaca",
              textAlign: "center",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "#166534",
              color: "#dcfce7",
              textAlign: "center",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            {successMessage}
          </div>
        )}
      </div>
    </main>
  );
}