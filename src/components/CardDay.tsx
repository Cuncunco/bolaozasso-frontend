import type { Card } from "../constants/Calendar";
import { TeamFlag } from "./TeamFlag";

type Props = { card: Card };

export function CardDay({ card }: Props) {
  const isMobile = window.innerWidth <= 640;

  return (
    <section style={{
      background: "#0e0e18",
      border: "1px solid rgba(247,221,67,0.12)",
      borderRadius: 20,
      padding: isMobile ? "16px" : "22px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: isMobile ? 12 : 18,
        gap: 12,
        flexWrap: "wrap",
      }}>
        <h2 style={{ fontSize: "clamp(22px, 7vw, 40px)", color: "#fff", margin: 0, fontWeight: 800 }}>
          {card.day}
        </h2>
        <span style={{
          color: "#F7DD43",
          fontWeight: 800,
          fontSize: "clamp(20px, 6vw, 36px)",
          textShadow: "0 0 16px rgba(247,221,67,0.3)",
        }}>
          {card.date}
        </span>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {card.games.map((game, index) => (
          <div
            key={`${card.date}-${index}-${game.hour}`}
            style={{
              background: "rgba(247,221,67,0.025)",
              border: "1px solid rgba(247,221,67,0.08)",
              borderRadius: 14,
              padding: isMobile ? "12px" : "16px 18px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 120px 1fr",
              alignItems: "center",
              gap: isMobile ? 10 : 14,
              minHeight: isMobile ? "auto" : 180,
              transition: "border-color 0.2s",
            }}
          >
            <TeamFlag team={game.player1} align="left" />

            <div style={{
              color: "#F7DD43",
              fontWeight: 800,
              fontSize: "clamp(22px, 8vw, 48px)",
              whiteSpace: "nowrap",
              textAlign: "center",
              textShadow: "0 0 20px rgba(247,221,67,0.4)",
            }}>
              {game.hour}
            </div>

            <TeamFlag team={game.player2} align="right" />
          </div>
        ))}
      </div>
    </section>
  );
}
