const DOCUMENT_KEY = "canvasflow-document-v1";
const THEME_KEY = "canvasflow-theme-v1";

export function saveDocument(objects) {
localStorage.setItem(DOCUMENT_KEY, JSON.stringify(objects));
}

export function loadDocument() {
try {
const stored = localStorage.getItem(DOCUMENT_KEY);
if (!stored) return [];
const parsed = JSON.parse(stored);
return Array.isArray(parsed) ? parsed : [];
} catch {
return [];
}
}

export function saveTheme(theme) {
localStorage.setItem(THEME_KEY, theme);
}

export function loadTheme() {
return localStorage.getItem(THEME_KEY) || "light";
}

export function downloadJSON(data, filename = "canvasflow.json") {
const blob = new Blob(
[JSON.stringify(data, null, 2)],
{ type: "application/json" }
);

const url = URL.createObjectURL(blob);
const link = document.createElement("a");

link.href = url;
link.download = filename;
document.body.appendChild(link);
link.click();
link.remove();

setTimeout(() => URL.revokeObjectURL(url), 0);
}
