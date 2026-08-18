export function fitCanvasToViewport(canvas, viewport, zoom = 1) {
if (!canvas || !viewport) return;

const horizontalPadding = window.innerWidth <= 640 ? 20 : 64;
const availableWidth = Math.max(
240,
viewport.clientWidth - horizontalPadding
);

const naturalWidth = canvas.width;
const fittedWidth = Math.min(naturalWidth, availableWidth) * zoom;

canvas.style.width = `${fittedWidth}px`;
canvas.style.height = "auto";
}

export function initializeFitButton(canvas, viewport) {
const fitButton = document.querySelector("#fitButton");

fitButton?.addEventListener("click", () => {
fitCanvasToViewport(canvas, viewport, 1);

    const range = document.querySelector("#zoomRange");
    const output = document.querySelector("#zoomOutput");
    
    if (range) range.value = "100";
    if (output) output.textContent = "100%";
    });

window.addEventListener("resize", () => {
const range = document.querySelector("#zoomRange");
const zoom = Number(range?.value || 100) / 100;

    fitCanvasToViewport(canvas, viewport, zoom);
    });
}
