import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/Api";
import toast from "react-hot-toast";

type PoolProps = {
  id: string;
  title: string;
  code: string;
  createdAt?: string;
  _count?: { participants: number };
};

export default function Pools() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolProps[]>([]);

  const fetchPools = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/pools");
      setPools(response.data.pools ?? []);
    } catch {
      toast.error("Não foi possível carregar os bolões");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPools(); }, [fetchPools]);

  return (
    <>
      <style>{`
        .pools-card {
          width: 100%;
          text-align: left;
          background: #0e0e18;
          border: 1px solid rgba(247,221,67,0.12);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          color: #fff;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .pools-card:hover {
          border-color: rgba(247,221,67,0.35);
          box-shadow: 0 0 20px rgba(247,221,67,0.08);
          transform: translateY(-1px);
        }
        .pools-empty {
          padding: 48px 24px;
          text-align: center;
          border: 1px solid rgba(247,221,67,0.10);
          border-radius: 16px;
          background: #0e0e18;
          color: #4a5060;
        }
      `}</style>

      <main style={{ color: "#fff" }}>
        <div style={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
          <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
            gap: 16,
            flexWrap: "wrap",
          }}>
            <h1 style={{ fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 800 }}>
              Meus bolões
            </h1>

            <button
              onClick={() => navigate("/find")}
              style={{
                background: "#F7DD43",
                color: "#06060b",
                border: "none",
                borderRadius: 12,
                padding: "11px 18px",
                fontWeight: 800,
                cursor: "pointer",
                fontSize: 14,
                letterSpacing: "0.03em",
                boxShadow: "0 0 16px rgba(247,221,67,0.25)",
                transition: "box-shadow 0.2s",
              }}
            >
              Buscar por código
            </button>
          </header>

          {isLoading ? (
            <div style={{ display: "flex", gap: 12, alignItems: "center", color: "#4a5060", padding: "20px 0" }}>
              <div style={spinner} />
              Carregando bolões...
            </div>
          ) : pools.length === 0 ? (
            <div className="pools-empty">
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚽</div>
              <p style={{ fontWeight: 700, marginBottom: 6, color: "#fff" }}>Nenhum bolão ainda</p>
              <p style={{ fontSize: 14 }}>Crie um bolão ou entre em um pelo código.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {pools.map((pool) => (
                <button
                  key={pool.id}
                  className="pools-card"
                  onClick={() => navigate(`/pools/${pool.id}`)}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}>
                    <div>
                      <h2 style={{ fontSize: "clamp(16px, 4vw, 19px)", fontWeight: 700, marginBottom: 4 }}>
                        {pool.title}
                      </h2>
                      <p style={{ color: "#4a5060", fontSize: 13, fontFamily: "monospace", letterSpacing: "0.08em" }}>
                        {pool.code}
                      </p>
                    </div>

                    <div style={{
                      background: "rgba(247,221,67,0.08)",
                      border: "1px solid rgba(247,221,67,0.2)",
                      borderRadius: 8,
                      padding: "6px 12px",
                      color: "#F7DD43",
                      fontWeight: 700,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                    }}>
                      {pool._count?.participants ?? 0} participantes
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

const spinner: React.CSSProperties = {
  width: 18,
  height: 18,
  border: "2px solid rgba(247,221,67,0.15)",
  borderTopColor: "#F7DD43",
  borderRadius: "50%",
  animation: "spin .7s linear infinite",
};
