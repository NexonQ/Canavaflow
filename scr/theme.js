import { loadTheme, saveTheme } from "./storage.js";

export function initializeTheme() {
const theme = loadTheme();

if (theme === "dark") {
document.body.classList.add("dark");
}
}

export function toggleTheme() {
const isDark = document.body.classList.toggle("dark");
saveTheme(isDark ? "dark" : "light");
return isDark ? "dark" : "light";
}
