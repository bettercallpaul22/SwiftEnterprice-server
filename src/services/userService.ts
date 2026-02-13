import { User, Passenger, Driver } from '../types';
import { hashPassword } from '../utils/auth';
import { PassengerInput, DriverInput } from '../schemas';
import admin from 'firebase-admin';

// Mock database - In production, use a real database
const users: (Passenger | Driver)[] = [];

export class UserService {
  static async createPassenger(data: PassengerInput): Promise<Passenger> {
    // Check if user already exists in Firebase
    const db = admin.firestore();
    const passengersRef = db.collection('passengers');
    const existingUserQuery = await passengersRef.where('email', '==', data.email).get();
    
    if (!existingUserQuery.empty) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(data.password);
    const now = new Date();

    const passenger: Passenger = {
      id: '',
      email: data.email,
      role: 'passenger',
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username || '',
      gender: data.gender || undefined,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      profilePicture: data.profilePicture || '',
      preferredPaymentMethod: data.preferredPaymentMethod || 'cash',
      walletBalance: 0,
      isActive: true,
      emergencyContact: data.emergencyContact || { name: '', phoneNumber: '', relationship: '' },
      createdAt: now,
      updatedAt: now,
    };

    // Filter out undefined values before storing to Firebase
    const passengerData = { ...passenger };
    if (passengerData.gender === undefined) {
      delete passengerData.gender;
    }
    if (passengerData.dateOfBirth === undefined) {
      delete passengerData.dateOfBirth;
    }

    // Store passenger in Firebase and get the auto-generated ID
    const passengerDocRef = await passengersRef.add({
      ...passengerData,
      password: hashedPassword // Store password separately for security
    });
    
    // Get the auto-generated ID and update the passenger object
    const userId = passengerDocRef.id;
    await passengerDocRef.update({ id: userId });
    
    // Return the passenger with the Firebase-generated ID
    return { ...passenger, id: userId };
  }

  static async createDriver(data: DriverInput): Promise<Driver> {
    // Check if user already exists in Firebase
    const db = admin.firestore();
    const driversRef = db.collection('drivers');
    const existingUserQuery = await driversRef.where('email', '==', data.email).get();
    
    if (!existingUserQuery.empty) {
      throw new Error('User with this email already exists');
    }

    // Validate license expiry date
    const licenseExpiryDate = new Date(data.licenseExpiryDate);
    if (licenseExpiryDate <= new Date()) {
      throw new Error('License has expired');
    }

    // Validate insurance expiry date
    const insuranceExpiryDate = new Date(data.vehicleDetails.insuranceExpiryDate);
    if (insuranceExpiryDate <= new Date()) {
      throw new Error('Insurance has expired');
    }

    const hashedPassword = await hashPassword(data.password);
    const now = new Date();

    const driver: Driver = {
      id: '',
      email: data.email,
      role: 'driver',
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      profilePicture: data.profilePicture || '',
      licenseNumber: data.licenseNumber,
      licenseExpiryDate: licenseExpiryDate,
      vehicleDetails: {
        ...data.vehicleDetails,
        insuranceExpiryDate: insuranceExpiryDate
      },
      rating: 0,
      totalRides: 0,
      isActive: true,
      isAvailable: false,
      bankDetails: data.bankDetails || { accountNumber: '', bankName: '', accountName: '' },
      documents: data.documents,
      createdAt: now,
      updatedAt: now,
    };

    // Store driver in Firebase and get the auto-generated ID
    const driverDocRef = await driversRef.add({
      ...driver,
      password: hashedPassword // Store password separately for security
    });
    
    // Get the auto-generated ID and update the driver object
    const userId = driverDocRef.id;
    await driverDocRef.update({ id: userId });
    
    // Return the driver with the Firebase-generated ID
    return { ...driver, id: userId };
  }

  static async findByEmail(email: string): Promise<User | null> {
    const db = admin.firestore();
    
    // Check passengers collection first
    const passengersRef = db.collection('passengers');
    const passengerSnapshot = await passengersRef.where('email', '==', email).limit(1).get();
    
    if (!passengerSnapshot.empty) {
      const doc = passengerSnapshot.docs[0];
      const userData = doc.data();
      // Return user data WITH password for authentication
      return { ...userData, role: 'passenger' } as User;
    }

    // Check drivers collection
    const driversRef = db.collection('drivers');
    const driverSnapshot = await driversRef.where('email', '==', email).limit(1).get();
    
    if (!driverSnapshot.empty) {
      const doc = driverSnapshot.docs[0];
      const userData = doc.data();
      // Return user data WITH password for authentication
      return { ...userData, role: 'driver' } as User;
    }

    return null;
  }

  static async findById(id: string): Promise<User | null> {
    const db = admin.firestore();
    
    // Check passengers collection first
    const passengersRef = db.collection('passengers');
    const passengerDoc = await passengersRef.doc(id).get();
    
    if (passengerDoc.exists) {
      const userData = passengerDoc.data();
      // Return user data without password
      const { password, ...userWithoutPassword } = userData!;
      return { ...userWithoutPassword, role: 'passenger' } as User;
    }

    // Check drivers collection
    const driversRef = db.collection('drivers');
    const driverDoc = await driversRef.doc(id).get();
    
    if (driverDoc.exists) {
      const userData = driverDoc.data();
      // Return user data without password
      const { password, ...userWithoutPassword } = userData!;
      return { ...userWithoutPassword, role: 'driver' } as User;
    }

    return null;
  }

  static async findByRole(role: 'passenger' | 'driver'): Promise<User[]> {
    const db = admin.firestore();
    const users: User[] = [];

    if (role === 'passenger') {
      const passengersRef = db.collection('passengers');
      const snapshot = await passengersRef.get();
      
      snapshot.forEach(doc => {
        const userData = doc.data();
        const { password, ...userWithoutPassword } = userData;
        users.push({ ...userWithoutPassword, role: 'passenger' } as User);
      });
    } else {
      const driversRef = db.collection('drivers');
      const snapshot = await driversRef.get();
      
      snapshot.forEach(doc => {
        const userData = doc.data();
        const { password, ...userWithoutPassword } = userData;
        users.push({ ...userWithoutPassword, role: 'driver' } as User);
      });
    }
    
    return users;
  }

  static async updatePassenger(id: string, data: Partial<Passenger>): Promise<Passenger | null> {
    const db = admin.firestore();
    const passengersRef = db.collection('passengers');
    const doc = await passengersRef.doc(id).get();
    
    if (!doc.exists) {
      return null;
    }

    const userData = doc.data();
    const updatedData = {
      ...userData,
      ...data,
      updatedAt: new Date()
    };

    await passengersRef.doc(id).update(updatedData);
    
    // Return updated user data without password
    const userWithoutPassword = { ...updatedData };
    delete (userWithoutPassword as any).password;
    return { ...userWithoutPassword, role: 'passenger', id } as Passenger;
  }

  static async updateDriver(id: string, data: Partial<Driver>): Promise<Driver | null> {
    const db = admin.firestore();
    const driversRef = db.collection('drivers');
    const doc = await driversRef.doc(id).get();
    
    if (!doc.exists) {
      return null;
    }

    const userData = doc.data();
    const updatedData = {
      ...userData,
      ...data,
      updatedAt: new Date()
    };

    await driversRef.doc(id).update(updatedData);
    
    // Return updated user data without password
    const userWithoutPassword = { ...updatedData };
    delete (userWithoutPassword as any).password;
    return { ...userWithoutPassword, role: 'driver', id } as Driver;
  }

  static async deleteById(id: string): Promise<boolean> {
    const db = admin.firestore();
    
    // Try to delete from passengers collection
    const passengersRef = db.collection('passengers');
    const passengerDoc = await passengersRef.doc(id).get();
    
    if (passengerDoc.exists) {
      await passengersRef.doc(id).delete();
      return true;
    }

    // Try to delete from drivers collection
    const driversRef = db.collection('drivers');
    const driverDoc = await driversRef.doc(id).get();
    
    if (driverDoc.exists) {
      await driversRef.doc(id).delete();
      return true;
    }

    return false;
  }

  static async getAllUsers(): Promise<User[]> {
    const db = admin.firestore();
    const users: User[] = [];

    // Get all passengers
    const passengersRef = db.collection('passengers');
    const passengerSnapshot = await passengersRef.get();
    
    passengerSnapshot.forEach(doc => {
      const userData = doc.data();
      const { password, ...userWithoutPassword } = userData;
      users.push({ ...userWithoutPassword, role: 'passenger', id: doc.id } as User);
    });

    // Get all drivers
    const driversRef = db.collection('drivers');
    const driverSnapshot = await driversRef.get();
    
    driverSnapshot.forEach(doc => {
      const userData = doc.data();
      const { password, ...userWithoutPassword } = userData;
      users.push({ ...userWithoutPassword, role: 'driver', id: doc.id } as User);
    });
    
    return users;
  }

  static async getPassengerById(id: string): Promise<Passenger | null> {
    const db = admin.firestore();
    const passengersRef = db.collection('passengers');
    const doc = await passengersRef.doc(id).get();
    
    if (!doc.exists) {
      return null;
    }

    const userData = doc.data();
    
    // Return user data without password
    const { password, ...userWithoutPassword } = userData!;
    return { ...userWithoutPassword, role: 'passenger', id } as Passenger;
  }

  static async getDriverById(id: string): Promise<Driver | null> {
    const db = admin.firestore();
    const driversRef = db.collection('drivers');
    const doc = await driversRef.doc(id).get();
    
    if (!doc.exists) {
      return null;
    }

    const userData = doc.data();
    
    // Return user data without password
    const { password, ...userWithoutPassword } = userData!;
    return { ...userWithoutPassword, role: 'driver', id } as Driver;
  }
}