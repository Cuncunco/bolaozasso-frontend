import { TeamFlag } from "./TeamFlag";

type GameCardProps = {
  day: string;
  date: string;
  hour: string;
  player1?: string;
  player2?: string;
  firstTeamPoints: string;
  secondTeamPoints: string;
  onChangeFirst: (value: string) => void;
  onChangeSecond: (value: string) => void;
  onSaveGuess: () => void;
  onSetResult?: () => void;
  isSaving?: boolean;
  isOwner?: boolean;
};

export function GuessGameCard({
  day,
  date,
  hour,
  player1,
  player2,
  firstTeamPoints,
  secondTeamPoints,
  onChangeFirst,
  onChangeSecond,
  onSaveGuess,
  onSetResult,
  isSaving = false,
  isOwner = false,
}: GameCardProps) {
  return (
    <div
      style={{
        backgroundColor: "#0d241b",
        border: "1px solid #294136",
        borderRadius: "18px",
        padding: "22px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          marginBottom: "18px",
        }}
      >
        <strong style={{ fontSize: "22px", color: "#fff" }}>
          {day} • {date}
        </strong>

        <span
          style={{
            color: "#F7DD43",
            fontWeight: 700,
            fontSize: "24px",
          }}
        >
          {hour}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 86px 86px 1fr",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <TeamFlag team={player1} align="left" />

        <input
          value={firstTeamPoints}
          onChange={(e) => onChangeFirst(e.target.value)}
          inputMode="numeric"
          style={{
            width: "86px",
            height: "64px",
            borderRadius: "14px",
            border: "1px solid #355444",
            backgroundColor: "#15281f",
            color: "#fff",
            textAlign: "center",
            fontSize: "28px",
            fontWeight: 700,
            outline: "none",
          }}
        />

        <input
          value={secondTeamPoints}
          onChange={(e) => onChangeSecond(e.target.value)}
          inputMode="numeric"
          style={{
            width: "86px",
            height: "64px",
            borderRadius: "14px",
            border: "1px solid #355444",
            backgroundColor: "#15281f",
            color: "#fff",
            textAlign: "center",
            fontSize: "28px",
            fontWeight: 700,
            outline: "none",
          }}
        />

        <TeamFlag team={player2} align="right" />
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {isOwner && onSetResult && (
          <button
            onClick={onSetResult}
            type="button"
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid #355444",
              backgroundColor: "#15281f",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
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
            padding: "12px 18px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#F7DD43",
            color: "#132018",
            fontWeight: 700,
            cursor: "pointer",
            opacity: isSaving ? 0.7 : 1,
          }}
        >
          {isSaving ? "Salvando..." : "Salvar palpite"}
        </button>
      </div>
    </div>
  );
}