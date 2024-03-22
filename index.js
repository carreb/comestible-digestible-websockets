const express = require("express");
let app = express();
const Http = require("http").Server(app);
const io = require("socket.io")(Http, {
  cors: {
    origin: "*",
  },
});


let timer = 30;

function decreaseTimer() {
    if (timer > 0) {
        timer--;
        io.emit("timer", timer);
    } else if (timer == 0 || timer == -1) {
        flickerTimer()
        timer = -2
    }
}

function flickerTimer() {
    // send alternating timer values of -1 and 0 to flicker the timer on the client
    // the client hides the timer on value -1, so it should start visible, flicker on and off three times, and end invisible.
    io.emit("timer", -1);
    setTimeout(() => {
        io.emit("timer", 0);
    }, 500);
    setTimeout(() => {
        io.emit("timer", -1);
    }, 1000);
    setTimeout(() => {
        io.emit("timer", 0);
    }, 1500);
    setTimeout(() => {
        io.emit("timer", -1);
    }, 2000);
    setTimeout(() => {
        io.emit("timer", -2);
    }, 2500);
}

setInterval(decreaseTimer, 1000);

io.on("connection", (socket) => {
    // send the Timer
    io.emit("timer", timer);
    socket.on("newTimer", (data) => {
      timer = data;
      io.emit("timer", timer);
    });
})

Http.listen(56565, () => {
    console.log("Listening on port 56565");
});