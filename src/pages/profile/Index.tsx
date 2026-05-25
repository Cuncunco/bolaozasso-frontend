import { useRef, useState } from "react";
import { api } from "../../services/Api";
import { useAuth } from "../../hooks/UseAuth";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, signOut, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [preview, setPreview] = useState<string | null>(user?.avatarUrl ?? null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSaveProfile() {
    try {
      setIsSaving(true);
      let avatarUrl = user?.avatarUrl ?? null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const token = api.defaults.headers.common["Authorization"];
        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
          method: "POST",
          headers: { Authorization: token as string },
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error("Erro ao fazer upload da foto");
        const uploadData = await uploadResponse.json();
        avatarUrl = uploadData.fileUrl;
      }

      const profileResponse = await api.put("/users/profile", { name, avatarUrl });
      updateUser(profileResponse.data.user);
      toast.success("Perfil atualizado com sucesso.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Não foi possível atualizar o perfil.");
    } finally {
      setIsSaving(false);
    }
  }

  const initial = (name || user?.name || "?").charAt(0).toUpperCase();

  return (
    <>
      <style>{`
        .profile-input {
          width: 100%;
          height: 50px;
          border-radius: 12px;
          border: 1px solid rgba(247,221,67,0.14);
          background: #0a0a14;
          color: #fff;
          padding: 0 16px;
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .profile-input:focus {
          border-color: rgba(247,221,67,0.45);
          box-shadow: 0 0 0 3px rgba(247,221,67,0.07);
        }
        .profile-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .info-card {
          background: #0e0e18;
          border: 1px solid rgba(247,221,67,0.1);
          border-radius: 16px;
          padding: 22px;
          transition: border-color 0.2s;
        }
        .info-card:hover { border-color: rgba(247,221,67,0.2); }
      `}</style>

      <main style={{ color: "#fff" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gap: 20 }}>

          {/* Main card */}
          <section style={{
            background: "linear-gradient(135deg, #0e0e18 0%, #12121e 100%)",
            border: "1px solid rgba(247,221,67,0.15)",
            borderRadius: 22,
            padding: "clamp(18px, 4vw, 32px)",
            boxShadow: "0 0 40px rgba(247,221,67,0.04)",
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "clamp(160px, 22vw, 200px) 1fr",
              gap: "clamp(16px, 4vw, 28px)",
              alignItems: "start",
            }}>
              {/* Avatar */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: "clamp(110px, 18vw, 160px)",
                  height: "clamp(110px, 18vw, 160px)",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid rgba(247,221,67,0.6)",
                  background: "#12121e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 24px rgba(247,221,67,0.15)",
                  flexShrink: 0,
                }}>
                  {preview ? (
                    <img src={preview} alt="Foto" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "clamp(36px, 8vw, 56px)", fontWeight: 800, color: "#F7DD43" }}>
                      {initial}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(247,221,67,0.2)",
                    background: "transparent",
                    color: "#F7DD43",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 13,
                    transition: "background 0.2s",
                  }}
                >
                  Escolher foto
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </div>

              {/* Fields */}
              <div>
                <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 800, marginBottom: 8, lineHeight: 1.1 }}>
                  Meu perfil
                </h1>
                <p style={{ color: "#4a5060", marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
                  Atualize seu nome e foto para aparecer nos bolões e no ranking.
                </p>

                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 700, fontSize: 13, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Nome
                    </label>
                    <input
                      className="profile-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 700, fontSize: 13, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      E-mail
                    </label>
                    <input
                      className="profile-input"
                      value={user?.email ?? ""}
                      disabled
                    />
                  </div>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      style={{
                        padding: "12px 20px",
                        borderRadius: 12,
                        border: "none",
                        background: "#F7DD43",
                        color: "#06060b",
                        fontWeight: 800,
                        cursor: isSaving ? "not-allowed" : "pointer",
                        opacity: isSaving ? 0.65 : 1,
                        boxShadow: "0 0 16px rgba(247,221,67,0.2)",
                        fontSize: 14,
                      }}
                    >
                      {isSaving ? "Salvando..." : "Salvar perfil"}
                    </button>

                    <button
                      type="button"
                      onClick={signOut}
                      style={{
                        padding: "12px 20px",
                        borderRadius: 12,
                        border: "none",
                        background: "#7f1d1d",
                        color: "#fff",
                        fontWeight: 800,
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Info cards */}
          <section style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}>
            {[
              { icon: "🏆", title: "Ranking", text: "Veja sua posição e evolução nos bolões." },
              { icon: "📸", title: "Avatar", text: "Sua foto aparece nos grupos e ranking." },
              { icon: "⚽", title: "Desempenho", text: "Acertos, pontos e estatísticas em breve." },
            ].map((card) => (
              <div key={card.title} className="info-card">
                <span style={{ fontSize: 26, display: "block", marginBottom: 10 }}>{card.icon}</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#F7DD43" }}>{card.title}</h3>
                <p style={{ color: "#4a5060", lineHeight: 1.5, fontSize: 14 }}>{card.text}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
