# Switch Server

Backend API server for the Switch transportation platform.

## Vercel Deployment Configuration

This server is configured for deployment on Vercel with the following setup:

### Files Added/Modified for Vercel:

1. **`vercel.json`** - Vercel deployment configuration
   - Specifies Node.js runtime
   - Routes all requests to the compiled server
   - Sets up proper build process

2. **`package.json`** - Updated scripts
   - Added `vercel-build` script for Vercel deployment
   - Maintains existing development and build scripts

3. **`tsconfig.json`** - Enhanced for production
   - Added production-ready compiler options
   - Excluded test files from build
   - Optimized module resolution

4. **`.gitignore`** - Enhanced for production
   - Added environment file variants
   - Excluded test files and IDE configs
   - Added build artifacts to ignore list

### Environment Variables

For Vercel deployment, you'll need to set these environment variables in your Vercel project settings:

```
PORT=3000
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret-here
JWT_EXPIRES_IN=7d
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40project.iam.gserviceaccount.com
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
```

### Deployment Steps

1. Push your code to a Git repository connected to Vercel
2. In Vercel dashboard, create a new project and connect to your repository
3. Set the build command to `npm run vercel-build`
4. Set the output directory to `dist`
5. Add all required environment variables in the Vercel project settings
6. Deploy!

### API Endpoints

- `POST /api/auth/register/passenger` - Register a new passenger
- `POST /api/auth/register/driver` - Register a new driver
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile/passenger/:id` - Update passenger profile
- `PUT /api/auth/profile/driver/:id` - Update driver profile
- `POST /api/auth/logout` - Logout (client-side token removal)
- `GET /api-docs` - Swagger API documentation

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Production Build Test

The server has been tested and confirmed working in production mode:
- ✅ TypeScript compilation successful
- ✅ Production server starts correctly
- ✅ API endpoints respond properly
- ✅ Passenger registration works in production build