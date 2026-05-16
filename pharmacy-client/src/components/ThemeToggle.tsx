import { useDarkMode } from "../hooks/useDarkMode";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [colorTheme, setTheme] = useDarkMode();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(colorTheme)}
      className="rounded-full w-10 h-10 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
    >
      {colorTheme === "light" ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
      )}
    </Button>
  );
}
