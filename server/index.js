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
        }
    } catch (error) {
        console.log("Error adding user to whiteboard" + error);
    }
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
            }
        } catch (error) {
            console.log("Error removing user from whiteboard" + error);
        }
    });
});

httpServer.listen(3001, () => {
    console.log("listening on 3001");
});
