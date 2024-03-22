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
    }
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