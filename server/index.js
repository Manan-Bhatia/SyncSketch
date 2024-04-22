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
    const userData = JSON.parse(socket.handshake.query.data);
    let whiteboard = await WhiteBoard.findById(userData.whiteboardID);
    try {
        if (
            !whiteboard.users.includes(userData.user.id) &&
            userData.user.id != "" &&
            socket.connected
        ) {
            whiteboard.users.push(userData.user.id);
            await whiteboard.save();
            // joining a room
            socket.join(userData.whiteboardID);
            console.log(userData.user.username + " connected");
            // getting the users for self
            const users = await getUsersFromArray(whiteboard.users);
            socket.emit("connected-users", { connected: users });
            // emit to users working in the same room
            socket.to(userData.whiteboardID).emit("user-connected", {
                user: {
                    id: userData.user.id,
                    username: userData.user.username,
                },
            });
        }
    } catch (error) {
        console.log("Error adding user to whiteboard" + error);
    }
    // cursor movement
    socket.on("cursor-moving", (data) => {
        socket.to(userData.whiteboardID).emit("cursor-moving", data);
    });
    // drawing shapes
    socket.on("drawing-scribble", (data) => {
        socket.to(userData.whiteboardID).emit("drawing-scribble", data);
    });
    socket.on("drawing-rectangle", (data) => {
        socket.to(userData.whiteboardID).emit("drawing-rectangle", data);
    });
    socket.on("drawing-circle", (data) => {
        socket.to(userData.whiteboardID).emit("drawing-circle", data);
    });
    socket.on("clear-canvas", () => {
        socket.to(userData.whiteboardID).emit("clear-canvas");
    });
    // user disconnected
    socket.on("disconnect", async () => {
        try {
            whiteboard = await WhiteBoard.findById(userData.whiteboardID);
            if (whiteboard && whiteboard.users.includes(userData.user.id)) {
                whiteboard.users = whiteboard.users.filter(
                    (id) => id != userData.user.id
                );
                await whiteboard.save();
                // leaving the room
                socket.leave(userData.whiteboardID);
                console.log(userData.user.username + " disconnected");
                // emitting to only those who are in the same room
                socket.to(userData.whiteboardID).emit("user-disconnected", {
                    user: {
                        id: userData.user.id,
                        username: userData.user.username,
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
