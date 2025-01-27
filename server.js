const express = require("express");
const app = express();

const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("")));

let arr = [];
let playingArray = [];

io.on("connection", (socket) => {
    socket.on("find", (e) => {
        if (e.name) {
            arr.push(e.name);

            if (arr.length >= 2) {
                const p1obj = {
                    p1name: arr[0],
                    p1value: "X",
                    p1move: ""
                };
                const p2obj = {
                    p2name: arr[1],
                    p2value: "O",
                    p2move: ""
                };

                const obj = {
                    p1: p1obj,
                    p2: p2obj,
                    sum: 1
                };

                playingArray.push(obj);
                arr.splice(0, 2);

                io.emit("find", { allPlayers: playingArray });
            }
        }
    });

    socket.on("playing", (e) => {
        if (e.value === "X") {
            const objToChange = playingArray.find(obj => obj.p1.p1name === e.name);
            if (objToChange) {
                objToChange.p1.p1move = e.id;
                objToChange.sum++;
            }
        } else if (e.value === "O") {
            const objToChange = playingArray.find(obj => obj.p2.p2name === e.name);
            if (objToChange) {
                objToChange.p2.p2move = e.id;
                objToChange.sum++;
            }
        }

        io.emit("playing", { allPlayers: playingArray });
    });

    socket.on("gameOver", (e) => {
        playingArray = playingArray.filter(obj => obj.p1.p1name !== e.name);
        console.log(playingArray);
        console.log("Game over");
    });
});

app.get("/", (req, res) => {
    return res.sendFile("index.html");
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
