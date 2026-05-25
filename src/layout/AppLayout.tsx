import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { to: "/profile",  label: "Perfil",      icon: "👤" },
  { to: "/new",      label: "Criar",       icon: "➕" },
  { to: "/pools",    label: "Bolões",      icon: "⚽" },
  { to: "/calendar", label: "Calendário",  icon: "📅" },
  { to: "/find",     label: "Encontrar",   icon: "🔎" },
];

export default function AppLayout() {
  return (
    <>
      <style>{`
        /* ── Shell ── */
        .app-page-wrapper {
          min-height: 100vh;
          background: #06060b;
          background-image:
            radial-gradient(circle at 50% 0%, rgba(247,221,67,0.04) 0%, transparent 55%);
          padding: 20px;
        }

        .app-shell {
          width: 100%;
          max-width: 1500px;
          min-height: calc(100vh - 40px);
          margin: 0 auto;
          background: #0a0a12;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(247,221,67,0.12);
          box-shadow:
            0 0 0 1px rgba(247,221,67,0.04),
            0 24px 64px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(247,221,67,0.08);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* ── Nav ── */
        .app-nav {
          height: 76px;
          background: #080810;
          border-bottom: 1px solid rgba(247,221,67,0.10);
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-shrink: 0;
          padding: 0 12px;
          position: relative;
        }

        .app-nav::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(247,221,67,0.25) 50%, transparent 100%);
        }

        .nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          min-width: 60px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          color: #4a5060;
          letter-spacing: 0.03em;
          transition: color 0.2s ease, transform 0.15s ease;
          position: relative;
          padding-bottom: 4px;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 24px;
          height: 2px;
          background: #F7DD43;
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(247,221,67,0.6);
          transition: transform 0.2s ease;
        }

        .nav-link.active {
          color: #F7DD43;
          text-shadow: 0 0 12px rgba(247,221,67,0.5);
        }

        .nav-link.active::after {
          transform: translateX(-50%) scaleX(1);
        }

        .nav-link:hover {
          color: rgba(247,221,67,0.7);
          transform: translateY(-2px);
        }

        .nav-icon {
          font-size: 20px;
          line-height: 1;
        }

        /* ── Content ── */
        .app-content {
          flex: 1;
          padding: 24px;
          background: linear-gradient(180deg, #0c0c16 0%, #0a0a12 100%);
          color: #fff;
          position: relative;
        }

        .app-content::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(247,221,67,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(247,221,67,0.015) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .app-page-wrapper { padding: 10px; }
          .app-shell { border-radius: 14px; min-height: calc(100vh - 20px); }
          .app-nav { height: 68px; padding: 0 8px; }
          .nav-link { font-size: 11px; min-width: 50px; }
          .app-content { padding: 16px; }
        }

        @media (max-width: 480px) {
          .app-page-wrapper { padding: 0; }
          .app-shell { border-radius: 0; min-height: 100vh; box-shadow: none; }
          .app-nav { height: 62px; padding: 0 6px; justify-content: space-between; }
          .nav-link { font-size: 10px; min-width: 0; flex: 1; }
          .nav-icon { font-size: 18px; }
          .app-content { padding: 12px; }
        }

        @media (max-width: 380px) {
          .app-nav { height: 58px; padding: 0 4px; }
          .nav-link { font-size: 0; }
          .nav-icon { font-size: 17px; }
        }
      `}</style>

      <div className="app-page-wrapper">
        <div className="app-shell">
          <nav className="app-nav">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="app-content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
