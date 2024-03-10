import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.DB_URL!);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("Connected to DB");
        });
        connection.on("error", (error) => {
            console.log("Error connecting to DB" + error);
        });
    } catch (error) {
        console.log("Error connecting to DB" + error);
    }
}
