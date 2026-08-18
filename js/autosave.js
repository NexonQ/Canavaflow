export function initializeAutosave({
getData,
save,
delay = 700
}) {
let timer = null;

return function scheduleSave() {
window.clearTimeout(timer);

    timer = window.setTimeout(() => {
      save(getData());
    }, delay);
    };
}
