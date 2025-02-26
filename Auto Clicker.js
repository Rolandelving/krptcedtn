let autoClickerActive = false;
let clickInterval;
let clickType = "left"; // Default to left click

function autoClick() {
    let eventType = clickType === "right" ? "contextmenu" : "click";
    
    const event = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        view: window,
        button: clickType === "right" ? 2 : 0, // 0 = left click, 2 = right click
    });

    // Dispatch event on the currently hovered element
    let target = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    if (target) {
        target.dispatchEvent(event);
    }
}

function toggleAutoClicker() {
    autoClickerActive = !autoClickerActive;
    
    if (autoClickerActive) {
        let interval = document.getElementById('interval') ? parseInt(document.getElementById('interval').value) : 100;
        clickType = document.getElementById('clickType') ? document.getElementById('clickType').value : "left";
        
        clickInterval = setInterval(autoClick, interval);
    } else {
        clearInterval(clickInterval);
    }
}

// Listen for F6 keypress to toggle auto-clicker
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "f6") {
        toggleAutoClicker();
    }
});
