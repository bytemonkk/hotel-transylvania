import { emailQueue } from "./email.queue.js";

await emailQueue.add("test-email", {
    to: "dobby@transylvania.com",
    subject: "Hotel Transylvania Test",
    message: "BullMQ is working!",
});

console.log("Test email job added!");

process.exit(0);