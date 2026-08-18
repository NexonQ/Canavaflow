export function initializeUI() {
const menuButton = document.querySelector("#menuButton");
const toolsPanel = document.querySelector("#toolsPanel");
const closeToolsButton = document.querySelector("#closeToolsButton");

const propertiesPanel = document.querySelector("#propertiesPanel");
const closePropertiesButton = document.querySelector("#closePropertiesButton");

menuButton?.addEventListener("click", () => {
toolsPanel?.classList.toggle("open");
});

closeToolsButton?.addEventListener("click", () => {
toolsPanel?.classList.remove("open");
});

closePropertiesButton?.addEventListener("click", () => {
propertiesPanel?.classList.remove("open");
});

document.addEventListener("click", event => {
if (window.innerWidth > 640) return;

    const clickedInsideTools =
      toolsPanel?.contains(event.target) ||
      menuButton?.contains(event.target);
    
    if (!clickedInsideTools) {
      toolsPanel?.classList.remove("open");
    }
    });

window.addEventListener("resize", () => {
if (window.innerWidth > 640) {
toolsPanel?.classList.remove("open");
propertiesPanel?.classList.remove("open");
}
});
}

export function initializeDocumentName(onChange) {
const nameElement = document.querySelector("#documentName");

if (!nameElement) return;

nameElement.addEventListener("keydown", event => {
if (event.key === "Enter") {
event.preventDefault();
nameElement.blur();
}
});

nameElement.addEventListener("blur", () => {
const value = nameElement.textContent.trim();

    if (!value) {
      nameElement.textContent = "Untitled canvas";
    }
    
    onChange(getDocumentName());
    });
}

export function getDocumentName() {
return (
document.querySelector("#documentName")?.textContent.trim() ||
"Untitled canvas"
);
}

export function initializeToolButtons(setTool) {
document.querySelectorAll(".tool-list [data-tool]").forEach(button => {
button.addEventListener("click", () => {
setTool(button.dataset.tool);
});
});
}

export function updateToolButtons(activeTool) {
document.querySelectorAll(".tool-list [data-tool]").forEach(button => {
button.classList.toggle("active", button.dataset.tool === activeTool);
});
}

export function updateUndoRedoButtons(history) {
const undoButton = document.querySelector("#undoButton");
const redoButton = document.querySelector("#redoButton");

if (undoButton) {
undoButton.disabled = !history.canUndo();
}

if (redoButton) {
redoButton.disabled = !history.canRedo();
}
}
