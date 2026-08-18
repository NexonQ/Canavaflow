export function downloadCanvasPNG(canvas, name = "canvasflow") {
const filename = cleanName(name);
const dataUrl = canvas.toDataURL("image/png");

const anchor = document.createElement("a");
anchor.href = dataUrl;
anchor.download = `${filename}.png`;

document.body.appendChild(anchor);
anchor.click();
anchor.remove();
}

function cleanName(value) {
return value
.trim()
.replace(/[<>:"/\\|?*]+/g, "")
.replace(/\s+/g, "-")
.slice(0, 80) || "canvasflow";
}
