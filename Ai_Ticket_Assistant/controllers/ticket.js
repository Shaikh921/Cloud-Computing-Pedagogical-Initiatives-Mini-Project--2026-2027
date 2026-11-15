import mongoose from "mongoose";
import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.js";

export const createTicket = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title?.trim() || !description?.trim()) {
            return res.status(400).json({ error: "Title and description are required" });
        }
        const userId = req.user?.id || req.user?._id;
        const newTicket = await Ticket.create({
            title: title.trim(),
            description: description.trim(),
            createdBy: userId,
        });

        // Fire Inngest event gracefully
        try {
            await inngest.send({
                name: "ticket/created",
                data: {
                    ticketId: newTicket._id.toString(),
                    title: newTicket.title,
                    description: newTicket.description,
                    createdBy: userId ? userId.toString() : "",
                }
            });
        } catch (inngestErr) {
            console.warn("Inngest event dispatch skipped or dev server offline:", inngestErr.message);
        }

        return res.status(201).json({
            message: "Ticket created successfully and processing started",
            ticket: newTicket
        });
    } catch (err) {
        console.error("Error creating ticket:", err.message);
        return res.status(500).json({ error: "Internal server error", details: err.message });
    }
};

export const createticket = createTicket;

export const getTickets = async (req, res) => {
    try {
        const user = req.user;
        let tickets = [];

        if (user.role !== "user") {
            // Staff sees all tickets
            tickets = await Ticket.find({})
                .populate("assignedTo", ["name", "email", "_id"])
                .populate("createdBy", ["name", "email", "_id"])
                .sort({ createdAt: -1 });
        } else {
            // Standard users only see their own tickets, with assigned moderator populated
            const userId = user.id || user._id;
            tickets = await Ticket.find({ createdBy: userId })
                .populate("assignedTo", ["name", "email", "_id"])
                .select("title description status priority helpfulNotes relatedSkills assignedTo createdBy createdAt")
                .sort({ createdAt: -1 });
        }

        return res.status(200).json({ tickets });
    } catch (err) {
        console.error("Error fetching tickets:", err.message);
        return res.status(500).json({ error: "Internal server error", details: err.message });
    }
};

export const getTicket = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ticket ID format" });
        }

        const user = req.user;
        let ticket = null;

        if (user.role !== "user") {
            ticket = await Ticket.findById(id)
                .populate("assignedTo", ["name", "email", "_id"])
                .populate("createdBy", ["name", "email", "_id"]);
        } else {
            const userId = user.id || user._id;
            ticket = await Ticket.findOne({
                _id: id,
                createdBy: userId
            })
            .populate("assignedTo", ["name", "email", "_id"])
            .populate("createdBy", ["name", "email", "_id"]);
        }

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found or access denied" });
        }

        return res.status(200).json({ ticket });
    } catch (err) {
        console.error("Error fetching ticket:", err.message);
        return res.status(500).json({ error: "Internal server error", details: err.message });
    }
};

export const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ticket ID format" });
        }

        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        const user = req.user;
        const isStaff = user.role === "admin" || user.role === "moderator";
        const isOwner = ticket.createdBy && ticket.createdBy.toString() === (user.id || user._id).toString();

        // Enforce authorization: Only staff or ticket creator can update
        if (!isStaff && !isOwner) {
            return res.status(403).json({ error: "Forbidden: You are not authorized to update this ticket" });
        }

        const { status, priority, helpfulNotes, assignedTo } = req.body;
        const updates = {};

        if (isStaff) {
            // Staff members can change status, priority, notes, and reassignment
            if (status !== undefined) {
                const validStatuses = ["TODO", "IN_PROGRESS", "RESOLVED", "CLOSED"];
                if (!validStatuses.includes(status)) {
                    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
                }
                updates.status = status;
            }
            if (priority !== undefined) {
                const validPriorities = ["low", "medium", "high"];
                if (!validPriorities.includes(priority.toLowerCase())) {
                    return res.status(400).json({ error: `Invalid priority. Must be one of: ${validPriorities.join(", ")}` });
                }
                updates.priority = priority.toLowerCase();
            }
            if (helpfulNotes !== undefined) updates.helpfulNotes = helpfulNotes;
            if (assignedTo !== undefined) {
                if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
                    return res.status(400).json({ error: "Invalid assignedTo user ID format" });
                }
                updates.assignedTo = assignedTo || null;
            }
        } else {
            // Non-staff owners can only mark their own ticket as CLOSED / RESOLVED
            if (priority !== undefined || helpfulNotes !== undefined || assignedTo !== undefined) {
                return res.status(403).json({ error: "Forbidden: End users cannot override priority, notes, or assignment" });
            }
            if (status !== undefined) {
                if (!["RESOLVED", "CLOSED"].includes(status)) {
                    return res.status(400).json({ error: "End users can only mark their own tickets as RESOLVED or CLOSED" });
                }
                updates.status = status;
            }
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        )
        .populate("assignedTo", ["name", "email", "_id"])
        .populate("createdBy", ["name", "email", "_id"]);

        return res.status(200).json({ message: "Ticket updated successfully", ticket: updatedTicket });
    } catch (err) {
        console.error("Error updating ticket:", err.message);
        return res.status(500).json({ error: "Internal server error", details: err.message });
    }
};
