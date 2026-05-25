import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/Api";
import { useTheme } from "../../contexts/ThemeContext";

type RankingItem = {
  rank: number;
  userId: string;
  points: number;
  user: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
};

type PoolType = {
  id: string;
  title: string;
  code: string;
};

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

function Avatar({
  url,
  name,
  size,
  borderColor,
}: {
  url: string | null;
  name: string | null;
  size: number;
  borderColor: string;
}) {
  const initial = (name ?? "?").charAt(0).toUpperCase();
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    border: `2.5px solid ${borderColor}`,
    objectFit: "cover",
    flexShrink: 0,
  };

  if (url) return <img src={url} alt={name ?? "avatar"} style={style} />;

  return (
    <div
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.12)",
        fontWeight: 700,
        fontSize: size * 0.38,
        color: "#fff",
      }}
    >
      {initial}
    </div>
  );
}

function PodiumCard({
  item,
  podiumHeight,
}: {
  item: RankingItem;
  podiumHeight: number;
}) {
  const configs: Record<number, { accent: string; border: string; glow: string; size: number }> = {
    1: {
      accent: "#F7DD43",
      border: "rgba(247,221,67,0.5)",
      glow: "0 0 24px rgba(247,221,67,0.25)",
      size: 64,
    },
    2: {
      accent: "#C0C0C0",
      border: "rgba(192,192,192,0.4)",
      glow: "0 0 16px rgba(192,192,192,0.15)",
      size: 54,
    },
    3: {
      accent: "#CD7F32",
      border: "rgba(205,127,50,0.4)",
      glow: "0 0 16px rgba(205,127,50,0.15)",
      size: 54,
    },
  };

  const c = configs[item.rank];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: item.rank === 1 ? "0 0 33%" : "0 0 28%",
        gap: "8px",
      }}
    >
      <span style={{ fontSize: item.rank === 1 ? "36px" : "28px" }}>
        {MEDAL[item.rank]}
      </span>

      <Avatar
        url={item.user.avatarUrl}
        name={item.user.name}
        size={c.size}
        borderColor={c.accent}
      />

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontWeight: 700,
            color: "#fff",
            fontSize: item.rank === 1 ? "15px" : "13px",
            maxWidth: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.user.name || "Sem nome"}
        </div>
        <div style={{ color: c.accent, fontWeight: 800, fontSize: item.rank === 1 ? "20px" : "16px" }}>
          {item.points} pts
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: podiumHeight,
          background: `linear-gradient(180deg, ${c.accent}22 0%, ${c.accent}0d 100%)`,
          border: `1px solid ${c.border}`,
          borderBottom: "none",
          borderRadius: "8px 8px 0 0",
          boxShadow: c.glow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: "22px",
          color: c.accent,
        }}
      >
        {item.rank}º
      </div>
    </div>
  );
}

const RULES = [
  { pts: 5, label: "Placar perfeito",          detail: "Acertou o placar exato",              icon: "🎯" },
  { pts: 3, label: "Resultado correto",         detail: "Acertou quem ganhou ou o empate",     icon: "✅" },
  { pts: 1, label: "Total de gols",             detail: "Acertou a soma dos gols da partida",  icon: "⚽" },
];

export default function Ranking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isLoading, setIsLoading] = useState(true);
  const [pool, setPool] = useState<PoolType | null>(null);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadRanking() {
      if (!id) return;
      try {
        setIsLoading(true);
        setMessage("");
        const [poolRes, rankRes] = await Promise.all([
          api.get(`/pools/${id}`),
          api.get(`/pools/${id}/ranking`),
        ]);
        setPool(poolRes.data.pool);
        setRanking(rankRes.data.ranking ?? []);
      } catch (error: any) {
        setMessage(
          error?.response?.data?.message || "Não foi possível carregar o ranking."
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadRanking();
  }, [id]);

  const cardBg = "#0e0e18";
  const cardBorder = "rgba(247,221,67,0.12)";
  const rowHover = "rgba(247,221,67,0.04)";
  const mutedText = "#4a5060";

  if (isLoading) {
    return (
      <main style={{ color: "#fff" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 0" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="ranking-spinner" />
            <span style={{ color: mutedText }}>Carregando ranking...</span>
          </div>
          <style>{`.ranking-spinner{width:20px;height:20px;border:2.5px solid #294136;border-top-color:#F7DD43;border-radius:50%;animation:spin .7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </main>
    );
  }

  const top3 = ranking.filter((r) => r.rank <= 3);
  const rest = ranking.filter((r) => r.rank > 3);

  const podiumOrder =
    top3.length === 3
      ? [top3[1], top3[0], top3[2]]
      : top3.length === 2
      ? [top3[1], top3[0]]
      : top3;

  return (
    <>
      <style>{`
        .ranking-row {
          display: grid;
          grid-template-columns: 56px 1fr auto;
          gap: 12px;
          padding: 14px 20px;
          border-top: 1px solid ${cardBorder};
          align-items: center;
          transition: background 0.15s;
        }
        .ranking-row:hover { background: ${rowHover}; }

        @media (max-width: 480px) {
          .ranking-row { padding: 12px 14px; gap: 10px; }
          .ranking-header-row { padding: 12px 14px !important; }
        }
      `}</style>

      <main style={{ color: "#fff" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            <div>
              <h1 style={{ fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 800, marginBottom: "4px" }}>
                🏆 Ranking
              </h1>
              <p style={{ color: mutedText, fontSize: "14px" }}>
                {pool?.title ? `Bolão: ${pool.title}` : "Classificação dos participantes"}
              </p>
            </div>
            <button onClick={() => navigate(`/pools/${id}`)} style={backBtn}>
              ← Voltar
            </button>
          </div>

          {/* Erro */}
          {message && (
            <div style={errorBox}>{message}</div>
          )}

          {/* Vazio */}
          {!message && ranking.length === 0 && (
            <div style={{ ...card(cardBg, cardBorder), textAlign: "center", padding: "48px 24px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📋</div>
              <p style={{ fontWeight: 700, marginBottom: "6px" }}>Sem ranking ainda</p>
              <p style={{ color: mutedText, fontSize: "14px" }}>
                O ranking aparece quando houver resultados oficiais cadastrados.
              </p>
            </div>
          )}

          {/* Regras de pontuação */}
          <div style={{
            ...card(cardBg, cardBorder),
            marginBottom: "16px",
            padding: "20px",
          }}>
            <h3 style={{
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: mutedText,
              marginBottom: "14px",
            }}>
              Sistema de pontuação
            </h3>
            <div style={{ display: "grid", gap: "10px" }}>
              {RULES.map((rule) => (
                <div key={rule.pts} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{rule.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>{rule.label}</span>
                    <span style={{ color: mutedText, fontSize: "13px" }}> — {rule.detail}</span>
                  </div>
                  <span style={{
                    background: "rgba(247,221,67,0.1)",
                    border: "1px solid rgba(247,221,67,0.25)",
                    borderRadius: "8px",
                    padding: "3px 10px",
                    color: "#F7DD43",
                    fontWeight: 800,
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}>
                    {rule.pts} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {ranking.length > 0 && (
            <>
              {/* Pódio */}
              {top3.length > 0 && (
                <div
                  style={{
                    ...card(cardBg, cardBorder),
                    marginBottom: "16px",
                    padding: "28px 16px 0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {podiumOrder.map((item) => (
                      <PodiumCard
                        key={item.userId}
                        item={item}
                        podiumHeight={item.rank === 1 ? 72 : item.rank === 2 ? 52 : 36}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Lista do 4º em diante */}
              {rest.length > 0 && (
                <div style={card(cardBg, cardBorder)}>
                  <div
                    className="ranking-header-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "56px 1fr auto",
                      gap: "12px",
                      padding: "14px 20px",
                      background: "rgba(247,221,67,0.04)",
                      fontWeight: 700,
                      fontSize: "13px",
                      color: mutedText,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <span>Pos.</span>
                    <span>Participante</span>
                    <span>Pts</span>
                  </div>

                  {rest.map((item) => (
                    <div key={item.userId} className="ranking-row">
                      <span style={{ fontWeight: 700, fontSize: "18px", color: mutedText }}>
                        {item.rank}º
                      </span>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        <Avatar
                          url={item.user.avatarUrl}
                          name={item.user.name}
                          size={36}
                          borderColor={cardBorder}
                        />
                        <span
                          style={{
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.user.name || "Sem nome"}
                        </span>
                      </div>

                      <span style={{ fontWeight: 700, fontSize: "16px", whiteSpace: "nowrap" }}>
                        {item.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

function card(bg: string, border: string): React.CSSProperties {
  return {
    backgroundColor: bg,
    border: `1px solid ${border}`,
    borderRadius: "16px",
    overflow: "hidden",
  };
}

const backBtn: React.CSSProperties = {
  padding: "9px 16px",
  borderRadius: "10px",
  border: "1px solid rgba(247,221,67,0.16)",
  backgroundColor: "transparent",
  color: "#4a5060",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

const errorBox: React.CSSProperties = {
  marginBottom: "16px",
  padding: "12px 16px",
  borderRadius: "10px",
        backgroundColor: "#450a0a",
        border: "1px solid rgba(239,68,68,0.3)",
  color: "#fecaca",
  fontSize: "14px",
};
