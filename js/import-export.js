import { downloadJSON } from "./storage.js";

export function exportCanvasJSON(objects, documentName) {
const safeName = sanitizeFilename(documentName || "canvasflow");
downloadJSON(objects, `${safeName}.json`);
}

export function importCanvasJSON(input, onSuccess, onFailure) {
input.onchange = async event => {
const file = event.target.files?.[0];

    if (!file) return;
    
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
    
      if (!Array.isArray(parsed)) {
        throw new Error("The imported file is not a valid CanvasFlow document.");
      }
    
      onSuccess(parsed);
    } catch {
      onFailure(new Error("Could not read that JSON document."));
    } finally {
      input.value = "";
    }
    };
}

export function exportCanvasPNG(canvas, documentName) {
const safeName = sanitizeFilename(documentName || "canvasflow");
const image = canvas.toDataURL("image/png");

const link = document.createElement("a");
link.href = image;
link.download = `${safeName}.png`;
document.body.appendChild(link);
link.click();
link.remove();
}

function sanitizeFilename(value) {
return value
.trim()
.replace(/[<>:"/\\|?*]+/g, "")
.replace(/\s+/g, "-")
.slice(0, 80) || "canvasflow";
}
