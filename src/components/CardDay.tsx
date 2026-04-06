import type { Card } from "../constants/Calendar";
import { TeamFlag } from "./TeamFlag";

type Props = {
  card: Card;
};

export function CardDay({ card }: Props) {
  const isMobile = window.innerWidth <= 640;
  const isSmallMobile = window.innerWidth <= 420;

  return (
    <section
      style={{
        backgroundColor: "#111827",
        border: "1px solid #374151",
        borderRadius: "20px",
        padding: isSmallMobile ? "14px" : isMobile ? "16px" : "22px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: isMobile ? "12px" : "18px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(22px, 8vw, 42px)",
            color: "#fff",
            margin: 0,
          }}
        >
          {card.day}
        </h2>

        <span
          style={{
            color: "#F7DD43",
            fontWeight: 700,
            fontSize: "clamp(22px, 8vw, 42px)",
          }}
        >
          {card.date}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {card.games.map((game, index) => (
          <div
            key={`${card.date}-${index}-${game.hour}`}
            style={{
              backgroundColor: "#1f2937",
              borderRadius: "14px",
              padding: isMobile ? "12px 12px" : "16px 18px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 120px 1fr",
              alignItems: "center",
              gap: isMobile ? "10px" : "14px",
              minHeight: isMobile ? "auto" : "200px",
            }}
          >
            <TeamFlag team={game.player1} align="left" />

            <div
            style={{
                color: "#F7DD43",
                fontWeight: 700,
                fontSize: "clamp(24px, 9vw, 52px)",
                whiteSpace: "nowrap",
                textAlign: "center",
            }}
            >
            {game.hour}
            </div>

            <TeamFlag team={game.player2} align="right" />
          </div>
        ))}
      </div>
    </section>
  );
}