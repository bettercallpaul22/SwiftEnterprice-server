import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserService } from '../services/userService';
import { PassengerSchema, DriverSchema, LoginSchema } from '../schemas';
import { generateToken, comparePassword, authenticateToken } from '../utils/auth';
import { Passenger, Driver, User } from '../types';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         role:
 *           type: string
 *           enum: [passenger, driver]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Passenger:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             preferredPaymentMethod:
 *               type: string
 *               enum: [cash, card, wallet]
 *             emergencyContact:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 relationship:
 *                   type: string
 *             profilePicture:
 *               type: string
 *               format: uri
 *     Driver:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             licenseNumber:
 *               type: string
 *             licenseExpiryDate:
 *               type: string
 *               format: date
 *             vehicleDetails:
 *               type: object
 *               properties:
 *                 make:
 *                   type: string
 *                 model:
 *                   type: string
 *                 year:
 *                   type: integer
 *                 color:
 *                   type: string
 *                 licensePlate:
 *                   type: string
 *                 insuranceNumber:
 *                   type: string
 *                 insuranceExpiryDate:
 *                   type: string
 *                   format: date
 *             bankDetails:
 *               type: object
 *               properties:
 *                 accountNumber:
 *                   type: string
 *                 bankName:
 *                   type: string
 *                 accountName:
 *                   type: string
 *             documents:
 *               type: object
 *               properties:
 *                 driverLicense:
 *                   type: string
 *                   format: uri
 *                 vehicleRegistration:
 *                   type: string
 *                   format: uri
 *                 insuranceCertificate:
 *                   type: string
 *                   format: uri
 *                 backgroundCheck:
 *                   type: string
 *                   format: uri
 *             profilePicture:
 *               type: string
 *               format: uri
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 8
 *         role:
 *           type: string
 *           enum: [passenger, driver]
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 *               description: JWT token
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         error:
 *           type: object
 *           nullable: true
 */

/**
 * @swagger
 * /api/auth/register/passenger:
 *   post:
 *     summary: Register a new passenger
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - dateOfBirth
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"
 *                 description: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *               username:
 *                 type: string
 *                 minLength: 2
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 nullable: true
 *               phoneNumber:
 *                 type: string
 *                 pattern: "^\\+?[\\d\\s\\-\\(\\)]{10,}"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: "Must be between 18 and 100 years old"
 *                 nullable: true
 *               role:
 *                 type: string
 *                 enum: [passenger]
 *               preferredPaymentMethod:
 *                 type: string
 *                 enum: [cash, card, wallet]
 *                 default: cash
 *               emergencyContact:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     minLength: 2
 *                   phoneNumber:
 *                     type: string
 *                     pattern: "^\\+?[\\d\\s\\-\\(\\)]{10,}"
 *                   relationship:
 *                     type: string
 *                     minLength: 2
 *               profilePicture:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Passenger registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Passenger registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "drtuMRpgMkuMuyX1FNxj"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "test@example.com"
 *                     role:
 *                       type: string
 *                       enum: [passenger]
 *                       example: "passenger"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+2348012345678"
 *                     dateOfBirth:
 *                       type: string
 *                       format: date-time
 *                       example: "1990-01-01T00:00:00.000Z"
 *                     profilePicture:
 *                       type: string
 *                       nullable: true
 *                       example: ""
 *                     preferredPaymentMethod:
 *                       type: string
 *                       enum: [cash, card, wallet]
 *                       example: "cash"
 *                     walletBalance:
 *                       type: number
 *                       example: 0
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     emergencyContact:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: ""
 *                         phoneNumber:
 *                           type: string
 *                           example: ""
 *                         relationship:
 *                           type: string
 *                           example: ""
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
 *                 error:
 *                   type: object
 *                   nullable: true
 */
router.post('/register/passenger', async (req: Request, res: Response) => {
  try {
    const validatedData = PassengerSchema.parse(req.body);
    
    const existingUser = await UserService.findByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists'  
      });
    }

    const passenger = await UserService.createPassenger(validatedData);
    
    // Remove password from response
    const { password, ...passengerData } = passenger as any;
    
    res.status(201).json({
      success: true,
      message: 'Passenger registered successfully',
      data: passengerData
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed',
      error: error.errors || error
    });
  }
});

/**
 * @swagger
 * /api/auth/register/driver:
 *   post:
 *     summary: Register a new driver
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - dateOfBirth
 *               - role
 *               - licenseNumber
 *               - licenseExpiryDate
 *               - vehicleDetails
 *               - documents
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"
 *                 description: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *               phoneNumber:
 *                 type: string
 *                 pattern: "^\\+?[\\d\\s\\-\\(\\)]{10,}"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: "Must be between 18 and 100 years old"
 *               role:
 *                 type: string
 *                 enum: [driver]
 *               licenseNumber:
 *                 type: string
 *                 minLength: 5
 *               licenseExpiryDate:
 *                 type: string
 *                 format: date
 *                 description: "Must be a valid future date"
 *               vehicleDetails:
 *                 type: object
 *                 required: [make, model, year, color, licensePlate, insuranceNumber, insuranceExpiryDate]
 *                 properties:
 *                   make:
 *                     type: string
 *                     minLength: 2
 *                   model:
 *                     type: string
 *                     minLength: 2
 *                   year:
 *                     type: integer
 *                     minimum: 1990
 *                     maximum: 2026
 *                   color:
 *                     type: string
 *                     minLength: 2
 *                   licensePlate:
 *                     type: string
 *                     pattern: "^[A-Z0-9\\s\\-]{1,8}$"
 *                   insuranceNumber:
 *                     type: string
 *                     minLength: 5
 *                   insuranceExpiryDate:
 *                     type: string
 *                     format: date
 *                     description: "Must be a valid future date"
 *               bankDetails:
 *                 type: object
 *                 properties:
 *                   accountNumber:
 *                     type: string
 *                     minLength: 10
 *                   bankName:
 *                     type: string
 *                     minLength: 2
 *                   accountName:
 *                     type: string
 *                     minLength: 2
 *               documents:
 *                 type: object
 *                 required: [driverLicense, vehicleRegistration, insuranceCertificate, backgroundCheck]
 *                 properties:
 *                   driverLicense:
 *                     type: string
 *                     format: uri
 *                   vehicleRegistration:
 *                     type: string
 *                     format: uri
 *                   insuranceCertificate:
 *                     type: string
 *                     format: uri
 *                   backgroundCheck:
 *                     type: string
 *                     format: uri
 *               profilePicture:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Driver registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Driver registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "OaQcLlMFoH3gRNY4WXzx"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "driver@example.com"
 *                     role:
 *                       type: string
 *                       enum: [driver]
 *                       example: "driver"
 *                     firstName:
 *                       type: string
 *                       example: "Jane"
 *                     lastName:
 *                       type: string
 *                       example: "Smith"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+2348098765432"
 *                     dateOfBirth:
 *                       type: string
 *                       format: date-time
 *                       example: "1985-05-15T00:00:00.000Z"
 *                     profilePicture:
 *                       type: string
 *                       nullable: true
 *                       example: ""
 *                     licenseNumber:
 *                       type: string
 *                       example: "LIC123456"
 *                     licenseExpiryDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-12-31T00:00:00.000Z"
 *                     vehicleDetails:
 *                       type: object
 *                       properties:
 *                         make:
 *                           type: string
 *                           example: "Toyota"
 *                         model:
 *                           type: string
 *                           example: "Camry"
 *                         year:
 *                           type: integer
 *                           example: 2020
 *                         color:
 *                           type: string
 *                           example: "Silver"
 *                         licensePlate:
 *                           type: string
 *                           example: "ABC123"
 *                         insuranceNumber:
 *                           type: string
 *                           example: "INS789"
 *                         insuranceExpiryDate:
 *                           type: string
 *                           format: date-time
 *                           example: "2026-12-31T00:00:00.000Z"
 *                     rating:
 *                       type: number
 *                       example: 0
 *                     totalRides:
 *                       type: integer
 *                       example: 0
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     isAvailable:
 *                       type: boolean
 *                       example: false
 *                     bankDetails:
 *                       type: object
 *                       properties:
 *                         accountNumber:
 *                           type: string
 *                           example: ""
 *                         bankName:
 *                           type: string
 *                           example: ""
 *                         accountName:
 *                           type: string
 *                           example: ""
 *                     documents:
 *                       type: object
 *                       properties:
 *                         driverLicense:
 *                           type: string
 *                           format: uri
 *                           example: "https://example.com/license.jpg"
 *                         vehicleRegistration:
 *                           type: string
 *                           format: uri
 *                           example: "https://example.com/registration.jpg"
 *                         insuranceCertificate:
 *                           type: string
 *                           format: uri
 *                           example: "https://example.com/insurance.jpg"
 *                         backgroundCheck:
 *                           type: string
 *                           format: uri
 *                           example: "https://example.com/background.jpg"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "License expiry date must be a valid future date"
 *                 error:
 *                   type: object
 *                   nullable: true
 */
router.post('/register/driver', async (req: Request, res: Response) => {
  try {
    const validatedData = DriverSchema.parse(req.body);
    
    const existingUser = await UserService.findByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    const driver = await UserService.createDriver(validatedData);
    
    // Remove password from response
    const { password, ...driverData } = driver as any;
    
    res.status(201).json({
      success: true,
      message: 'Driver registered successfully',
      data: driverData
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed',
      error: error.errors || error
    });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = LoginSchema.parse(req.body);
    
    const user = await UserService.findByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Get password from user (stored separately for security)
    const storedPassword = (user as any).password;
    if (!storedPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await comparePassword(validatedData.password, storedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user);
    
    // Remove password from response
    const { password, ...userData } = user as any;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Login failed',
      error: error.errors || error
    });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const user = authenticateToken(req);
    
    const fullUser = await UserService.findById(user.id);
    if (!fullUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    const { password, ...userData } = fullUser as any;
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error: any) {
    console.error('Profile error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
});

// Update passenger profile
router.put('/profile/passenger/:id', async (req: Request, res: Response) => {
  try {
    const user = authenticateToken(req);
    
    if (user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedPassenger = await UserService.updatePassenger(req.params.id, req.body);
    if (!updatedPassenger) {
      return res.status(404).json({
        success: false,
        message: 'Passenger not found'
      });
    }

    // Remove password from response
    const { password, ...passengerData } = updatedPassenger as any;
    
    res.json({
      success: true,
      message: 'Passenger profile updated successfully',
      data: passengerData
    });
  } catch (error: any) {
    console.error('Update passenger error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Update failed',
      error: error.errors || error
    });
  }
});

// Update driver profile
router.put('/profile/driver/:id', async (req: Request, res: Response) => {
  try {
    const user = authenticateToken(req);
    
    if (user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedDriver = await UserService.updateDriver(req.params.id, req.body);
    if (!updatedDriver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Remove password from response
    const { password, ...driverData } = updatedDriver as any;
    
    res.json({
      success: true,
      message: 'Driver profile updated successfully',
      data: driverData
    });
  } catch (error: any) {
    console.error('Update driver error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Update failed',
      error: error.errors || error
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

export default router;