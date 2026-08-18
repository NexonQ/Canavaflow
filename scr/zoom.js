import { fitCanvasToViewport } from "./fit-canvas.js";

export function initializeZoom(canvas, viewport) {
const range = document.querySelector("#zoomRange");
const output = document.querySelector("#zoomOutput");

if (!range) return;

const update = () => {
const zoom = Number(range.value) / 100;

    if (output) {
      output.textContent = `${range.value}%`;
    }
    
    fitCanvasToViewport(canvas, viewport, zoom);
    };

range.addEventListener("input", update);
update();
}
