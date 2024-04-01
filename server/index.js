import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});
import connect from "./dbConfig.js";
connect();
import WhiteBoard from "./whiteboardModel.js";
import { getUsersFromArray } from "./getUsersFromArray.js";

io.on("connection", async (socket) => {
    // user connected
    const data = JSON.parse(socket.handshake.query.data);
    let whiteboard = await WhiteBoard.findById(data.whiteboardID);
    try {
        if (
            !whiteboard.users.includes(data.user.id) &&
            data.user.id != "" &&
            socket.connected
        ) {
            whiteboard.users.push(data.user.id);
            await whiteboard.save();
            console.log(data.user.username + " connected");
            const users = await getUsersFromArray(whiteboard.users);
            socket.emit("connected-users", { connected: users });
            socket.broadcast.emit("user-connected", {
                user: { id: data.user.id, username: data.user.username },
            });
        }
    } catch (error) {
        console.log("Error adding user to whiteboard" + error);
    }
    // cursor movement
    socket.on("cursor-moving", (data) => {
        socket.broadcast.emit("cursor-moving", data);
    });
    // drawing shapes
    socket.on("drawing-scribble", (data) => {
        socket.broadcast.emit("drawing-scribble", data);
    });
    socket.on("drawing-rectangle", (data) => {
        socket.broadcast.emit("drawing-rectangle", data);
    });
    socket.on("drawing-circle", (data) => {
        socket.broadcast.emit("drawing-circle", data);
    });
    socket.on("clear-canvas", () => {
        socket.broadcast.emit("clear-canvas");
    });
    // user disconnected
    socket.on("disconnect", async () => {
        try {
            whiteboard = await WhiteBoard.findById(data.whiteboardID);
            if (whiteboard && whiteboard.users.includes(data.user.id)) {
                whiteboard.users = whiteboard.users.filter(
                    (id) => id != data.user.id
                );
                await whiteboard.save();
                console.log(data.user.username + " disconnected");
                socket.broadcast.emit("user-disconnected", {
                    user: {
                        id: data.user.id,
                        username: data.user.username,
                    },
                });
            }
        } catch (error) {
            console.log("Error removing user from whiteboard" + error);
        }
    });
});

httpServer.listen(3001, () => {
    console.log("listening on 3001");
});
