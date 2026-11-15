# 🤖 AgenticAI — Autonomous Support Ticket Assistant

An event-driven technical support platform powered by **Node.js/Express**, **React 19**, **Inngest Agent Kit**, and **Google Gemini AI**.

The complete codebase and documentation is located in the **[`Ai_Ticket_Assistant/`](./Ai_Ticket_Assistant/)** directory.

- **Full System README & Specifications**: [Ai_Ticket_Assistant/README.md](./Ai_Ticket_Assistant/README.md)
- **Architecture Documentation**: [Ai_Ticket_Assistant/SYSTEM_DOCUMENTATION.md](./Ai_Ticket_Assistant/SYSTEM_DOCUMENTATION.md)

### Quick Start
```bash
cd Ai_Ticket_Assistant
npm install
npm --prefix frontend install
cp .env.example .env
node seed.js

# Start servers:
npm run dev              # Backend API on port 5000
npm run inngest-dev      # Inngest Dev Server on port 8288
npm run dev:frontend     # React 19 Frontend on port 3000
```
