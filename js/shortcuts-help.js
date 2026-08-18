export function initializeShortcutHints() {
const buttons = document.querySelectorAll("[data-tool]");

buttons.forEach(button => {
const shortcut = button.querySelector("kbd")?.textContent;

    if (shortcut) {
      button.title = `${button.textContent.trim()} (${shortcut})`;
    }
    });
}
