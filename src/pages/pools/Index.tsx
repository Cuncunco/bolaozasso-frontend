import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/Api";
import toast from "react-hot-toast";

type PoolProps = {
  id: string;
  title: string;
  code: string;
  createdAt?: string;
  _count?: {
    participants: number;
  };
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
    } catch (error) {
      console.log("FETCH POOLS ERROR:", error);
      toast.error("Não foi possível carregar os bolões");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: "#fff",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            Meus bolões
          </h1>

          <button
            onClick={() => navigate("/find")}
            style={{
              backgroundColor: "#F7DD43",
              color: "#111827",
              border: "none",
              borderRadius: "10px",
              padding: "12px 16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Buscar bolão por código
          </button>
        </header>

        
        

        {isLoading ? (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            Carregando bolões...
          </div>
        ) : pools.length === 0 ? (
          <div
            style={{
              padding: "40px 24px",
              textAlign: "center",
              border: "1px solid #374151",
              borderRadius: "16px",
              backgroundColor: "#111827",
              color: "#9ca3af",
            }}
          >
            Você ainda não participa de nenhum bolão.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            {pools.map((pool) => (
              <button
                key={pool.id}
                onClick={() => navigate(`/pools/${pool.id}`)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: "1px solid #374151",
                  backgroundColor: "#111827",
                  borderRadius: "16px",
                  padding: "18px",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        marginBottom: "6px",
                      }}
                    >
                      {pool.title}
                    </h2>

                    <p
                      style={{
                        color: "#9ca3af",
                        fontSize: "14px",
                      }}
                    >
                      Código: {pool.code}
                    </p>
                  </div>

                  <div
                    style={{
                      color: "#F7DD43",
                      fontWeight: 700,
                      fontSize: "14px",
                    }}
                  >
                    {(pool._count?.participants ?? 0)} participantes
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}