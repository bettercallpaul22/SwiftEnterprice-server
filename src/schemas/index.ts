import { z } from 'zod';

// Common validation patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
const licensePlateRegex = /^[A-Z0-9\s\-]{1,8}$/;

// Base user schema
export const BaseUserSchema = z.object({
  email: z.string().regex(emailRegex, 'Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  username: z.string().min(2, 'Username must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format'),
  dateOfBirth: z.string().refine((date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - parsedDate.getFullYear();
    return age >= 18 && age <= 100;
  }, 'You must be between 18 and 100 years old').optional(),
  profilePicture: z.string().url().optional(),
});

// Passenger schema
export const PassengerSchema = BaseUserSchema.extend({
  role: z.literal('passenger'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  preferredPaymentMethod: z.enum(['cash', 'card', 'wallet']).optional(),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name must be at least 2 characters'),
    phoneNumber: z.string().regex(phoneRegex, 'Invalid emergency contact phone number'),
    relationship: z.string().min(2, 'Relationship must be specified'),
  }).optional(),
});

// Driver schema
export const DriverSchema = BaseUserSchema.extend({
  role: z.literal('driver'),
  licenseNumber: z.string().min(5, 'License number must be at least 5 characters'),
  licenseExpiryDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
  }, 'License expiry date must be a valid future date'),
  vehicleDetails: z.object({
    make: z.string().min(2, 'Vehicle make must be specified'),
    model: z.string().min(2, 'Vehicle model must be specified'),
    year: z.number().min(1990, 'Vehicle year must be 1990 or later').max(new Date().getFullYear() + 1, 'Vehicle year cannot be in the future'),
    color: z.string().min(2, 'Vehicle color must be specified'),
    licensePlate: z.string().regex(licensePlateRegex, 'Invalid license plate format'),
    insuranceNumber: z.string().min(5, 'Insurance number must be at least 5 characters'),
    insuranceExpiryDate: z.string().refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
    }, 'Insurance expiry date must be a valid future date'),
  }),
  bankDetails: z.object({
    accountNumber: z.string().min(10, 'Account number must be at least 10 digits'),
    bankName: z.string().min(2, 'Bank name must be specified'),
    accountName: z.string().min(2, 'Account name must be specified'),
  }).optional(),
  documents: z.object({
    driverLicense: z.string().url('Driver license document must be a valid URL'),
    vehicleRegistration: z.string().url('Vehicle registration document must be a valid URL'),
    insuranceCertificate: z.string().url('Insurance certificate must be a valid URL'),
    backgroundCheck: z.string().url('Background check document must be a valid URL'),
  }),
});

// Login schema
export const LoginSchema = z.object({
  email: z.string().regex(emailRegex, 'Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['passenger', 'driver']).optional(),
});

// Update schemas
export const UpdatePassengerSchema = PassengerSchema.partial().omit({ 
  email: true, 
  password: true, 
  role: true 
});

export const UpdateDriverSchema = DriverSchema.partial().omit({ 
  email: true, 
  password: true, 
  role: true 
});

// Type exports
export type BaseUserInput = z.infer<typeof BaseUserSchema>;
export type PassengerInput = z.infer<typeof PassengerSchema>;
export type DriverInput = z.infer<typeof DriverSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdatePassengerInput = z.infer<typeof UpdatePassengerSchema>;
export type UpdateDriverInput = z.infer<typeof UpdateDriverSchema>;