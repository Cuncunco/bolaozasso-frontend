import { useRef, useState } from "react";
import { api } from "../../services/Api";
import { useAuth } from "../../hooks/UseAuth";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, signOut } = useAuth();
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [preview, setPreview] = useState<string | null>(user?.avatarUrl ?? null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleOpenFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSaveProfile() {
    try {
      setIsSaving(true);
      setMessage("");

      let avatarUrl = user?.avatarUrl ?? null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const token = api.defaults.headers.common["Authorization"];

        const uploadResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/upload`,
          {
            method: "POST",
            headers: {
              Authorization: token as string,
            },
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Erro ao fazer upload da foto");
        }

        const uploadData = await uploadResponse.json();
        avatarUrl = uploadData.fileUrl;
      }

      await api.put("/users/profile", { name, avatarUrl });

      toast.success("Perfil atualizado com sucesso.");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Não foi possível atualizar o perfil.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main style={{ color: "#fff" }}>
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          display: "grid",
          gap: isMobile ? "16px" : "24px",
        }}
      >
        <section
          style={{
            background: "linear-gradient(135deg, #123f30 0%, #0d2d22 100%)",
            border: "1px solid rgba(247, 221, 67, 0.12)",
            borderRadius: "24px",
            padding: isMobile ? "18px" : "32px",
            boxShadow: "0 18px 40px rgba(0,0,0,0.20)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "220px 1fr",
              gap: isMobile ? "18px" : "28px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: isSmallMobile ? "120px" : isMobile ? "140px" : "170px",
                  height: isSmallMobile ? "120px" : isMobile ? "140px" : "170px",
                  borderRadius: "999px",
                  overflow: "hidden",
                  border: "4px solid rgba(247, 221, 67, 0.85)",
                  background: "#0a2018",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Foto de perfil"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "56px" }}>👤</span>
                )}
              </div>

              <button type="button" onClick={handleOpenFilePicker} style={secondaryButton}>
                Escolher foto
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            <div>
              <h1 style={{ fontSize: isSmallMobile ? "28px" : isMobile ? "34px" : "42px", marginBottom: "10px", lineHeight: 1.1 }}>
                Meu perfil
              </h1>

              <p style={{ color: "#d7e3dc", marginBottom: "26px", fontSize: "17px" }}>
                Atualize seu nome e sua foto para aparecer nos bolões e no ranking do grupo.
              </p>

              <div style={{ display: "grid", gap: "18px" }}>
                <div>
                  <label style={labelStyle}>Nome</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>E-mail</label>
                  <input
                    value={user?.email ?? ""}
                    disabled
                    style={{ ...inputStyle, opacity: 0.8, cursor: "not-allowed" }}
                  />
                </div>

                {message && (
                  <div
                    style={{
                      padding: "12px 14px",
                      borderRadius: "12px",
                      backgroundColor: "#173b2e",
                      color: "#fff",
                    }}
                  >
                    {message}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginTop: "6px",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    style={{ ...primaryButton, opacity: isSaving ? 0.7 : 1 }}
                  >
                    {isSaving ? "Salvando..." : "Salvar perfil"}
                  </button>

                  <button type="button" onClick={signOut} style={dangerButton}>
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: isSmallMobile ? "1fr" : isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: "18px",
          }}
        >
          <div style={infoCard}>
            <span style={infoCardEmoji}>🏆</span>
            <h3 style={infoCardTitle}>Ranking</h3>
            <p style={infoCardText}>Em breve, veja sua posição e evolução nos bolões.</p>
          </div>

          <div style={infoCard}>
            <span style={infoCardEmoji}>📸</span>
            <h3 style={infoCardTitle}>Avatar</h3>
            <p style={infoCardText}>Sua foto aparecerá nos grupos, palpites e ranking.</p>
          </div>

          <div style={infoCard}>
            <span style={infoCardEmoji}>⚽</span>
            <h3 style={infoCardTitle}>Desempenho</h3>
            <p style={infoCardText}>Depois você pode ver acertos, pontos e estatísticas.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 700,
  color: "#f2f6f3",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "52px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.12)",
  backgroundColor: "#10271e",
  color: "#fff",
  padding: "0 16px",
  fontSize: "16px",
  outline: "none",
};

const primaryButton: React.CSSProperties = {
  padding: "13px 18px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#F7DD43",
  color: "#132018",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.16)",
  backgroundColor: "#10271e",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const dangerButton: React.CSSProperties = {
  padding: "13px 18px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#dc2626",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const infoCard: React.CSSProperties = {
  backgroundColor: "#0f281f",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "18px",
  padding: "22px",
};

const infoCardEmoji: React.CSSProperties = {
  display: "inline-block",
  fontSize: "28px",
  marginBottom: "10px",
};

const infoCardTitle: React.CSSProperties = {
  fontSize: "20px",
  marginBottom: "8px",
};

const infoCardText: React.CSSProperties = {
  color: "#c8d5ce",
  lineHeight: 1.5,
};