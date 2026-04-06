import { calendar } from "../../constants/Calendar";
import { CardDay } from "../../components/CardDay";

export default function Calendar() {
  const isMobile = window.innerWidth <= 640;

  return (
    <main
      style={{
        minHeight: "100%",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          paddingTop: isMobile ? "12px" : "24px",
          paddingBottom: isMobile ? "12px" : "24px",
          display: "grid",
          gap: isMobile ? "14px" : "20px",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(26px, 7vw, 48px)",
            textAlign: "center",
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          CALENDÁRIO
        </h1>

        {calendar.map((card) => (
          <CardDay key={`${card.date}-${card.day}`} card={card} />
        ))}
      </div>
    </main>
  );
}