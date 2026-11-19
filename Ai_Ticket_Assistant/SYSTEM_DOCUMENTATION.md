# 🤖 AgenticAI — Autonomous Support Ticket Assistant
### System Architecture, Autonomous Agent Pipeline & Complete Specification

---

## 1. Executive Summary

**AgenticAI Ticket Assistant** is an event-driven technical support platform powered by **Inngest**, **Google Gemini 1.5 Flash**, and modern Full-Stack web architecture. 

When a user submits a technical issue, the system does not merely store a ticket in a database; it triggers an **autonomous multi-step agentic workflow** that:
1. Performs AI-driven technical root-cause triage.
2. Calculates urgency/priority (`low`, `medium`, `high`).
3. Formulates structured moderator troubleshooting notes and external documentation links.
4. Extracts required technical skills (e.g. *MongoDB, React, Kubernetes, AWS, Redis*).
5. Matches and automatically assigns the ticket to the best-qualified moderator based on skill sets.
6. Dispatches instant email alerts to staff via SMTP.

---

## 2. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph Client["🖥️ Frontend (React 19 + Tailwind v4 + Glassmorphism)"]
        UI["Web App (Vite on :3000)"]
        AuthCtx["Auth Context & JWT Session"]
        GlassUI["Futuristic Glass UI Components"]
    end

    subgraph Backend["⚙️ Backend Server (Express on :5000)"]
        API["REST API Router (/api/auth, /api/tickets)"]
        AuthMiddleware["JWT Authentication Middleware"]
        MongoModel["Mongoose 9 ODM (User & Ticket Models)"]
    end

    subgraph Database["🍃 Database"]
        Atlas[("MongoDB Atlas Cloud Database")]
    end

    subgraph InngestEngine["⚡ Autonomous Engine (Inngest on :8288)"]
        DevServer["Inngest Local Dev Server"]
        Step1["Step 1: Fetch Ticket from DB"]
        Step2["Step 2: Update Status to TODO"]
        Step3["Step 3: Gemini 1.5 Flash Agent Triage"]
        Step4["Step 4: Skill Matching & Moderator Assignment"]
        Step5["Step 5: Send Mailtrap SMTP Email"]
    end

    subgraph External["🌐 External Intelligence & Services"]
        Gemini["Google Gemini 1.5 Flash API"]
        Mailtrap["Mailtrap SMTP Server"]
    end

    UI -->|HTTP Requests / Proxy| API
    API --> AuthMiddleware
    AuthMiddleware --> MongoModel
    MongoModel <--> Atlas
    API -->|inngest.send()| DevServer
    DevServer --> Step1 --> Step2 --> Step3 --> Step4 --> Step5
    Step3 <-->|Inference| Gemini
    Step4 <-->|Query Moderator Skills| Atlas
    Step5 -->|Send Email| Mailtrap
```

---

## 3. Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** + **Vite 8** | High-performance SPA with client-side routing |
| **Styling & Design** | **Tailwind CSS v4** + **Cyber-Glassmorphism** | Frosted glass cards, glowing neon accents, ambient glow mesh |
| **Icons** | **Lucide React** | Modern, lightweight SVG iconography |
| **Backend Runtime** | **Node.js v22** + **Express 5** | ESM modules, RESTful API architecture |
| **Database & ODM** | **MongoDB Atlas** + **Mongoose 9** | Cloud document database with indexed schemas |
| **Agentic Workflow** | **Inngest SDK v4** | Durable, step-based event-driven execution |
| **AI LLM Agent** | **@inngest/agent-kit** + **Gemini 1.5 Flash** | Structured JSON schema prompt engineering |
| **Authentication** | **JWT (JSON Web Tokens)** + **Bcrypt** | Role-based authorization (`user`, `moderator`, `admin`) |
| **Email Service** | **Nodemailer** + **Mailtrap SMTP** | Automated transactional alerts |

---

## 4. Autonomous Agent Workflow: `on-ticket-created`

The core intelligence of the platform lives in `inngest/functions/on-ticketCreate.js`. When a ticket is created via `POST /api/tickets`, the event `ticket/created` is dispatched with `{ ticketId, title, description, createdBy }`.

Inngest breaks execution into five durable steps:

```
[ticket/created Event Received]
         │
         ▼
[Step 1: fetch-ticket] ──► Retrieves ticket document from MongoDB Atlas.
         │
         ▼
[Step 2: update-ticket-status] ──► Sets ticket status to "TODO".
         │
         ▼
[Step 3: ai-processing] ──► Passes ticket title & description to Gemini 1.5 Flash.
         │                  Returns JSON:
         │                  {
         │                    "summary": "...",
         │                    "priority": "high" | "medium" | "low",
         │                    "helpfulNotes": "Detailed technical steps...",
         │                    "relatedSkills": ["React", "Node.js"]
         │                  }
         │                  Updates ticket priority, notes, and skills in DB.
         ▼
[Step 4: assign-moderator] ──► Runs a sanitized regex match on moderator skills.
         │                    Balances load across candidates by least active ticket count.
         │                    If no match found, assigns to system admin.
         │                    Updates `assignedTo` field in MongoDB.
         ▼
[Step 5: send-email-notification] ──► Fires Nodemailer to notify the assigned handler.
```

---

## 5. REST API Specification

### Authentication (`/api/auth`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/signup` | `POST` | Public | Register new user (`name`, `email`, `password`). Role is locked to `user` to prevent privilege escalation. |
| `/api/auth/login` | `POST` | Public | Verify credentials and return signed 24h JWT token + sanitized profile (no password hash). |
| `/api/auth/logout` | `POST` | Protected | Invalidate user session. |
| `/api/auth/user` | `GET` | Admin Only | Fetch list of all system users. |
| `/api/auth/update-user` | `POST` | Admin Only | Update any user's role and skill tags. |

### Support Tickets (`/api/tickets`)

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/tickets` | `POST` | Protected | Submit a new ticket; triggers Inngest AI triage workflow. |
| `/api/tickets` | `GET` | Protected | Retrieve tickets (Users see their own with assigned handler; Staff sees all). |
| `/api/tickets/:id` | `GET` | Protected | Get detailed ticket record including AI analysis. |
| `/api/tickets/:id` | `PUT/PATCH` | Protected | Update ticket: Staff can alter status, priority, notes, assignment; Creators can mark closed. |

---

## 6. AWS S3 Free Tier Integration Strategy

The platform is designed to take advantage of **AWS S3 Free Tier** (5 GB Standard Storage, 20,000 GETs, 2,000 PUTs/month) for two specific workloads:

1. **Ticket File & Telemetry Attachments:**
   - **Flow:** When submitting a ticket with crash dumps or screenshots, the frontend requests a presigned PUT URL from the Express backend via AWS SDK v3 (`@aws-sdk/s3-request-presigner`).
   - **Advantage:** Browser uploads directly to the S3 bucket, consuming 0 backend bandwidth and staying well within the free tier.
2. **Static Web Application Hosting:**
   - The compiled React 19 / Vite frontend (`/dist`) can be hosted directly in an S3 static website bucket paired with Amazon CloudFront CDN.
3. **Database Separation:**
   - S3 acts strictly as an Object Blob store. **MongoDB Atlas M0 Free Tier** remains the authoritative document store for transactional ticket and user state.

---

## 7. Simulated Indian Accounts & Test Credentials

The database has been seeded with realistic Indian user profiles across all three roles.

**Universal Password for all accounts:** `Pass@123`

| Name | Role | Email | Technical Skills |
| :--- | :--- | :--- | :--- |
| **Aarav Sharma** | `admin` | `aarav.sharma@supportai.in` | Architecture, System Design, Security, Management |
| **Priya Patel** | `admin` | `priya.patel@supportai.in` | Cloud, DevOps, Incident Response |
| **Rohan Verma** | `moderator` | `rohan.verma@supportai.in` | React, Node.js, JavaScript, Frontend, Tailwind, Next.js |
| **Ananya Iyer** | `moderator` | `ananya.iyer@supportai.in` | MongoDB, Database Management, Python, Mongoose, Redis, SQL |
| **Vikram Singh** | `moderator` | `vikram.singh@supportai.in` | AWS, Docker, Kubernetes, DevOps, Microservices, Linux |
| **Rahul Gupta** | `user` | `rahul.gupta@gmail.com` | Standard End-User |
| **Sneha Reddy** | `user` | `sneha.reddy@gmail.com` | Standard End-User |
| **Amit Joshi** | `user` | `amit.joshi@gmail.com` | Standard End-User |
| **Pooja Nair** | `user` | `pooja.nair@gmail.com` | Standard End-User |
| **Kavita Mehra** | `user` | `kavita.mehra@gmail.com` | Standard End-User |

---

## 7. Running the Full System Locally

### Step 1: Start Backend API (Port 5000)
```bash
npm run dev
```

### Step 2: Start Inngest Event Engine (Port 8288)
```bash
npm run inngest-dev
```

### Step 3: Start Futuristic React Frontend (Port 3000)
```bash
npm run dev:frontend
```

Open **`http://localhost:3000`** in any modern web browser.

---

## 👥 Project Team & Mentorship

**Mahatma Gandhi Mission's College of Engineering, Nanded**  
**Department of Computer Science & Engineering**  
**Class**: B.Tech [Btech-A]

| 👨‍💻 Created By | 👩‍🏫 Guided By |
| :--- | :--- |
| • **Rohit Suryawanshi**<br>• **Syed Maroof**<br>• **Irafan Shaikh**<br>• **Om Wattamwar**<br>• **Pawan Wadje**<br>• **Avinash Wared** | **Dr. Shital Y. Gaikwad** |


