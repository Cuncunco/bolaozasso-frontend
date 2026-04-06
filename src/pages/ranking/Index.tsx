import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/Api";

type RankingItem = {
  position: number;
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

function getPositionDisplay(position: number) {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";
  return `${position}º`;
}

export default function Ranking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 640;

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

        const [poolResponse, rankingResponse] = await Promise.all([
          api.get(`/pools/${id}`),
          api.get(`/pools/${id}/ranking`),
        ]);

        setPool(poolResponse.data.pool);
        setRanking(rankingResponse.data.ranking ?? []);
      } catch (error: any) {
        const msg =
          error?.response?.data?.message ||
          "Não foi possível carregar o ranking.";

        setMessage(msg);
      } finally {
        setIsLoading(false);
      }
    }

    loadRanking();
  }, [id]);

  if (isLoading) {
    return (
      <main style={{ color: "#fff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p>Carregando ranking...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ color: "#fff" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "clamp(24px, 6vw, 32px)", marginBottom: "6px" }}>
              Ranking do grupo
            </h1>
            <p style={{ color: "#b7c2bc" }}>
              {pool?.title
                ? `Bolão: ${pool.title}`
                : "Classificação dos participantes"}
            </p>
          </div>

          <button
            onClick={() => navigate(`/pools/${id}`)}
            style={secondaryButton}
          >
            Voltar para detalhes
          </button>
        </div>

        {message && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "#7f1d1d",
              color: "#fecaca",
            }}
          >
            {message}
          </div>
        )}

        {!message && ranking.length === 0 && (
          <div
            style={{
              backgroundColor: "#0d241b",
              border: "1px solid #294136",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <p style={{ marginBottom: "8px" }}>Ainda não há ranking disponível.</p>
            <p style={{ color: "#b7c2bc" }}>
              Isso acontece quando ainda não existem resultados oficiais
              suficientes para calcular a pontuação.
            </p>
          </div>
        )}

        {ranking.length > 0 && (
          <div
            style={{
              backgroundColor: "#0d241b",
              border: "1px solid #294136",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
              gridTemplateColumns: isMobile ? "70px 1fr 80px" : "100px 1fr 120px",
                gap: "12px",
              padding: isMobile ? "14px 12px" : "16px 20px",
                backgroundColor: "#15281f",
                fontWeight: 700,
              }}
            >
              <span>Posição</span>
              <span>Participante</span>
              <span style={{ textAlign: "right" }}>Pontos</span>
            </div>

            {ranking.map((item) => {
              const isTop3 = item.position <= 3;

              return (
                <div
                  key={item.userId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "70px 1fr 80px" : "100px 1fr 120px",
                    gap: "12px",
                    padding: isMobile ? "14px 12px" : "16px 20px",
                    borderTop: "1px solid #294136",
                    alignItems: "center",
                    backgroundColor: isTop3 ? "#132018" : "transparent",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: item.position <= 3 ? (isMobile ? "22px" : "28px") : (isMobile ? "16px" : "18px"),
                    }}
                  >
                    {getPositionDisplay(item.position)}
                  </span>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      minWidth: 0,
                    }}
                  >
                    {item.user.avatarUrl ? (
                      <img
                        src={item.user.avatarUrl}
                        alt={item.user.name ?? "Participante"}
                        style={{
                          width: isMobile ? "34px" : "42px",
                          height: isMobile ? "34px" : "42px",
                          borderRadius: "999px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: isMobile ? "34px" : "42px",
                          height: isMobile ? "34px" : "42px",
                          borderRadius: "999px",
                          backgroundColor: "#294136",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                        }}
                      >
                        {(item.user.name ?? "?").charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {item.user.name || "Usuário sem nome"}
                      </div>

                      {item.position <= 3 && (
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#F7DD43",
                            marginTop: "2px",
                            fontWeight: 600,
                          }}
                        >
                          {item.position === 1 && "1º lugar"}
                          {item.position === 2 && "2º lugar"}
                          {item.position === 3 && "3º lugar"}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    style={{
                      textAlign: "right",
                      fontWeight: 700,
                      color: item.position <= 3 ? "#F7DD43" : "#fff",
                    }}
                  >
                    {item.points}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

const secondaryButton: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid #294136",
  backgroundColor: "#15281f",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};