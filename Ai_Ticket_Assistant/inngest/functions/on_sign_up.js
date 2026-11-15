import { inngest } from "../client.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendEmail } from "../../utils/mailer.js";

export const onUserSignup = inngest.createFunction(
    {
        id: "on-user-signup",
        name: "On User Signup",
        retries: 2,
        triggers: [{ event: "user/signup" }],
    },
    async ({ event, step }) => {
        try {
            const { email } = event.data;
            const user = await step.run("get-user-email", async () => {
                const userObject = await User.findOne({ email: email });
                if (!userObject) {
                    throw new NonRetriableError(`User with email ${email} not found`);
                }
                return userObject;
            });

            await step.run("send-welcome-email", async () => {
                const subject = "Welcome to AgenticAI Support!";
                const message = `Hello ${user.name || user.email},\n\nThank you for signing up for AgenticAI Support! We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.\n\nBest regards,\nThe AgenticAI Team`;
                await sendEmail(user.email, subject, message);
            });
            return { success: true, message: "Welcome email sent successfully" };
        } catch (error) {
            console.error("Error in onUserSignup function:", error);
            throw error;
        }
    }
);
