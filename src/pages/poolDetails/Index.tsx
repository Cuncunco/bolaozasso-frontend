import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/Api";
import { calendar } from "../../constants/Calendar";
import { useAuth } from "../../hooks/UseAuth";
import { GuessGameCard } from "../../components/GuessGameCard";

type PoolDetailsType = {
  id: string;
  title: string;
  code: string;
  owner?: { name: string | null };
  ownerId: string | null;
  participants: Array<{
    id: string;
    user: { avatarUrl: string | null };
  }>;
  _count: { participants: number };
};

type GuessState = {
  [gameId: string]: {
    firstTeamPoints: string;
    secondTeamPoints: string;
  };
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

  const [optionSelected, setOptionSelected] = useState<
    "Seus palpites" | "Ranking do grupo"
  >("Seus palpites");

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const [poolDetails, setPoolDetails] = useState<PoolDetailsType | null>(null);
  const [message, setMessage] = useState("");
  const [guesses, setGuesses] = useState<GuessState>({});

  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [officialFirstTeamPoints, setOfficialFirstTeamPoints] = useState("");
  const [officialSecondTeamPoints, setOfficialSecondTeamPoints] = useState("");

  const userId =
    (user as any)?.id ??
    (user as any)?.sub ??
    (user as any)?.userId ??
    null;

  const isOwner =
    !!userId && !!poolDetails?.ownerId && poolDetails.ownerId === userId;

  const games = useMemo(() => {
    return calendar.flatMap((day, dayIndex) =>
      day.games.map((game, gameIndex) => ({
        ...game,
        id: `${dayIndex}-${gameIndex}`,
        date: day.date,
        day: day.day,
      }))
    );
  }, []);

  async function fetchPoolDetails(poolId: string) {
    try {
      setMessage("");

      const response = await api.get(`/pools/${poolId}`);
      setPoolDetails(response.data.pool);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        "Não foi possível carregar os detalhes do bolão";

      setMessage(msg);
      setPoolDetails(null);
    }
  }

  async function fetchGuesses(poolId: string) {
    try {
      const response = await api.get(`/pools/${poolId}/guesses`);

      const formattedGuesses = (response.data.guesses as GuessResponseItem[]).reduce(
        (acc: GuessState, guess) => {
          acc[guess.gameId] = {
            firstTeamPoints: String(guess.firstTeamPoints),
            secondTeamPoints: String(guess.secondTeamPoints),
          };
          return acc;
        },
        {}
      );

      setGuesses(formattedGuesses);
    } catch (error: any) {
      console.error("Erro ao carregar palpites:", error);
    }
  }

  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        setIsLoading(true);
        await Promise.all([fetchPoolDetails(id), fetchGuesses(id)]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  function handleChangeGuess(
    gameId: string,
    field: "firstTeamPoints" | "secondTeamPoints",
    value: string
  ) {
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
      setMessage("Preencha os dois placares.");
      return;
    }

    try {
      setIsSubmitting(gameId);
      setMessage("");

      await api.post(`/pools/${id}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(current.firstTeamPoints),
        secondTeamPoints: Number(current.secondTeamPoints),
      });

      setMessage("Palpite salvo com sucesso.");
      await fetchGuesses(id);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Não foi possível salvar o palpite.";

      setMessage(msg);
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
      setMessage("Preencha os dois placares para definir o resultado.");
      return;
    }

    try {
      setIsSubmitting(`result-${selectedGameId}`);
      setMessage("");

      await api.post(`/pools/${id}/results`, {
        gameId: selectedGameId,
        firstTeamPoints: Number(officialFirstTeamPoints),
        secondTeamPoints: Number(officialSecondTeamPoints),
      });

      setMessage("Placar oficial definido com sucesso.");
      closeResultModal();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Não foi possível definir o placar oficial.";

      setMessage(msg);
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
      setMessage("");

      await api.delete(`/pools/${poolDetails.id}`);

      navigate("/pools", { replace: true });
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Não foi possível apagar o bolão";

      setMessage(msg);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleShareCode() {
    if (!poolDetails?.code) {
      setMessage("Código do bolão não disponível.");
      return;
    }

    try {
      await navigator.clipboard.writeText(poolDetails.code);
      setMessage("Código copiado para a área de transferência.");
    } catch {
      setMessage(`Código do bolão: ${poolDetails.code}`);
    }
  }

  if (isLoading) {
    return (
      <main style={{ color: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p>Carregando detalhes do bolão...</p>
        </div>
      </main>
    );
  }

  if (!poolDetails) {
    return (
      <main style={{ color: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
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
          <button onClick={() => navigate("/pools")} style={secondaryButton}>
            Voltar para bolões
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ color: "#fff" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "32px", marginBottom: "6px" }}>
              {poolDetails.title}
            </h1>
            <p style={{ color: "#b7c2bc" }}>Código: {poolDetails.code}</p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/pools")} style={secondaryButton}>
              Voltar
            </button>

            <button onClick={handleShareCode} style={secondaryButton}>
              Copiar código
            </button>
          </div>
        </div>

        {message && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              backgroundColor: "#182c22",
              color: "#fff",
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            backgroundColor: "#0d241b",
            border: "1px solid #294136",
            borderRadius: "16px",
            padding: "18px",
            marginBottom: "20px",
          }}
        >
          <p style={{ marginBottom: "8px" }}>
            <strong>Participantes:</strong> {poolDetails._count.participants}
          </p>

          <p style={{ marginBottom: "8px" }}>
            <strong>Dono:</strong> {poolDetails.owner?.name || "Não informado"}
          </p>

          {isOwner && (
            <button
              onClick={handleDeletePool}
              disabled={isDeleting}
              style={{
                ...dangerButton,
                marginTop: "12px",
                opacity: isDeleting ? 0.7 : 1,
              }}
            >
              {isDeleting ? "Apagando..." : "Apagar bolão"}
            </button>
          )}
        </div>

        {poolDetails._count.participants > 0 ? (
          <>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setOptionSelected("Seus palpites")}
                style={{
                  ...tabButton,
                  backgroundColor:
                    optionSelected === "Seus palpites" ? "#F7DD43" : "#15281f",
                  color:
                    optionSelected === "Seus palpites" ? "#132018" : "#fff",
                }}
              >
                Seus palpites
              </button>

              <button
                onClick={() => setOptionSelected("Ranking do grupo")}
                style={{
                  ...tabButton,
                  backgroundColor:
                    optionSelected === "Ranking do grupo"
                      ? "#F7DD43"
                      : "#15281f",
                  color:
                    optionSelected === "Ranking do grupo" ? "#132018" : "#fff",
                }}
              >
                Ranking do grupo
              </button>
            </div>

            {optionSelected === "Seus palpites" ? (
              <div style={{ display: "grid", gap: "18px" }}>
                {games.map((game) => {
                  const current = guesses[game.id] ?? {
                    firstTeamPoints: "",
                    secondTeamPoints: "",
                  };

                  return (
                    <GuessGameCard
                      key={game.id}
                      day={game.day}
                      date={game.date}
                      hour={game.hour}
                      player1={game.player1}
                      player2={game.player2}
                      firstTeamPoints={current.firstTeamPoints}
                      secondTeamPoints={current.secondTeamPoints}
                      onChangeFirst={(value) =>
                        handleChangeGuess(game.id, "firstTeamPoints", value)
                      }
                      onChangeSecond={(value) =>
                        handleChangeGuess(game.id, "secondTeamPoints", value)
                      }
                      onSaveGuess={() => handleSaveGuess(game.id)}
                      onSetResult={() => openResultModal(game.id)}
                      isSaving={
                        isSubmitting === game.id ||
                        isSubmitting === `result-${game.id}`
                      }
                      isOwner={isOwner}
                    />
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#0d241b",
                  border: "1px solid #294136",
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <h2 style={{ marginBottom: "12px" }}>Ranking do grupo</h2>
                <p style={{ color: "#b7c2bc" }}>
                  Aqui entra a versão web do ranking depois.
                </p>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              backgroundColor: "#0d241b",
              border: "1px solid #294136",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: "12px" }}>
              Esse bolão ainda não tem participantes.
            </p>
            <p style={{ color: "#b7c2bc" }}>
              Compartilhe o código <strong>{poolDetails.code}</strong> para
              convidar outras pessoas.
            </p>
          </div>
        )}
      </div>

      {selectedGameId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "16px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              backgroundColor: "#0d241b",
              border: "1px solid #294136",
              borderRadius: "18px",
              padding: "24px",
              color: "#fff",
            }}
          >
            <h2 style={{ marginBottom: "10px", fontSize: "24px" }}>
              Definir placar oficial
            </h2>

            <p style={{ marginBottom: "18px", color: "#b7c2bc" }}>
              Informe o resultado oficial do jogo.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "14px",
                marginBottom: "22px",
              }}
            >
              <input
                value={officialFirstTeamPoints}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) setOfficialFirstTeamPoints(value);
                }}
                inputMode="numeric"
                placeholder="0"
                style={modalInput}
              />

              <input
                value={officialSecondTeamPoints}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) setOfficialSecondTeamPoints(value);
                }}
                inputMode="numeric"
                placeholder="0"
                style={modalInput}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button onClick={closeResultModal} style={secondaryButton}>
                Cancelar
              </button>

              <button
                onClick={handleSetOfficialResult}
                disabled={isSubmitting === `result-${selectedGameId}`}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#F7DD43",
                  color: "#132018",
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity:
                    isSubmitting === `result-${selectedGameId}` ? 0.7 : 1,
                }}
              >
                {isSubmitting === `result-${selectedGameId}`
                  ? "Salvando..."
                  : "Salvar resultado"}
              </button>
            </div>
          </div>
        </div>
      )}
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

const dangerButton: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#b91c1c",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const tabButton: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

const modalInput: React.CSSProperties = {
  width: "90px",
  height: "64px",
  borderRadius: "14px",
  border: "1px solid #355444",
  backgroundColor: "#15281f",
  color: "#fff",
  textAlign: "center",
  fontSize: "28px",
  fontWeight: 700,
  outline: "none",
};