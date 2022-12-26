import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Switch = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const darkModeText = `${isDarkMode ? "light" : "dark"} mode`;

  useEffect(() => setHasMounted(true), []);

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const Icon = isDarkMode ? SunIcon : MoonIcon;

  if (!hasMounted) return null;
  return (
    <button
      className="self-start p-0.5 rounded-sm focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:outline-none"
      onClick={toggleTheme}
    >
      <Icon className="h-6 w-6" />
      <span className="sr-only">{darkModeText}</span>
    </button>
  );
};
