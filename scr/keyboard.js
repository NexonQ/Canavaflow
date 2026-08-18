const SHORTCUTS = {
v: "select",
r: "rectangle",
e: "ellipse",
t: "text",
d: "draw"
};

export function initializeKeyboard({
setTool,
undo,
redo,
deleteSelected,
save
}) {
document.addEventListener("keydown", event => {
const target = event.target;
const editingText =
target.isContentEditable ||
target.tagName === "INPUT" ||
target.tagName === "TEXTAREA";

    const modifier = event.ctrlKey || event.metaKey;
    
    if (modifier && event.key.toLowerCase() === "z") {
      event.preventDefault();
      undo();
      return;
    }
    
    if (modifier && event.key.toLowerCase() === "y") {
      event.preventDefault();
      redo();
      return;
    }
    
    if (modifier && event.key.toLowerCase() === "s") {
      event.preventDefault();
      save();
      return;
    }
    
    if (editingText) return;
    
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      deleteSelected();
      return;
    }
    
    const tool = SHORTCUTS[event.key.toLowerCase()];
    
    if (tool) {
      event.preventDefault();
      setTool(tool);
    }
    });
}
