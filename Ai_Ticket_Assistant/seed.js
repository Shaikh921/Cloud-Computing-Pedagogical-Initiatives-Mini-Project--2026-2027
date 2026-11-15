import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/user.js';
import Ticket from './models/ticket.js';

dotenv.config();

const DEFAULT_PASSWORD = 'Pass@123';

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI || process.env.MONOGO_URI);
    console.log('Connected successfully!');

    // Hash uniform password
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    const usersData = [
      // Admins
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@supportai.in',
        password: hashedPassword,
        role: 'admin',
        skills: ['Architecture', 'System Design', 'Security', 'Management'],
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@supportai.in',
        password: hashedPassword,
        role: 'admin',
        skills: ['Cloud', 'DevOps', 'Incident Response'],
      },
      // Moderators
      {
        name: 'Rohan Verma',
        email: 'rohan.verma@supportai.in',
        password: hashedPassword,
        role: 'moderator',
        skills: ['React', 'Node.js', 'JavaScript', 'Frontend', 'Tailwind', 'Next.js'],
      },
      {
        name: 'Ananya Iyer',
        email: 'ananya.iyer@supportai.in',
        password: hashedPassword,
        role: 'moderator',
        skills: ['MongoDB', 'Database Management', 'Python', 'Mongoose', 'Redis', 'SQL'],
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@supportai.in',
        password: hashedPassword,
        role: 'moderator',
        skills: ['AWS', 'Docker', 'Kubernetes', 'DevOps', 'Microservices', 'Linux'],
      },
      // Regular Users
      {
        name: 'Rahul Gupta',
        email: 'rahul.gupta@gmail.com',
        password: hashedPassword,
        role: 'user',
        skills: [],
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@gmail.com',
        password: hashedPassword,
        role: 'user',
        skills: [],
      },
      {
        name: 'Amit Joshi',
        email: 'amit.joshi@gmail.com',
        password: hashedPassword,
        role: 'user',
        skills: [],
      },
      {
        name: 'Pooja Nair',
        email: 'pooja.nair@gmail.com',
        password: hashedPassword,
        role: 'user',
        skills: [],
      },
      {
        name: 'Kavita Mehra',
        email: 'kavita.mehra@gmail.com',
        password: hashedPassword,
        role: 'user',
        skills: [],
      },
    ];

    console.log('Seeding simulated Indian users...');
    const createdUsers = {};
    for (const u of usersData) {
      let existing = await User.findOne({ email: u.email });
      if (!existing) {
        existing = await User.create(u);
      } else {
        existing = await User.findByIdAndUpdate(existing._id, u, { new: true });
      }
      createdUsers[u.email] = existing;
      console.log(`✓ User synced: ${u.name} (${u.email}) [${u.role}]`);
    }

    const ticketsData = [
      {
        title: 'MongoDB Connection Pool Exhaustion on Peak Spike',
        description: 'During 10 AM traffic surge, our Node.js microservices report "MongoServerSelectionError: connection pool exhausted (size: 100)". Queries start timing out across payment pipelines.',
        status: 'IN_PROGRESS',
        priority: 'high',
        helpfulNotes: 'AI Recommendation: 1) Increase `maxPoolSize` to 250 in mongoose connect options. 2) Check for unclosed cursor leaks in batch exports. 3) Enable connection reuse in serverless lambdas.',
        relatedSkills: ['MongoDB', 'Database Management', 'Node.js', 'Mongoose'],
        userEmail: 'rahul.gupta@gmail.com',
        assignedModeratorEmail: 'ananya.iyer@supportai.in',
        daysAgo: 1,
      },
      {
        title: 'React 19 Server Components SSR Hydration Crash',
        description: 'Landing page intermittently throws Minified React Error #418 during server hydration when rendering localized timestamps. The page flickers and re-renders entirely client-side.',
        status: 'RESOLVED',
        priority: 'medium',
        helpfulNotes: 'AI Recommendation: Wrap dynamic date components inside `useEffect` or utilize `<Suspense>` with a mounted state flag to prevent client/server DOM timestamp mismatch.',
        relatedSkills: ['React', 'Frontend', 'JavaScript', 'Next.js'],
        userEmail: 'sneha.reddy@gmail.com',
        assignedModeratorEmail: 'rohan.verma@supportai.in',
        daysAgo: 3,
      },
      {
        title: 'Kubernetes Pod OOMKilled in Production Worker Cluster',
        description: 'Worker pod `etl-worker-c8f9` crashed with exit code 137 (OOMKilled) after ingesting a 4.2GB bulk CSV file. Horizontal Pod Autoscaler failed to spin up replicas in time.',
        status: 'IN_PROGRESS',
        priority: 'high',
        helpfulNotes: 'AI Recommendation: Switch to streaming parse with Node.js stream pipeline instead of loading entire file buffer in RAM. Increase pod memory limits to 2Gi in Helm values.',
        relatedSkills: ['Kubernetes', 'Docker', 'DevOps', 'AWS'],
        userEmail: 'amit.joshi@gmail.com',
        assignedModeratorEmail: 'vikram.singh@supportai.in',
        daysAgo: 2,
      },
      {
        title: 'JWT Access Token Refresh Loop on Safari & iOS Browsers',
        description: 'Users on iOS WebKit devices report being kicked out to the login screen every 15 minutes. Auth cookie is not being sent due to third-party cookie restrictions.',
        status: 'TODO',
        priority: 'medium',
        helpfulNotes: 'AI Recommendation: Configure cookies with `SameSite=None; Secure; Partitioned` or serve backend on identical primary domain (`api.yourdomain.com`) with First-Party cookie context.',
        relatedSkills: ['Node.js', 'Security', 'React'],
        userEmail: 'pooja.nair@gmail.com',
        assignedModeratorEmail: 'rohan.verma@supportai.in',
        daysAgo: 0,
      },
      {
        title: 'Tailwind CSS v4 Dark Mode Contrast Bug in Navigation',
        description: 'On mobile viewports, the dropdown navigation backdrop has opacity 0.2 causing white text to bleed over light cards. Need CSS variable adjustment in theme root.',
        status: 'RESOLVED',
        priority: 'low',
        helpfulNotes: 'AI Recommendation: Set `backdrop-blur-md bg-slate-900/90` and verify dark color scheme variables in root `@theme` definition.',
        relatedSkills: ['Tailwind', 'Frontend', 'React'],
        userEmail: 'kavita.mehra@gmail.com',
        assignedModeratorEmail: 'rohan.verma@supportai.in',
        daysAgo: 4,
      },
      {
        title: 'AWS S3 Presigned URL Upload Fails with 403 Forbidden',
        description: 'Frontend client gets 403 SignatureDoesNotMatch when uploading profile attachments greater than 25MB via direct presigned PUT URLs.',
        status: 'TODO',
        priority: 'high',
        helpfulNotes: 'AI Recommendation: Verify that `Content-Type` header sent by frontend exact-matches the content type passed during S3 `getSignedUrlPromise` generation.',
        relatedSkills: ['AWS', 'Cloud', 'Node.js'],
        userEmail: 'rahul.gupta@gmail.com',
        assignedModeratorEmail: 'vikram.singh@supportai.in',
        daysAgo: 0,
      },
      {
        title: 'Redis Cache Stale Keys after Bulk Product Catalog Sync',
        description: 'When catalog price updates are pushed through inventory CMS, product detail pages continue showing cached old prices for up to 2 hours.',
        status: 'CLOSED',
        priority: 'low',
        helpfulNotes: 'AI Recommendation: Implement cache tagging or trigger explicit Redis wildcard pattern eviction on catalog publish webhook events.',
        relatedSkills: ['Redis', 'Database Management', 'Node.js'],
        userEmail: 'sneha.reddy@gmail.com',
        assignedModeratorEmail: 'ananya.iyer@supportai.in',
        daysAgo: 6,
      },
    ];

    console.log('Seeding simulated technical support tickets...');
    // Clear old tickets to keep dataset clean
    await Ticket.deleteMany({});

    for (const t of ticketsData) {
      const creator = createdUsers[t.userEmail];
      const moderator = createdUsers[t.assignedModeratorEmail];
      const createdDate = new Date(Date.now() - t.daysAgo * 86400000);

      const ticketDoc = await Ticket.create({
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        helpfulNotes: t.helpfulNotes,
        relatedSkills: t.relatedSkills,
        createdBy: creator?._id,
        assignedTo: moderator?._id,
        createdAt: createdDate,
      });

      console.log(`✓ Ticket created: "${t.title}" -> Assigned to ${t.assignedModeratorEmail}`);
    }

    console.log('\n========================================');
    console.log('SEEDING COMPLETED SUCCESSFULLY!');
    console.log('========================================');
    console.log(`Default password for all users: ${DEFAULT_PASSWORD}`);
    console.log('========================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();

