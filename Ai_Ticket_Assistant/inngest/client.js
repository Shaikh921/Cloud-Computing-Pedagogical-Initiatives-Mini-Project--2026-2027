import { Inngest } from "inngest";
import dotenv from "dotenv";

dotenv.config();

export const inngest = new Inngest({
  id: "Ai Ticket Assistant",
  name: "Ai Ticket Assistant",
  isDev: process.env.NODE_ENV !== "production" || !process.env.INNGEST_EVENT_KEY,
  eventKey: process.env.INNGEST_EVENT_KEY || "local",
});
