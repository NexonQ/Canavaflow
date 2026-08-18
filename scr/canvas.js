const DEFAULTS = {
fill: "#dbeafe",
stroke: "#4f46e5",
strokeWidth: 2,
opacity: 1
};

function copy(value) {
return JSON.parse(JSON.stringify(value));
}

function normalizeRect(start, end) {
return {
x: Math.min(start.x, end.x),
y: Math.min(start.y, end.y),
width: Math.abs(end.x - start.x),
height: Math.abs(end.y - start.y)
};
}

export class CanvasEditor {
constructor(canvas, onChange) {
this.canvas = canvas;
this.context = canvas.getContext("2d");
this.onChange = onChange;

    this.tool = "select";
    this.objects = [];
    this.selectedObject = null;
    this.pointerState = null;
    
    canvas.addEventListener("pointerdown", event => this.handlePointerDown(event));
    canvas.addEventListener("pointermove", event => this.handlePointerMove(event));
    canvas.addEventListener("pointerup", event => this.handlePointerUp(event));
    canvas.addEventListener("pointercancel", event => this.handlePointerUp(event));
    canvas.addEventListener("dblclick", event => this.handleDoubleClick(event));
    }

setObjects(objects) {
this.objects = copy(objects);
this.selectedObject = null;
this.draw();
}

getPointerPosition(event) {
const bounds = this.canvas.getBoundingClientRect();

    return {
      x: (event.clientX - bounds.left) * (this.canvas.width / bounds.width),
      y: (event.clientY - bounds.top) * (this.canvas.height / bounds.height)
    };
    }

getObjectAt(position) {
for (let index = this.objects.length - 1; index >= 0; index -= 1) {
const object = this.objects[index];

      if (
        position.x >= object.x &&
        position.x <= object.x + object.width &&
        position.y >= object.y &&
        position.y <= object.y + object.height
      ) {
        return object;
      }
    }
    
    return null;
    }

createObject(position, type) {
return {
id: crypto.randomUUID(),
type,
x: position.x,
y: position.y,
width: 0,
height: 0,
text: type === "text" ? "New text" : "",
...DEFAULTS
};
}

handlePointerDown(event) {
event.preventDefault();
this.canvas.setPointerCapture?.(event.pointerId);

    const position = this.getPointerPosition(event);
    
    if (this.tool === "select") {
      const object = this.getObjectAt(position);
    
      this.selectedObject = object;
    
      if (object) {
        this.pointerState = {
          mode: "move",
          start: position,
          original: copy(object)
        };
      } else {
        this.pointerState = null;
      }
    
      this.draw();
      return;
    }
    
    if (this.tool === "erase") {
      const object = this.getObjectAt(position);
    
      if (object) {
        this.removeObject(object);
        this.onChange(this.objects);
      }
    
      this.draw();
      return;
    }
    
    if (this.tool === "draw") {
      const object = {
        id: crypto.randomUUID(),
        type: "path",
        points: [position],
        fill: "transparent",
        stroke: "#4f46e5",
        strokeWidth: 3,
        opacity: 1
      };
    
      this.objects.push(object);
      this.selectedObject = object;
      this.pointerState = {
        mode: "draw",
        object
      };
    
      this.draw();
      return;
    }
    
    const object = this.createObject(position, this.tool);
    this.objects.push(object);
    this.selectedObject = object;
    
    this.pointerState = {
      mode: "create",
      start: position,
      object
    };
    
    this.draw();
    }

handlePointerMove(event) {
if (!this.pointerState) return;

    event.preventDefault();
    
    const position = this.getPointerPosition(event);
    const state = this.pointerState;
    
    if (state.mode === "move") {
      const object = state.original;
    
      this.selectedObject.x = object.x + position.x - state.start.x;
      this.selectedObject.y = object.y + position.y - state.start.y;
    }
    
    if (state.mode === "create") {
      const rectangle = normalizeRect(state.start, position);
    
      state.object.x = rectangle.x;
      state.object.y = rectangle.y;
      state.object.width = rectangle.width;
      state.object.height = rectangle.height;
    }
    
    if (state.mode === "draw") {
      state.object.points.push(position);
    }
    
    this.draw();
    }

handlePointerUp(event) {
if (!this.pointerState) return;

    this.canvas.releasePointerCapture?.(event.pointerId);
    
    const state = this.pointerState;
    
    if (
      state.mode === "create" &&
      state.object.width < 5 &&
      state.object.height < 5
    ) {
      this.objects = this.objects.filter(object => object !== state.object);
      this.selectedObject = null;
    }
    
    this.pointerState = null;
    this.onChange(this.objects);
    this.draw();
    }

handleDoubleClick(event) {
const position = this.getPointerPosition(event);
const object = this.getObjectAt(position);

    if (object?.type === "text") {
      const text = window.prompt("Edit text", object.text);
    
      if (text !== null) {
        object.text = text;
        this.selectedObject = object;
        this.onChange(this.objects);
        this.draw();
      }
    
      return;
    }
    
    if (this.tool === "text") {
      const text = window.prompt("Enter text", "New text");
    
      if (text === null || text.trim() === "") return;
    
      const object = this.createObject(position, "text");
      object.width = 220;
      object.height = 44;
      object.text = text;
    
      this.objects.push(object);
      this.selectedObject = object;
      this.onChange(this.objects);
      this.draw();
    }
    }

removeObject(object) {
this.objects = this.objects.filter(item => item !== object);

    if (this.selectedObject === object) {
      this.selectedObject = null;
    }
    
    this.draw();
    }

drawPath(object) {
const points = object.points;

    if (!points.length) return;
    
    const context = this.context;
    
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    
    points.slice(1).forEach(point => {
      context.lineTo(point.x, point.y);
    });
    
    context.strokeStyle = object.stroke;
    context.lineWidth = object.strokeWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
    }

drawObject(object) {
const context = this.context;

    context.save();
    context.globalAlpha = object.opacity ?? 1;
    context.fillStyle = object.fill || "transparent";
    context.strokeStyle = object.stroke || "#4f46e5";
    context.lineWidth = object.strokeWidth ?? 2;
    
    if (object.type === "path") {
      this.drawPath(object);
      context.restore();
      return;
    }
    
    if (object.type === "text") {
      context.font = "24px Inter, system-ui, sans-serif";
      context.textBaseline = "top";
      context.fillStyle = object.fill || "#172033";
      context.fillText(object.text || "", object.x, object.y);
      context.restore();
      return;
    }
    
    if (object.type === "ellipse") {
      context.beginPath();
      context.ellipse(
        object.x + object.width / 2,
        object.y + object.height / 2,
        Math.max(1, object.width / 2),
        Math.max(1, object.height / 2),
        0,
        0,
        Math.PI * 2
      );
      context.fill();
      context.stroke();
      context.restore();
      return;
    }
    
    context.fillRect(object.x, object.y, object.width, object.height);
    context.strokeRect(object.x, object.y, object.width, object.height);
    context.restore();
    }

drawSelection(object) {
if (!object || object.type === "path") return;

    const context = this.context;
    
    context.save();
    context.strokeStyle = "#ef4444";
    context.lineWidth = 1.5;
    context.setLineDash([6, 4]);
    context.strokeRect(
      object.x - 5,
      object.y - 5,
      object.width + 10,
      object.height + 10
    );
    context.restore();
    }

draw() {
const context = this.context;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.objects.forEach(object => this.drawObject(object));
    this.drawSelection(this.selectedObject);
    }
}
