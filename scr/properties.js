function selectedObject(editor) {
return editor.selectedObject;
}

export function updateProperties(editor) {
const object = selectedObject(editor);

const emptyState = document.querySelector("#emptyProperties");
const form = document.querySelector("#propertiesForm");

if (!emptyState || !form) return;

const panel = document.querySelector("#propertiesPanel");
emptyState.hidden = Boolean(object);
form.hidden = !object;

if (panel && window.innerWidth <= 860) {
  panel.classList.toggle("open", Boolean(object));
}

if (!object) return;

const fill = document.querySelector("#fillInput");
const stroke = document.querySelector("#strokeInput");
const strokeWidth = document.querySelector("#strokeWidthInput");
const strokeWidthOutput = document.querySelector("#strokeWidthOutput");
const opacity = document.querySelector("#opacityInput");
const opacityOutput = document.querySelector("#opacityOutput");
const text = document.querySelector("#textInput");

if (fill && object.fill) fill.value = object.fill;
if (stroke && object.stroke) stroke.value = object.stroke;

if (strokeWidth) {
strokeWidth.value = object.strokeWidth ?? 2;
}

if (strokeWidthOutput) {
strokeWidthOutput.textContent = object.strokeWidth ?? 2;
}

if (opacity) {
opacity.value = object.opacity ?? 1;
}

if (opacityOutput) {
opacityOutput.textContent = object.opacity ?? 1;
}

if (text) {
text.value = object.text || "";
text.closest(".field").hidden = object.type !== "text";
}
}

export function bindProperties(editor, onChange, notify) {
const controls = [
["#fillInput", "fill"],
["#strokeInput", "stroke"],
["#strokeWidthInput", "strokeWidth"],
["#opacityInput", "opacity"]
];

controls.forEach(([selector, property]) => {
const input = document.querySelector(selector);

    input?.addEventListener("input", () => {
      const object = selectedObject(editor);
      if (!object) return;
    
      object[property] =
        property === "strokeWidth" || property === "opacity"
          ? Number(input.value)
          : input.value;
    
      const outputId =
        property === "strokeWidth"
          ? "#strokeWidthOutput"
          : property === "opacity"
            ? "#opacityOutput"
            : null;
    
      if (outputId) {
        document.querySelector(outputId).textContent = input.value;
      }
    
      editor.draw();
      onChange(editor.objects);
    });
    });

document.querySelector("#textInput")?.addEventListener("input", event => {
const object = selectedObject(editor);
if (!object || object.type !== "text") return;

    object.text = event.target.value;
    editor.draw();
    onChange(editor.objects);
    });

document.querySelector("#deleteButton")?.addEventListener("click", () => {
const object = selectedObject(editor);
if (!object) return;

    editor.removeObject(object);
    onChange(editor.objects);
    updateProperties(editor);
    notify("Object deleted");
    });
}
