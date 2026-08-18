function clone(value) {
return JSON.parse(JSON.stringify(value));
}

export function createHistory(initialValue = []) {
let currentValue = clone(initialValue);
const undoStack = [];
const redoStack = [];

return {
current() {
return clone(currentValue);
},

    commit(nextValue) {
      undoStack.push(clone(currentValue));
      currentValue = clone(nextValue);
      redoStack.length = 0;
    },
    
    undo() {
      if (undoStack.length === 0) {
        return clone(currentValue);
      }
    
      redoStack.push(clone(currentValue));
      currentValue = undoStack.pop();
      return clone(currentValue);
    },
    
    redo() {
      if (redoStack.length === 0) {
        return clone(currentValue);
      }
    
      undoStack.push(clone(currentValue));
      currentValue = redoStack.pop();
      return clone(currentValue);
    },
    
    canUndo() {
      return undoStack.length > 0;
    },
    
    canRedo() {
      return redoStack.length > 0;
    }
    };
}
