import { NavLink, Outlet } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";

const tabs = [
  { to: "/profile", label: "Perfil", icon: "👤" },
  { to: "/new", label: "Criar", icon: "➕" },
  { to: "/pools", label: "Bolões", icon: "⚽" },
  { to: "/calendar", label: "Calendário", icon: "📅" },
  { to: "/find", label: "Encontrar", icon: "🔎" },
];

export default function AppLayout() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const pageBackground = isDark
    ? "linear-gradient(180deg, #0b2219 0%, #0f3125 45%, #0b2219 100%)"
    : "linear-gradient(180deg, #eef3f8 0%, #e4ebf3 45%, #dde6f0 100%)";

  const shellBackground = isDark ? "#103528" : "#ffffff";

  const navBackground = isDark
    ? "linear-gradient(180deg, #11241c 0%, #0f1d17 100%)"
    : "linear-gradient(180deg, #ffffff 0%, #f4f7fb 100%)";

  const contentBackground = isDark
    ? "radial-gradient(circle at top, #14533c 0%, #103d2e 35%, #0d2f24 100%)"
    : "radial-gradient(circle at top, #14533c 0%, #103d2e 35%, #14533c 100%)";

  const borderColor = isDark
    ? "1px solid rgba(247, 221, 67, 0.10)"
    : "1px solid rgba(15, 23, 42, 0.08)";

  const navBorder = isDark
    ? "1px solid rgba(247, 221, 67, 0.14)"
    : "1px solid rgba(15, 23, 42, 0.08)";

  const activeColor = isDark ? "#F7DD43" : "#0f172a";
  const inactiveColor = isDark ? "#c7d2cc" : "#475569";
  const textColor = isDark ? "#ffffff" : "#0f172a";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: pageBackground,
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1500px",
          minHeight: "calc(100vh - 48px)",
          margin: "0 auto",
          backgroundColor: shellBackground,
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: isDark
            ? "0 18px 40px rgba(0,0,0,0.35)"
            : "0 18px 40px rgba(15,23,42,0.12)",
          display: "flex",
          flexDirection: "column",
          border: borderColor,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "20px",
            zIndex: 20,
          }}
        >
          <ThemeToggle />
        </div>

        <nav
          style={{
            height: "82px",
            background: navBackground,
            borderBottom: navBorder,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            flexShrink: 0,
            paddingRight: "140px",
            paddingLeft: "12px",
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
                color: isActive ? activeColor : inactiveColor,
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
            background: contentBackground,
            color: textColor,
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}