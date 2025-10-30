interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function ThemeToggle({ isDark, toggleTheme }: ThemeToggleProps) {
  return (
    <button
      onClick={toggleTheme}
      aria-label="테마 토글"
      className={`w-14 h-8 rounded-full flex items-center relative transition-colors duration-500 ${
        isDark ? "bg-[#3182f6]" : "bg-[#e5e8eb]"
      }`}
    >
      <span
        className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-lg transition-all duration-500`}
        style={{
          left: isDark ? 28 : 4,
          color: isDark ? "#3182f6" : "#222",
        }}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
