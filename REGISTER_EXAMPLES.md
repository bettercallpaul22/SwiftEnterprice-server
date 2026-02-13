# Switch Server Registration Examples

This document provides correct JSON examples for registering passengers and drivers.

## Passenger Registration

**Endpoint:** `POST /api/auth/register/passenger`

### Example Request

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

### Working Example (Tested)

```json
{
  "email": "test.passenger@example.com",
  "password": "TestPass123",
  "firstName": "Test",
  "lastName": "Passenger",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "role": "passenger",
  "preferredPaymentMethod": "card",
  "emergencyContact": {
    "name": "Emergency Contact",
    "phoneNumber": "+1234567891",
    "relationship": "Friend"
  },
  "profilePicture": "https://example.com/profile.jpg"
}
```

### Required Fields
- `email` - Valid email format
- `password` - Minimum 8 characters, must contain uppercase, lowercase, and number
- `firstName` - Minimum 2 characters
- `lastName` - Minimum 2 characters
- `phoneNumber` - Valid phone number format
- `dateOfBirth` - Date in YYYY-MM-DD format
- `role` - Must be "passenger"

### Optional Fields
- `preferredPaymentMethod` - "cash", "card", or "wallet"
- `emergencyContact` - Object with name, phoneNumber, and relationship
- `profilePicture` - Valid URL

---

## Driver Registration

**Endpoint:** `POST /api/auth/register/driver`

### Example Request

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

### Required Fields
- `email` - Valid email format
- `password` - Minimum 8 characters, must contain uppercase, lowercase, and number
- `firstName` - Minimum 2 characters
- `lastName` - Minimum 2 characters
- `phoneNumber` - Valid phone number format
- `dateOfBirth` - Date in YYYY-MM-DD format
- `role` - Must be "driver"
- `licenseNumber` - Minimum 5 characters
- `licenseExpiryDate` - Date in YYYY-MM-DD format
- `vehicleDetails` - Complete object with all required fields
- `documents` - Complete object with all required document URLs

### Optional Fields
- `bankDetails` - Bank account information
- `profilePicture` - Valid URL

---

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

### Date Format
- Use YYYY-MM-DD format (e.g., "1990-05-15")

### Phone Number Format
- Supports international format
- Minimum 10 digits
- Can include spaces, dashes, and parentheses

### Vehicle Year
- Must be 1990 or later
- Cannot be in the future

### Bank Account Number
- Minimum 10 digits

### License Plate Format
- Alphanumeric characters, spaces, and dashes
- Maximum 8 characters

---

## Common Errors

### Password Validation
```json
{
  "success": false,
  "message": "Registration failed",
  "error": [
    {
      "code": "too_small",
      "minimum": 8,
      "message": "Password must be at least 8 characters"
    },
    {
      "code": "invalid_format",
      "message": "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }
  ]
}
```

### Date Validation
```json
{
  "success": false,
  "message": "Registration failed",
  "error": [
    {
      "code": "invalid_type",
      "message": "Invalid input: expected date, received string"
    }
  ]
}
```

### Email Already Exists
```json
{
  "success": false,
  "message": "User with this email already exists"
}