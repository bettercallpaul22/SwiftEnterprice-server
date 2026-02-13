# Switch Server Authentication API Guide

This guide provides comprehensive documentation for the authentication endpoints in the Switch server.

## Base URL

```
http://localhost:3000/api/auth
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Register Passenger

**POST** `/register/passenger`

Register a new passenger account.

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-05-15",
  "role": "passenger",
  "preferredPaymentMethod": "card",
  "emergencyContact": {
    "name": "Jane Doe",
    "phoneNumber": "+1234567891",
    "relationship": "Spouse"
  },
  "profilePicture": "https://example.com/profile.jpg"
}
```

#### Response (Success)

```json
{
  "success": true,
  "message": "Passenger registered successfully",
  "data": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-05-15T00:00:00.000Z",
    "role": "passenger",
    "preferredPaymentMethod": "card",
    "emergencyContact": {
      "name": "Jane Doe",
      "phoneNumber": "+1234567891",
      "relationship": "Spouse"
    },
    "profilePicture": "https://example.com/profile.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### Response (Error)

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 2. Register Driver

**POST** `/register/driver`

Register a new driver account.

#### Request Body

```json
{
  "email": "jane.driver@example.com",
  "password": "SecurePass123",
  "firstName": "Jane",
  "lastName": "Driver",
  "phoneNumber": "+1234567892",
  "dateOfBirth": "1985-03-20",
  "role": "driver",
  "licenseNumber": "DL123456789",
  "licenseExpiryDate": "2025-12-31",
  "vehicleDetails": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "color": "Silver",
    "licensePlate": "ABC-1234",
    "insuranceNumber": "INS987654321",
    "insuranceExpiryDate": "2024-06-30"
  },
  "bankDetails": {
    "accountNumber": "1234567890",
    "bankName": "Example Bank",
    "accountName": "Jane Driver"
  },
  "documents": {
    "driverLicense": "https://example.com/driver-license.jpg",
    "vehicleRegistration": "https://example.com/vehicle-reg.jpg",
    "insuranceCertificate": "https://example.com/insurance.jpg",
    "backgroundCheck": "https://example.com/background-check.jpg"
  },
  "profilePicture": "https://example.com/profile.jpg"
}
```

#### Response (Success)

```json
{
  "success": true,
  "message": "Driver registered successfully",
  "data": {
    "id": "uuid-here",
    "email": "jane.driver@example.com",
    "firstName": "Jane",
    "lastName": "Driver",
    "phoneNumber": "+1234567892",
    "dateOfBirth": "1985-03-20T00:00:00.000Z",
    "role": "driver",
    "licenseNumber": "DL123456789",
    "licenseExpiryDate": "2025-12-31T00:00:00.000Z",
    "vehicleDetails": {
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "color": "Silver",
      "licensePlate": "ABC-1234",
      "insuranceNumber": "INS987654321",
      "insuranceExpiryDate": "2024-06-30T00:00:00.000Z"
    },
    "bankDetails": {
      "accountNumber": "1234567890",
      "bankName": "Example Bank",
      "accountName": "Jane Driver"
    },
    "documents": {
      "driverLicense": "https://example.com/driver-license.jpg",
      "vehicleRegistration": "https://example.com/vehicle-reg.jpg",
      "insuranceCertificate": "https://example.com/insurance.jpg",
      "backgroundCheck": "https://example.com/background-check.jpg"
    },
    "profilePicture": "https://example.com/profile.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 3. Login

**POST** `/login`

Authenticate a user and receive a JWT token.

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "role": "passenger"
}
```

#### Response (Success)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "dateOfBirth": "1990-05-15T00:00:00.000Z",
      "role": "passenger",
      "preferredPaymentMethod": "card",
      "emergencyContact": {
        "name": "Jane Doe",
        "phoneNumber": "+1234567891",
        "relationship": "Spouse"
      },
      "profilePicture": "https://example.com/profile.jpg",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Response (Error)

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 4. Get Profile

**GET** `/profile`

Get the current authenticated user's profile.

#### Response (Success)

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-05-15T00:00:00.000Z",
    "role": "passenger",
    "preferredPaymentMethod": "card",
    "emergencyContact": {
      "name": "Jane Doe",
      "phoneNumber": "+1234567891",
      "relationship": "Spouse"
    },
    "profilePicture": "https://example.com/profile.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### Response (Error)

```json
{
  "success": false,
  "message": "Authentication failed"
}
```

### 5. Update Passenger Profile

**PUT** `/profile/passenger/:id`

Update a passenger's profile information.

#### Request Body

```json
{
  "firstName": "John Updated",
  "preferredPaymentMethod": "wallet",
  "emergencyContact": {
    "name": "Jane Doe Updated",
    "phoneNumber": "+1234567899",
    "relationship": "Partner"
  }
}
```

#### Response (Success)

```json
{
  "success": true,
  "message": "Passenger profile updated successfully",
  "data": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "firstName": "John Updated",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "1990-05-15T00:00:00.000Z",
    "role": "passenger",
    "preferredPaymentMethod": "wallet",
    "emergencyContact": {
      "name": "Jane Doe Updated",
      "phoneNumber": "+1234567899",
      "relationship": "Partner"
    },
    "profilePicture": "https://example.com/profile.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-02T12:00:00.000Z"
  }
}
```

### 6. Update Driver Profile

**PUT** `/profile/driver/:id`

Update a driver's profile information.

#### Request Body

```json
{
  "firstName": "Jane Updated",
  "vehicleDetails": {
    "make": "Honda",
    "model": "Accord",
    "year": 2021
  },
  "bankDetails": {
    "accountNumber": "0987654321",
    "bankName": "Updated Bank"
  }
}
```

#### Response (Success)

```json
{
  "success": true,
  "message": "Driver profile updated successfully",
  "data": {
    "id": "uuid-here",
    "email": "jane.driver@example.com",
    "firstName": "Jane Updated",
    "lastName": "Driver",
    "phoneNumber": "+1234567892",
    "dateOfBirth": "1985-03-20T00:00:00.000Z",
    "role": "driver",
    "licenseNumber": "DL123456789",
    "licenseExpiryDate": "2025-12-31T00:00:00.000Z",
    "vehicleDetails": {
      "make": "Honda",
      "model": "Accord",
      "year": 2021,
      "color": "Silver",
      "licensePlate": "ABC-1234",
      "insuranceNumber": "INS987654321",
      "insuranceExpiryDate": "2024-06-30T00:00:00.000Z"
    },
    "bankDetails": {
      "accountNumber": "0987654321",
      "bankName": "Updated Bank",
      "accountName": "Jane Driver"
    },
    "documents": {
      "driverLicense": "https://example.com/driver-license.jpg",
      "vehicleRegistration": "https://example.com/vehicle-reg.jpg",
      "insuranceCertificate": "https://example.com/insurance.jpg",
      "backgroundCheck": "https://example.com/background-check.jpg"
    },
    "profilePicture": "https://example.com/profile.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-02T12:00:00.000Z"
  }
}
```

### 7. Logout

**POST** `/logout`

Logout the current user (client-side token removal).

#### Response

```json
{
  "success": true,
  "message": "Logout successful"
}
```

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Email Format
- Must be a valid email address

### Phone Number Format
- Supports international format
- Minimum 10 digits
- Can include spaces, dashes, and parentheses

### Date of Birth
- User must be between 18 and 100 years old

### License Plate Format
- Alphanumeric characters, spaces, and dashes
- Maximum 8 characters

### Driver License Number
- Minimum 5 characters

### Bank Account Number
- Minimum 10 digits

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    // Optional detailed error information
  }
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication failed)
- `403` - Forbidden (access denied)
- `404` - Not Found
- `409` - Conflict (email already exists)

## Security Notes

1. Passwords are hashed using bcrypt before storage
2. JWT tokens expire after 7 days by default
3. All sensitive data (passwords) is excluded from API responses
4. Use HTTPS in production environments
5. Store JWT tokens securely on the client side