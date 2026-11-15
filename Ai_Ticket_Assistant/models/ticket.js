import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        default: "TODO",
        enum: ["TODO", "IN_PROGRESS", "RESOLVED", "CLOSED"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    priority: {
        type: String,
        default: "medium",
        enum: ["low", "medium", "high"]
    },
    deadline: Date,
    helpfulNotes: String,
    relatedSkills: [String],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Ticket", ticketSchema);
