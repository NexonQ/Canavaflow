import { CanvasEditor } from "./canvas.js";
import { createHistory } from "./history.js";
import {
loadDocument,
saveDocument
} from "./storage.js";
import { notify } from "./notifications.js";
import { updateProperties, bindProperties } from "./properties.js";
import {
exportCanvasJSON,
importCanvasJSON,
exportCanvasPNG
} from "./import-export.js";
import { initializeTheme, toggleTheme } from "./theme.js";
import {
initializeUI,
initializeDocumentName,
getDocumentName,
initializeToolButtons,
updateToolButtons,
updateUndoRedoButtons
} from "./ui.js";
import { initializeKeyboard } from "./keyboard.js";
import { initializeFitButton } from "./fit-canvas.js";
import { initializeZoom } from "./zoom.js";
import { initializeAutosave } from "./autosave.js";
import { initializeShortcutHints } from "./shortcuts-help.js";

const canvas = document.querySelector("#editorCanvas");
const viewport = document.querySelector("#canvasViewport");

const welcomeScreen = document.querySelector("#welcomeScreen");
const startOpenButton = document.querySelector("#startOpenButton");
const continueButton = document.querySelector("#continueButton");
const welcomeFileInput = document.querySelector("#welcomeFileInput");
const openEditor = () => welcomeScreen?.classList.add("hidden");

const initialObjects = loadDocument();
const history = createHistory(initialObjects);

function startTemplate(kind) {
if (kind === "poster") return [{ type: "text", x: 180, y: 170, width: 720, height: 70, text: "Your poster title", fill: "#172033", stroke: "#172033", strokeWidth: 0, opacity: 1 }];
if (kind === "social") return [{ type: "rectangle", x: 140, y: 140, width: 920, height: 480, fill: "#efedff", stroke: "#5b4de8", strokeWidth: 2, opacity: 1 }];
return [];
}

document.querySelectorAll("[data-start]").forEach(button => {
button.addEventListener("click", () => {
const kind = button.dataset.start;
const template = startTemplate(kind);
editor?.setObjects(template);
if (template.length) history.commit(template);
openEditor();
updateProperties(editor);
});
});

continueButton?.addEventListener("click", () => {
if (initialObjects.length) openEditor();
else notify("No saved work yet");
});

startOpenButton?.addEventListener("click", () => welcomeFileInput?.click());
welcomeFileInput?.addEventListener("change", async event => {
const file = event.target.files?.[0];
if (!file) return;
try {
const data = JSON.parse(await file.text());
const objects = Array.isArray(data) ? data : data.objects;
if (!Array.isArray(objects)) throw new Error("Invalid project file");
history.commit(objects);
openEditor();
editor?.setObjects(objects);
updateProperties(editor);
notify("Project imported");
} catch (error) { notify(error instanceof Error ? error.message : String(error)); }
});

let editor;
let scheduleAutosave;

function applyObjects(objects) {
editor.setObjects(objects);
saveDocument(objects);
updateProperties(editor);
updateUndoRedoButtons(history);
}

function recordObjects(objects) {
history.commit(objects);
scheduleAutosave();
updateProperties(editor);
updateUndoRedoButtons(history);
}

function setTool(tool) {
editor.setTool(tool);
updateToolButtons(tool);

const hint = document.querySelector("#canvasHint");

const messages = {
select: "Click and drag an object to move it.",
rectangle: "Click and drag to create a rectangle.",
ellipse: "Click and drag to create an ellipse.",
text: "Double-click the canvas to add text.",
draw: "Draw freely with your pointer or finger.",
erase: "Click an object to remove it."
};

if (hint) {
hint.textContent = messages[tool] || messages.select;
}

if (window.innerWidth <= 640) {
document.querySelector("#toolsPanel")?.classList.remove("open");
}
}

function undo() {
if (!history.canUndo()) {
notify("Nothing to undo");
return;
}

applyObjects(history.undo());
notify("Undo");
}

function redo() {
if (!history.canRedo()) {
notify("Nothing to redo");
return;
}

applyObjects(history.redo());
notify("Redo");
}

function deleteSelected() {
if (!editor.selectedObject) {
notify("Select an object first");
return;
}

editor.removeObject(editor.selectedObject);
recordObjects(editor.objects);
notify("Object deleted");
}

function saveNow() {
saveDocument(editor.objects);
notify("Saved locally");
}

editor = new CanvasEditor(canvas, recordObjects);
editor.setObjects(initialObjects);

scheduleAutosave = initializeAutosave({
getData: () => editor.objects,
save: saveDocument
});

initializeTheme();
initializeUI();
initializeShortcutHints();
initializeToolButtons(setTool);
initializeDocumentName(() => {
notify("Document name updated");
});

bindProperties(
editor,
objects => {
history.commit(objects);
scheduleAutosave();
updateUndoRedoButtons(history);
},
notify
);

initializeKeyboard({
setTool,
undo,
redo,
deleteSelected,
save: saveNow
});

initializeFitButton(canvas, viewport);
initializeZoom(canvas, viewport);

document.querySelector("#undoButton")?.addEventListener("click", undo);
document.querySelector("#redoButton")?.addEventListener("click", redo);
document.querySelector("#saveButton")?.addEventListener("click", saveNow);
document.querySelector("#topExportButton")?.addEventListener("click", () => { exportCanvasPNG(canvas, getDocumentName()); notify("PNG exported"); });

document.querySelector("#themeButton")?.addEventListener("click", () => {
const theme = toggleTheme();
notify(`${theme === "dark" ? "Dark" : "Light"} theme enabled`);
});

document.querySelector("#clearButton")?.addEventListener("click", () => {
if (editor.objects.length === 0) {
notify("Canvas is already empty");
return;
}

const confirmed = window.confirm("Clear every object from the canvas?");

if (!confirmed) return;

history.commit([]);
applyObjects([]);
notify("Canvas cleared");
});

document.querySelector("#exportButton")?.addEventListener("click", () => {
exportCanvasJSON(editor.objects, getDocumentName());
notify("JSON exported");
});

document.querySelector("#pngButton")?.addEventListener("click", () => {
exportCanvasPNG(canvas, getDocumentName());
notify("PNG exported");
});

const fileInput = document.querySelector("#fileInput");

importCanvasJSON(
fileInput,
objects => {
history.commit(objects);
applyObjects(objects);
notify("Document imported");
},
error => {
notify(error.message);
}
);

updateToolButtons("select");
updateProperties(editor);
updateUndoRedoButtons(history);
