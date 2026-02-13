export interface User {
  id: string;
  email: string;
  role: 'passenger' | 'driver';
  createdAt: Date;
  updatedAt: Date;
}

export interface Passenger extends User {
  role: 'passenger';
  firstName: string;
  lastName: string;
  username: string;
  gender?: 'male' | 'female' | 'other';
  phoneNumber: string;
  dateOfBirth?: Date;
  profilePicture?: string;
  preferredPaymentMethod?: 'cash' | 'card' | 'wallet';
  walletBalance: number;
  isActive: boolean;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string; 
  };
}

export interface Driver extends User {
  role: 'driver';
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  profilePicture?: string;
  licenseNumber: string;
  licenseExpiryDate: Date;
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
    insuranceNumber: string;
    insuranceExpiryDate: Date;
  };
  rating: number;
  totalRides: number;
  isActive: boolean;
  isAvailable: boolean;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  documents: {
    driverLicense: string;
    vehicleRegistration: string;
    insuranceCertificate: string;
    backgroundCheck: string;
  };
}
