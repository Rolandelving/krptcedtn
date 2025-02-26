<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auto Clicker</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
        input, button { margin: 10px; padding: 5px; }
    </style>
</head>
<body>
    <h1>Auto Clicker</h1>
    <label for="interval">Click Interval (ms):</label>
    <input type="number" id="interval" value="100">
    <br>
    <label for="keybind">Start/Stop Key:</label>
    <input type="text" id="keybind" value="f6" readonly>
    <p>Press F6 to start/stop auto-clicking.</p>

    <script>
        let autoClickerActive = false;
        let interval = 100;
        let clickInterval;

        function autoClick() {
            document.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }

        function toggleAutoClicker() {
            autoClickerActive = !autoClickerActive;
            if (autoClickerActive) {
                interval = document.getElementById('interval').value;
                clickInterval = setInterval(autoClick, interval);
            } else {
                clearInterval(clickInterval);
            }
        }

        document.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'f6') {
                toggleAutoClicker();
            }
        });
    </script>
</body>
</html>
