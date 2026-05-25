import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        .theme-toggle-btn {
          position: relative;
          display: flex;
          align-items: center;
          width: 64px;
          height: 32px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          padding: 0 6px;
          transition: background 0.35s ease, box-shadow 0.35s ease;
          outline: none;
        }

        .theme-toggle-btn:focus-visible {
          box-shadow: 0 0 0 3px rgba(247, 221, 67, 0.5);
        }

        .theme-toggle-btn.dark {
          background: #12121e;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(247,221,67,0.2);
        }

        .theme-toggle-btn.light {
          background: #12121e;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(247,221,67,0.2);
        }

        .toggle-icons {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 7px;
          pointer-events: none;
        }

        .toggle-icon {
          font-size: 13px;
          line-height: 1;
          transition: opacity 0.25s ease;
        }

        .toggle-thumb {
          position: absolute;
          top: 4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.35s ease,
                      box-shadow 0.35s ease;
          pointer-events: none;
        }

        .theme-toggle-btn.dark .toggle-thumb {
          transform: translateX(33px);
          background: #F7DD43;
          box-shadow: 0 1px 6px rgba(247,221,67,0.5), 0 2px 4px rgba(0,0,0,0.3);
        }

        .theme-toggle-btn.light .toggle-thumb {
          transform: translateX(3px);
          background: #ffffff;
          box-shadow: 0 1px 6px rgba(15,23,42,0.2), 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>

      <button
        onClick={toggleTheme}
        className={`theme-toggle-btn ${isDark ? "dark" : "light"}`}
        aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
        title={isDark ? "Tema claro" : "Tema escuro"}
      >
        <div className="toggle-icons">
          <span className="toggle-icon" style={{ opacity: isDark ? 0.4 : 1 }}>☀️</span>
          <span className="toggle-icon" style={{ opacity: isDark ? 1 : 0.4 }}>🌙</span>
        </div>
        <div className="toggle-thumb" />
      </button>
    </>
  );
}
