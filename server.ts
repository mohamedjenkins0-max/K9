import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './src/db/index.ts';
import { institutions, admissionApplications, students, staff, classes, grades, attendance, announcements, auditLogs, users } from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { getOrCreateUser } from './src/db/users.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', async (_req: Request, res: Response) => {
    try {
      const insts = await db.select().from(institutions);
      res.json({
        status: 'healthy',
        database: 'cloud_sql_postgresql',
        institutionsCount: insts.length,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Health check database query error:', err);
      res.status(500).json({ status: 'degraded', error: err.message });
    }
  });

  // User synchronization with Firebase Auth
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User token missing' });
      }
      const { uid, email } = req.user;
      const { fullName, role, institutionId } = req.body;
      const user = await getOrCreateUser(uid, email || '', fullName, role, institutionId);
      res.json(user);
    } catch (err: any) {
      console.error('Error syncing user:', err);
      res.status(500).json({ error: 'Failed to sync user' });
    }
  });

  // Public Institutions Directory
  app.get('/api/institutions', async (_req: Request, res: Response) => {
    try {
      const list = await db.select().from(institutions);
      res.json(list);
    } catch (err: any) {
      console.error('Failed to query institutions:', err);
      res.status(500).json({ error: 'Failed to retrieve institutions' });
    }
  });

  // Public Online Admissions submission
  app.post('/api/admissions', async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const prefix = data.institutionId === 'k9_school' ? 'SCH' : 'VOC';
      const year = new Date().getFullYear();
      const seq = Math.floor(1000 + Math.random() * 9000);
      const applicationNumber = `APP-${year}-${prefix}-${seq}`;
      const id = 'adm-' + Date.now();

      const newRecord = {
        id,
        applicationNumber,
        institutionId: data.institutionId,
        applicantFullName: data.applicantFullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        parentGuardianName: data.parentGuardianName,
        parentGuardianPhone: data.parentGuardianPhone,
        address: data.address,
        appliedClassOrCourse: data.appliedClassOrCourse,
        previousSchool: data.previousSchool || null,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyRelationship: data.emergencyRelationship,
        status: 'pending',
        documentsJson: JSON.stringify(data.documents || []),
        createdAt: new Date().toISOString()
      };

      await db.insert(admissionApplications).values(newRecord);

      // Audit log entry
      await db.insert(auditLogs).values({
        id: 'aud-' + Date.now(),
        institutionId: data.institutionId,
        action: 'PUBLIC_ADMISSION_SUBMITTED',
        actorId: 'guest-applicant',
        actorEmail: 'applicant@public.sl',
        actorRole: 'student',
        targetEntity: 'AdmissionApplication',
        targetId: id,
        detailsJson: JSON.stringify({ applicationNumber, applicant: data.applicantFullName }),
        timestamp: new Date().toISOString()
      });

      res.status(201).json(newRecord);
    } catch (err: any) {
      console.error('Failed to submit admission:', err);
      res.status(500).json({ error: 'Admission submission failed' });
    }
  });

  // Enrolled Students list
  app.get('/api/students', async (req: Request, res: Response) => {
    try {
      const instId = req.query.institutionId as string | undefined;
      const query = instId
        ? db.select().from(students).where(eq(students.institutionId, instId))
        : db.select().from(students);
      const list = await query;
      res.json(list);
    } catch (err: any) {
      console.error('Failed to query students:', err);
      res.status(500).json({ error: 'Failed to retrieve students' });
    }
  });

  // Mount Vite middleware in development
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} with Cloud SQL connection in region europe-west3`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
