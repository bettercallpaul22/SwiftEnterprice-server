import express, { Request, Response } from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Import routes
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Switch Server API',
      version: '1.0.0',
      description: 'API documentation for the Switch Server authentication system',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);

// Initialize Firebase Admin
const serviceAccount = {
  type: process.env.FIREBASE_TYPE || 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID!,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID!,
  private_key: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL!,
  client_id: process.env.FIREBASE_CLIENT_ID!,
  auth_uri: process.env.FIREBASE_AUTH_URI!,
  token_uri: process.env.FIREBASE_TOKEN_URI!,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL!,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL!,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || 'googleapis.com'
} as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Switch Server is running!' });
});

// Home route with welcome message
app.get('/home', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to Switch Server!',
    data: {
      name: 'Switch Server',
      version: '1.0.0',
      description: 'Backend API server for the Switch transportation platform',
      endpoints: {
        auth: '/api/auth',
        docs: '/api-docs',
        home: '/home'
      },
      features: [
        'Passenger registration and authentication',
        'Driver registration and authentication', 
        'JWT-based authentication',
        'Firebase integration',
        'Comprehensive API documentation'
      ],
      status: 'Ready for deployment'
    }
  });
});

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Auth routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
