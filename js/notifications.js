let timer = null;

export function notify(message) {
const toast = document.querySelector("#toast");
if (!toast) return;

toast.textContent = message;
toast.classList.add("show");

window.clearTimeout(timer);
timer = window.setTimeout(() => {
toast.classList.remove("show");
}, 1800);
}
