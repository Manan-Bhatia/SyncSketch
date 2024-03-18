import mongoose, { Mongoose } from "mongoose";

const whiteboardSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Untitled",
    },
    drawingData: {
        shapes: {
            scribbles: [],
            rectangles: [],
            circles: [],
        },
        colors: [String],
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const WhiteBoard =
    mongoose.models.whiteboards ||
    mongoose.model("whiteboards", whiteboardSchema);

export default WhiteBoard;
