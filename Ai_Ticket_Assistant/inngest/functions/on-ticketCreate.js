import { inngest } from "../client.js";
import User from "../../models/user.js";
import Ticket from "../../models/ticket.js";
import { NonRetriableError } from "inngest";
import { sendEmail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai.js";

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const onTicketCreated = inngest.createFunction(
    {
        id: "on-ticket-created",
        retries: 2,
        triggers: [{ event: "ticket/created" }],
    },
    async ({ event, step }) => {
        try {
            const { ticketId } = event.data;

            // Step 1: Fetch ticket from database
            const ticket = await step.run("fetch-ticket", async () => {
                const ticketObject = await Ticket.findById(ticketId).populate("createdBy", ["name", "email", "_id"]);

                if (!ticketObject) {
                    throw new NonRetriableError("Ticket not found");
                }

                return ticketObject;
            });

            // Step 2: Ensure initial status
            await step.run("update-ticket-status", async () => {
                await Ticket.findByIdAndUpdate(ticket._id, {
                    status: "TODO"
                });
            });

            // Step 3: Run AI triage via Gemini
            const relatedSkills = await step.run("ai-processing", async () => {
                const aiResponse = await analyzeTicket(ticket);
                let skills = [];

                if (aiResponse) {
                    const skillsList = aiResponse.relatedSkills || [];
                    await Ticket.findByIdAndUpdate(ticket._id, {
                        priority: aiResponse.priority || "medium",
                        helpfulNotes: aiResponse.helpfulNotes || "",
                        status: "IN_PROGRESS",
                        relatedSkills: skillsList,
                    });

                    skills = skillsList;
                }

                return skills;
            });

            // Step 4: Moderator matching with load balancing and safe regex
            const moderator = await step.run("assign-moderator", async () => {
                let assignedUser = null;

                if (Array.isArray(relatedSkills) && relatedSkills.length > 0) {
                    // Escape all skill strings to prevent ReDoS / Regex Injection
                    const sanitizedPattern = relatedSkills
                        .filter(s => typeof s === "string" && s.trim().length > 0)
                        .map(s => escapeRegex(s.trim()))
                        .join("|");

                    if (sanitizedPattern) {
                        const candidates = await User.find({
                            role: "moderator",
                            skills: {
                                $elemMatch: {
                                    $regex: sanitizedPattern,
                                    $options: "i"
                                },
                            },
                        });

                        if (candidates.length > 0) {
                            // Find active workload for each candidate to balance tickets evenly
                            const candidateIds = candidates.map(c => c._id);
                            const activeWorkloads = await Ticket.aggregate([
                                {
                                    $match: {
                                        assignedTo: { $in: candidateIds },
                                        status: { $in: ["TODO", "IN_PROGRESS"] }
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$assignedTo",
                                        activeCount: { $sum: 1 }
                                    }
                                }
                            ]);

                            const workloadMap = new Map(
                                activeWorkloads.map(w => [w._id.toString(), w.activeCount])
                            );

                            // Sort by fewest active tickets
                            candidates.sort((a, b) => {
                                const loadA = workloadMap.get(a._id.toString()) || 0;
                                const loadB = workloadMap.get(b._id.toString()) || 0;
                                return loadA - loadB;
                            });

                            assignedUser = candidates[0];
                        }
                    }
                }

                // Fallback to administrator if no moderator with matching skills
                if (!assignedUser) {
                    assignedUser = await User.findOne({ role: "admin" });
                }

                await Ticket.findByIdAndUpdate(ticket._id, {
                    assignedTo: assignedUser?._id || null
                });

                return assignedUser;
            });

            // Step 5: Email notification
            await step.run("send-email-notification", async () => {
                if (moderator?.email) {
                    const finalTicket = await Ticket.findById(ticket._id);
                    await sendEmail(
                        moderator.email,
                        `Ticket Assigned: ${finalTicket?.title || ticket.title}`,
                        `Hello ${moderator.name || moderator.email},\n\nA support ticket has been assigned to you based on your skill competencies.\n\nTicket: ${finalTicket?.title || ticket.title}\nPriority: ${finalTicket?.priority || "medium"}\n\nLog in to the Support Console to inspect and resolve.\n\nBest regards,\nAgenticAI Dispatch System`
                    );
                }
            });

            return { success: true };
        } catch (error) {
            console.error("Error running ticket-created function:", error);
            throw error;
        }
    }
);
