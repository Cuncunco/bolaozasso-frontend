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
    <>
      {/* Estilos responsivos injetados via <style> */}
      <style>{`
        .app-page-wrapper {
          min-height: 100vh;
          background: ${pageBackground};
          padding: 24px;
        }

        .app-shell {
          width: 100%;
          max-width: 1500px;
          min-height: calc(100vh - 48px);
          margin: 0 auto;
          background-color: ${shellBackground};
          border-radius: 24px;
          overflow: hidden;
          box-shadow: ${
            isDark
              ? "0 18px 40px rgba(0,0,0,0.35)"
              : "0 18px 40px rgba(15,23,42,0.12)"
          };
          display: flex;
          flex-direction: column;
          border: ${borderColor};
          position: relative;
        }

        .theme-toggle-wrapper {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 20;
        }

        .app-nav {
          height: 82px;
          background: ${navBackground};
          border-bottom: ${navBorder};
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-shrink: 0;
          padding: 0 64px 0 12px;
        }

        .nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          min-width: 64px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          transition: color 0.2s ease, transform 0.15s ease;
        }

        .nav-link:hover {
          transform: translateY(-2px);
        }

        .nav-icon {
          font-size: 22px;
          line-height: 1;
        }

        .app-content {
          flex: 1;
          padding: 24px;
          background: ${contentBackground};
          color: ${textColor};
        }

        /* ── Tablet ── */
        @media (max-width: 768px) {
          .app-page-wrapper {
            padding: 12px;
          }

          .app-shell {
            border-radius: 16px;
            min-height: calc(100vh - 24px);
          }

          .app-nav {
            height: 70px;
            padding: 0 52px 0 8px;
            gap: 6px;
          }

          .nav-link {
            font-size: 11px;
            min-width: 52px;
            gap: 3px;
          }

          .nav-icon {
            font-size: 20px;
          }

          .app-content {
            padding: 16px;
          }
        }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .app-page-wrapper {
            padding: 0;
          }

          .app-shell {
            border-radius: 0;
            min-height: 100vh;
            box-shadow: none;
          }

          .theme-toggle-wrapper {
            top: 12px;
            right: 10px;
          }

          .app-nav {
            height: 64px;
            padding: 0 42px 0 6px;
            justify-content: space-between;
            gap: 2px;
          }

          .nav-link {
            font-size: 10px;
            min-width: 0;
            gap: 2px;
            flex: 1;
          }

          .nav-icon {
            font-size: 18px;
          }

          .app-content {
            padding: 12px;
          }
        }

        @media (max-width: 380px) {
          .app-nav {
            height: 60px;
            padding: 0 38px 0 4px;
          }

          .nav-link {
            font-size: 0;
          }

          .nav-icon {
            font-size: 17px;
          }
        }
      `}</style>

      <div className="app-page-wrapper">
        <div className="app-shell">
          {/* Botão de tema */}
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>

          {/* Nav */}
          <nav className="app-nav">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className="nav-link"
                style={({ isActive }) => ({
                  color: isActive ? activeColor : inactiveColor,
                })}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Conteúdo */}
          <div className="app-content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}