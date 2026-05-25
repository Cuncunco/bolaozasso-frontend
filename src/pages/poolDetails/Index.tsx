import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/Api";
import { calendar } from "../../constants/Calendar";
import { useAuth } from "../../hooks/UseAuth";
import { GuessGameCard } from "../../components/GuessGameCard";
import toast from "react-hot-toast";

type PoolDetailsType = {
  id: string;
  title: string;
  code: string;
  owner?: { name: string | null };
  ownerId: string | null;
  participants: Array<{ id: string; user: { avatarUrl: string | null } }>;
  _count: { participants: number };
};

type GuessState = {
  [gameId: string]: { firstTeamPoints: string; secondTeamPoints: string };
};

type GuessResponseItem = {
  gameId: string;
  firstTeamPoints: number;
  secondTeamPoints: number;
};

export default function PoolDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [optionSelected, setOptionSelected] = useState<"Seus palpites" | "Ranking do grupo">("Seus palpites");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [poolDetails, setPoolDetails] = useState<PoolDetailsType | null>(null);
  const [guesses, setGuesses] = useState<GuessState>({});
  const [savedGuesses, setSavedGuesses] = useState<GuessState>({});
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [officialFirstTeamPoints, setOfficialFirstTeamPoints] = useState("");
  const [officialSecondTeamPoints, setOfficialSecondTeamPoints] = useState("");
  const [results, setResults] = useState<{
    [gameId: string]: { firstTeamPoints: number; secondTeamPoints: number };
  }>({});

  const selectedResult = selectedGameId ? results[selectedGameId] : null;
  const hasSelectedResult = !!selectedResult;

  const userId = (user as any)?.id ?? (user as any)?.sub ?? (user as any)?.userId ?? null;
  const isOwner = !!userId && !!poolDetails?.ownerId && poolDetails.ownerId === userId;

  const games = useMemo(() =>
    calendar.flatMap((day, dayIndex) =>
      day.games.map((game, gameIndex) => ({
        ...game,
        id: `${dayIndex}-${gameIndex}`,
        date: day.date,
        day: day.day,
      }))
    ), []);

  async function fetchPoolDetails(poolId: string) {
    try {
      const response = await api.get(`/pools/${poolId}`);
      setPoolDetails(response.data.pool);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Não foi possível carregar os detalhes do bolão");
      setPoolDetails(null);
    }
  }

  async function fetchGuesses(poolId: string) {
    try {
      const response = await api.get(`/pools/${poolId}/guesses`);
      const formatted = (response.data.guesses as GuessResponseItem[]).reduce((acc: GuessState, g) => {
        acc[g.gameId] = { firstTeamPoints: String(g.firstTeamPoints), secondTeamPoints: String(g.secondTeamPoints) };
        return acc;
      }, {});
      setGuesses(formatted);
      setSavedGuesses(formatted);
    } catch (error: any) {
      console.error("Erro ao carregar palpites:", error);
    }
  }

  async function fetchResults(poolId: string) {
    try {
      const response = await api.get(`/pools/${poolId}/results`);
      const formatted = (response.data.results || []).reduce((acc: any, r: any) => {
        acc[r.gameId] = { firstTeamPoints: r.firstTeamPoints, secondTeamPoints: r.secondTeamPoints };
        return acc;
      }, {});
      setResults(formatted);
    } catch (error) {
      console.error("Erro ao buscar resultados:", error);
    }
  }

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setIsLoading(true);
        await Promise.all([fetchPoolDetails(id), fetchGuesses(id), fetchResults(id)]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  function handleChangeGuess(gameId: string, field: "firstTeamPoints" | "secondTeamPoints", value: string) {
    if (!/^\d*$/.test(value)) return;
    setGuesses((prev) => ({
      ...prev,
      [gameId]: {
        firstTeamPoints: prev[gameId]?.firstTeamPoints ?? "",
        secondTeamPoints: prev[gameId]?.secondTeamPoints ?? "",
        [field]: value,
      },
    }));
  }

  async function handleSaveGuess(gameId: string) {
    if (!id) return;
    const current = guesses[gameId];
    if (!current?.firstTeamPoints || !current?.secondTeamPoints) {
      toast.error("Preencha os dois placares.");
      return;
    }
    try {
      setIsSubmitting(gameId);
      await api.post(`/pools/${id}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(current.firstTeamPoints),
        secondTeamPoints: Number(current.secondTeamPoints),
      });
      toast.success("Palpite salvo com sucesso.");
      await fetchGuesses(id);
      setSavedGuesses((prev) => ({
        ...prev,
        [gameId]: {
          firstTeamPoints: current.firstTeamPoints,
          secondTeamPoints: current.secondTeamPoints,
        },
      }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Não foi possível salvar o palpite.");
    } finally {
      setIsSubmitting(null);
    }
  }

  function openResultModal(gameId: string) {
    setSelectedGameId(gameId);
    setOfficialFirstTeamPoints("");
    setOfficialSecondTeamPoints("");
  }

  function closeResultModal() {
    setSelectedGameId(null);
    setOfficialFirstTeamPoints("");
    setOfficialSecondTeamPoints("");
  }

  async function handleSetOfficialResult() {
    if (!id || !selectedGameId) return;
    if (!officialFirstTeamPoints || !officialSecondTeamPoints) {
      toast.error("Preencha os dois placares.");
      return;
    }
    try {
      setIsSubmitting(`result-${selectedGameId}`);
      await api.post(`/pools/${id}/results`, {
        gameId: selectedGameId,
        firstTeamPoints: Number(officialFirstTeamPoints),
        secondTeamPoints: Number(officialSecondTeamPoints),
      });
      toast.success("Placar oficial definido com sucesso.");
      await fetchResults(id);
      closeResultModal();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Não foi possível definir o placar oficial.");
    } finally {
      setIsSubmitting(null);
    }
  }

  async function handleDeletePool() {
    if (!poolDetails?.id) return;
    const confirmed = window.confirm(
      "Tem certeza que deseja apagar este bolão?\n\nEssa ação é permanente e apagará todos os participantes e palpites."
    );
    if (!confirmed) return;
    try {
      setIsDeleting(true);
      await api.delete(`/pools/${poolDetails.id}`);
      navigate("/pools", { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Não foi possível apagar o bolão");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleShareCode() {
    if (!poolDetails?.code) { toast.error("Código não disponível."); return; }
    try {
      await navigator.clipboard.writeText(poolDetails.code);
      toast.success("Código copiado!");
    } catch {
      toast.success(`Código: ${poolDetails.code}`);
    }
  }

  const btnSecondary: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid rgba(247,221,67,0.18)",
    background: "transparent",
    color: "#9ca3af",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 13,
    transition: "border-color 0.2s, color 0.2s",
  };

  if (isLoading) {
    return (
      <main style={{ color: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 12, alignItems: "center", color: "#4a5060", padding: "32px 0" }}>
          <div style={{ width: 18, height: 18, border: "2px solid rgba(247,221,67,0.15)", borderTopColor: "#F7DD43", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
          Carregando bolão...
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </main>
    );
  }

  if (!poolDetails) {
    return (
      <main style={{ color: "#fff" }}>
        <button onClick={() => navigate("/pools")} style={btnSecondary}>← Voltar para bolões</button>
      </main>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .tab-btn {
          padding: 11px 18px;
          border-radius: 10px;
          border: 1px solid rgba(247,221,67,0.14);
          background: transparent;
          color: #4a5060;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .tab-btn.active {
          background: #F7DD43;
          color: #06060b;
          border-color: transparent;
          box-shadow: 0 0 14px rgba(247,221,67,0.3);
        }
        .tab-btn:not(.active):hover {
          border-color: rgba(247,221,67,0.35);
          color: #F7DD43;
        }
      `}</style>

      <main style={{ color: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 800, marginBottom: 4 }}>
                {poolDetails.title}
              </h1>
              <p style={{ color: "#4a5060", fontFamily: "monospace", letterSpacing: "0.08em", fontSize: 13 }}>
                {poolDetails.code}
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => navigate("/pools")} style={btnSecondary}>← Voltar</button>
              <button onClick={handleShareCode} style={btnSecondary}>Copiar código</button>
            </div>
          </div>

          {/* Info card */}
          <div style={{
            background: "#0e0e18",
            border: "1px solid rgba(247,221,67,0.12)",
            borderRadius: 16,
            padding: 18,
            marginBottom: 20,
          }}>
            <p style={{ marginBottom: 6, fontSize: 14 }}>
              <span style={{ color: "#4a5060", marginRight: 6 }}>Participantes:</span>
              <strong style={{ color: "#F7DD43" }}>{poolDetails._count.participants}</strong>
            </p>
            <p style={{ fontSize: 14 }}>
              <span style={{ color: "#4a5060", marginRight: 6 }}>Dono:</span>
              <strong>{poolDetails.owner?.name || "Não informado"}</strong>
            </p>

            {isOwner && (
              <button
                onClick={handleDeletePool}
                disabled={isDeleting}
                style={{
                  marginTop: 14,
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: "#7f1d1d",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: isDeleting ? 0.7 : 1,
                  fontSize: 13,
                }}
              >
                {isDeleting ? "Apagando..." : "Apagar bolão"}
              </button>
            )}
          </div>

          {poolDetails._count.participants > 0 ? (
            <>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                <button
                  className={`tab-btn${optionSelected === "Seus palpites" ? " active" : ""}`}
                  onClick={() => setOptionSelected("Seus palpites")}
                >
                  Seus palpites
                </button>
                <button
                  className="tab-btn"
                  onClick={() => navigate(`/pools/${id}/ranking`)}
                >
                  Ranking do grupo
                </button>
              </div>

              {/* Games */}
              <div style={{ display: "grid", gap: 16 }}>
                {games.map((game) => {
                  const result = results[game.id];
                  const hasResult = !!result;
                  const current = guesses[game.id] ?? { firstTeamPoints: "0", secondTeamPoints: "0" };
                  const saved = savedGuesses[game.id];
                  const savedGuess = saved
                    ? { firstTeamPoints: Number(saved.firstTeamPoints), secondTeamPoints: Number(saved.secondTeamPoints) }
                    : null;

                  return (
                    <GuessGameCard
                      key={game.id}
                      day={game.day}
                      date={game.date}
                      hour={game.hour}
                      player1={game.player1}
                      player2={game.player2}
                      firstTeamPoints={hasResult ? String(result.firstTeamPoints) : current.firstTeamPoints}
                      secondTeamPoints={hasResult ? String(result.secondTeamPoints) : current.secondTeamPoints}
                      savedGuess={savedGuess}
                      onChangeFirst={(v) => !hasResult && handleChangeGuess(game.id, "firstTeamPoints", v)}
                      onChangeSecond={(v) => !hasResult && handleChangeGuess(game.id, "secondTeamPoints", v)}
                      onSaveGuess={() => !hasResult && handleSaveGuess(game.id)}
                      onSetResult={() => !hasResult && openResultModal(game.id)}
                      isSaving={isSubmitting === game.id || isSubmitting === `result-${game.id}`}
                      isOwner={isOwner}
                      hasResult={hasResult}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{
              background: "#0e0e18",
              border: "1px solid rgba(247,221,67,0.1)",
              borderRadius: 16,
              padding: 28,
              textAlign: "center",
            }}>
              <p style={{ marginBottom: 10 }}>Esse bolão ainda não tem participantes.</p>
              <p style={{ color: "#4a5060", fontSize: 14 }}>
                Compartilhe o código{" "}
                <strong style={{ color: "#F7DD43", fontFamily: "monospace" }}>{poolDetails.code}</strong>{" "}
                para convidar outras pessoas.
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedGameId && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: 16,
          }}>
            <div style={{
              width: "100%",
              maxWidth: 400,
              background: "#0e0e18",
              border: "1px solid rgba(247,221,67,0.2)",
              borderRadius: 20,
              padding: 28,
              color: "#fff",
              boxShadow: "0 0 40px rgba(247,221,67,0.08)",
            }}>
              <h2 style={{ marginBottom: 8, fontSize: 22, fontWeight: 800 }}>Placar oficial</h2>
              <p style={{ marginBottom: 22, color: "#4a5060", fontSize: 14 }}>
                Informe o resultado oficial do jogo.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 24 }}>
                {hasSelectedResult ? (
                  <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 32, fontWeight: 800, color: "#F7DD43" }}>
                    <span>{selectedResult?.firstTeamPoints}</span>
                    <span style={{ color: "#4a5060", fontSize: 20 }}>×</span>
                    <span>{selectedResult?.secondTeamPoints}</span>
                  </div>
                ) : (
                  <>
                    {[
                      { value: officialFirstTeamPoints, onChange: setOfficialFirstTeamPoints },
                      { value: officialSecondTeamPoints, onChange: setOfficialSecondTeamPoints },
                    ].map((input, i) => (
                      <input
                        key={i}
                        value={input.value}
                        onChange={(e) => { if (/^\d*$/.test(e.target.value)) input.onChange(e.target.value); }}
                        inputMode="numeric"
                        placeholder="0"
                        disabled={isSubmitting === `result-${selectedGameId}`}
                        style={{
                          width: 88,
                          height: 72,
                          borderRadius: 14,
                          border: "1px solid rgba(247,221,67,0.2)",
                          background: "#0a0a14",
                          color: "#fff",
                          textAlign: "center",
                          fontSize: 32,
                          fontWeight: 700,
                          outline: "none",
                          fontFamily: "inherit",
                        }}
                      />
                    ))}
                  </>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
                <button onClick={closeResultModal} style={btnSecondary}>Cancelar</button>
                {!hasSelectedResult && (
                  <button
                    onClick={handleSetOfficialResult}
                    disabled={isSubmitting === `result-${selectedGameId}`}
                    style={{
                      padding: "11px 18px",
                      borderRadius: 10,
                      border: "none",
                      background: "#F7DD43",
                      color: "#06060b",
                      fontWeight: 800,
                      cursor: "pointer",
                      opacity: isSubmitting === `result-${selectedGameId}` ? 0.65 : 1,
                      fontSize: 14,
                    }}
                  >
                    {isSubmitting === `result-${selectedGameId}` ? "Salvando..." : "Salvar resultado"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
