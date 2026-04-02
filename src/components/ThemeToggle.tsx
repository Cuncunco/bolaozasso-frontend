import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: "8px 14px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
        background: theme === "dark" ? "#ffffff" : "#222",
        color: theme === "dark" ? "#000" : "#fff",
      }}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}