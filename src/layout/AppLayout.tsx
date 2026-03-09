import { NavLink, Outlet } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const tabs = [
  { to: "/profile", label: "Perfil", icon: "👤" },
  { to: "/new", label: "Criar", icon: "➕" },
  { to: "/pools", label: "Bolões", icon: "⚽" },
  { to: "/calendar", label: "Calendário", icon: "📅" },
  { to: "/find", label: "Encontrar", icon: "🔎" },
];

export default function AppLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #06140f 0%, #081c15 45%, #071711 100%)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1500px",
          minHeight: "calc(100vh - 48px)",
          margin: "0 auto",
          backgroundColor: "#0b2219",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(247, 221, 67, 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "16px 24px 0 24px",
            background:
              "linear-gradient(180deg, #101714 0%, #0c110f 100%)",
          }}
        >
          <ThemeToggle />
        </div>

        <nav
          style={{
            height: "76px",
            background:
              "linear-gradient(180deg, #101714 0%, #0c110f 100%)",
            borderBottom: "1px solid rgba(247, 221, 67, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            flexShrink: 0,
          }}
        >
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              style={({ isActive }) => ({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                minWidth: "72px",
                textDecoration: "none",
                color: isActive ? "#F7DD43" : "#B7C2BC",
                fontSize: "13px",
                fontWeight: 700,
                transition: "0.2s ease",
              })}
            >
              <span style={{ fontSize: "22px", lineHeight: 1 }}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </nav>

        <div
          style={{
            flex: 1,
            padding: "24px",
            background:
              "radial-gradient(circle at top, #0d2b20 0%, #0a2018 30%, #081c15 100%)",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}