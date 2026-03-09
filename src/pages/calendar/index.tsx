import { calendar } from "../../constants/Calendar";
import { CardDay } from "../../components/CardDay";

export default function Calendar() {
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
          paddingTop: "24px",
          paddingBottom: "24px",
          display: "grid",
          gap: "20px",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "64px",
            textAlign: "center",
            margin: 0,
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