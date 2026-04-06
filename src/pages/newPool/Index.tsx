import { useState } from "react";
import { api } from "../../services/Api";
import toast from "react-hot-toast";

export default function NewPool() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = window.innerWidth <= 640;
  async function handlePoolCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Informe um nome para seu bolão");
      return;
    }

    try {
      setIsLoading(true);
    

      await api.post("/pools", { title });

      setTitle("");
      toast.success("Bolão criado com sucesso");
    } catch (error: any) {
  const message =
    error?.response?.data?.message || "Não foi possível criar o bolão.";

  toast.error(message);
} finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      style={{
        backgroundColor: "transparent",
        color: "#fff",
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
        <img
          src="/logo.svg"
          alt="Bolãozasso"
          style={{
            width: isMobile ? "240px" : "400px",
            maxWidth: "100%",
            height: "auto",
            marginBottom: isMobile ? "16px" : "24px",
          }}
        />

        <h1
          style={{
            fontSize: "clamp(22px, 5vw, 28px)",
            textAlign: "center",
            marginBottom: isMobile ? "16px" : "24px",
            lineHeight: 1.3,
          }}
        >
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <form
          onSubmit={handlePoolCreate}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <input
            placeholder="Qual nome do seu bolão?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            {isLoading ? "Criando..." : "Criar meu bolão"}
          </button>
        </form>

        

        

        <p
          style={{
            color: "#d1d5db",
            fontSize: "14px",
            textAlign: "center",
            marginTop: "20px",
            maxWidth: "520px",
            lineHeight: 1.6,
          }}
        >
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outra pessoa.
        </p>
      </div>
    </main>
  );
}