import { TeamFlag } from "./TeamFlag";

type SavedGuess = { firstTeamPoints: number; secondTeamPoints: number } | null;

type GameCardProps = {
  day: string;
  date: string;
  hour: string;
  player1?: string;
  player2?: string;
  firstTeamPoints: string;
  secondTeamPoints: string;
  savedGuess?: SavedGuess;
  onChangeFirst: (value: string) => void;
  onChangeSecond: (value: string) => void;
  onSaveGuess: () => void;
  onSetResult?: () => void;
  isSaving?: boolean;
  isOwner?: boolean;
  hasResult?: boolean;
};

function ScoreStepper({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const num = value === "" ? 0 : Number(value);

  function decrement() {
    if (disabled) return;
    onChange(String(Math.max(0, num - 1)));
  }

  function increment() {
    if (disabled) return;
    onChange(String(num + 1));
  }

  return (
    <div className="stepper">
      <button
        type="button"
        className="stepper-btn"
        onClick={decrement}
        disabled={disabled || num === 0}
        aria-label="Diminuir"
      >
        −
      </button>
      <span className="stepper-value">{num}</span>
      <button
        type="button"
        className="stepper-btn"
        onClick={increment}
        disabled={disabled}
        aria-label="Aumentar"
      >
        +
      </button>
    </div>
  );
}

export function GuessGameCard({
  day,
  date,
  hour,
  player1,
  player2,
  firstTeamPoints,
  secondTeamPoints,
  savedGuess,
  onChangeFirst,
  onChangeSecond,
  onSaveGuess,
  onSetResult,
  isSaving = false,
  isOwner = false,
  hasResult = false,
}: GameCardProps) {
  const isMobile = window.innerWidth <= 640;

  const hasSavedGuess = savedGuess !== null && savedGuess !== undefined;

  return (
    <>
      <style>{`
        .guess-card {
          background: #0e0e18;
          border: 1px solid rgba(247,221,67,0.12);
          border-radius: 18px;
          padding: 22px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .guess-card:hover {
          border-color: rgba(247,221,67,0.22);
          box-shadow: 0 0 16px rgba(247,221,67,0.04);
        }

        /* Stepper */
        .stepper {
          display: flex;
          align-items: center;
          gap: 0;
          background: #0a0a14;
          border: 1px solid rgba(247,221,67,0.2);
          border-radius: 14px;
          overflow: hidden;
          height: 64px;
          width: 120px;
        }
        .stepper-btn {
          width: 36px;
          height: 100%;
          border: none;
          background: transparent;
          color: #F7DD43;
          font-size: 22px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0;
          flex-shrink: 0;
          transition: background 0.15s;
          padding: 0;
          line-height: 1;
        }
        .stepper-btn:hover:not(:disabled) {
          background: rgba(247,221,67,0.1);
        }
        .stepper-btn:disabled {
          color: #2a2a3a;
          cursor: not-allowed;
        }
        .stepper-value {
          flex: 1;
          text-align: center;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          user-select: none;
          min-width: 0;
        }

        /* Saved badge */
        .saved-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 14px;
          padding: 8px 16px;
          background: rgba(247,221,67,0.06);
          border: 1px solid rgba(247,221,67,0.18);
          border-radius: 10px;
          font-size: 13px;
          color: #9ca3af;
        }
        .saved-score {
          color: #F7DD43;
          font-weight: 800;
          font-size: 15px;
          font-family: monospace;
          letter-spacing: 0.05em;
        }
      `}</style>

      <div className="guess-card">
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 18 }}>
          <strong style={{ fontSize: 17, color: "#fff" }}>{day} • {date}</strong>
          <span style={{ color: "#F7DD43", fontWeight: 700, fontSize: 21, textShadow: "0 0 10px rgba(247,221,67,0.35)" }}>
            {hour}
          </span>
          {hasResult && (
            <span style={{
              background: "rgba(247,221,67,0.1)",
              border: "1px solid rgba(247,221,67,0.25)",
              borderRadius: 6,
              padding: "2px 10px",
              fontSize: 11,
              fontWeight: 700,
              color: "#F7DD43",
              letterSpacing: "0.06em",
              marginTop: 2,
            }}>
              RESULTADO OFICIAL
            </span>
          )}
        </div>

        {/* Placar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr auto auto 1fr",
          gap: isMobile ? 12 : 14,
          alignItems: "center",
        }}>
          <TeamFlag team={player1} align="left" />

          {hasResult ? (
            /* Resultado oficial: só mostra os números */
            <>
              <div style={officialScore}>{firstTeamPoints}</div>
              <div style={officialScore}>{secondTeamPoints}</div>
            </>
          ) : (
            /* Steppers editáveis */
            <>
              <div style={{ justifySelf: isMobile ? "center" : "auto" }}>
                <ScoreStepper value={firstTeamPoints} onChange={onChangeFirst} />
              </div>
              <div style={{ justifySelf: isMobile ? "center" : "auto" }}>
                <ScoreStepper value={secondTeamPoints} onChange={onChangeSecond} />
              </div>
            </>
          )}

          <TeamFlag team={player2} align="right" />
        </div>

        {/* Histórico do palpite salvo */}
        {!hasResult && hasSavedGuess && (
          <div className="saved-badge">
            <span>✓ Palpite salvo:</span>
            <span className="saved-score">
              {savedGuess!.firstTeamPoints} × {savedGuess!.secondTeamPoints}
            </span>
          </div>
        )}

        {/* Botões de ação */}
        {!hasResult && (
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            {isOwner && onSetResult && (
              <button
                onClick={onSetResult}
                type="button"
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(247,221,67,0.2)",
                  background: "transparent",
                  color: "#F7DD43",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Definir placar oficial
              </button>
            )}

            <button
              onClick={onSaveGuess}
              disabled={isSaving}
              type="button"
              style={{
                padding: "10px 20px",
                borderRadius: 12,
                border: "none",
                background: "#F7DD43",
                color: "#06060b",
                fontWeight: 800,
                cursor: isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.65 : 1,
                fontSize: 13,
                boxShadow: "0 0 12px rgba(247,221,67,0.2)",
              }}
            >
              {isSaving ? "Salvando..." : hasSavedGuess ? "Atualizar palpite" : "Salvar palpite"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const officialScore: React.CSSProperties = {
  width: 72,
  height: 64,
  borderRadius: 14,
  background: "rgba(247,221,67,0.08)",
  border: "1px solid rgba(247,221,67,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
  fontWeight: 800,
  color: "#F7DD43",
};
