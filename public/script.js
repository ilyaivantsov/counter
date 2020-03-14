(function () {
    const counter = $('#counter');
    const increment = $('#increment');

    let ws;
    let socket;
    let interval;

    function start() {
        clearInterval(interval);
        ws = new WebSocket(`ws://${location.host}`);

        ws.onerror = function () {
            counter.text('WebSocket error');
        };
        ws.onopen = function (event) {
            sockets = true;
            if (!+event.data) return;
            counter.text(`${event.data}`);
        };
        ws.onclose = function () {
            sockets = false;
            counter.text('WebSocket connection closed');
            ws = null;
        };
        ws.onmessage = function (event) {
            counter.text(`${event.data}`);
        }

        interval = setInterval(function () {
            if (!socket) {
                start();
            }
        }, 5000)
    }

    increment.click(function () {
        if (!ws) {
            counter.text('No WebSocket connection');
            return;
        }
        let newVal = +$('#counter').text() + 1;
        counter.text(`${newVal}`);
        ws.send(`${newVal}`);
    });

    start();
})();