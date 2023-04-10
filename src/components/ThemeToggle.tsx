import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="group relative mx-auto my-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-3xl bg-gray-100 text-gray-900 transition-all hover:rounded-xl hover:bg-gray-800 hover:text-gray-400 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-100 dark:hover:text-gray-900">
      {theme === "dark" ? (
        <FaSun size="28" onClick={() => setTheme("light")} />
      ) : (
        <FaMoon size="28" onClick={() => setTheme("dark")} />
      )}
    </div>
  );
}
