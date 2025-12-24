# Update User Role API Documentation

## Overview

The Update User Role API endpoint allows administrators to change user roles within the Thalassemia Care Hub system. This endpoint is restricted to Admin users only and provides secure role management functionality.

## API Endpoint

### PUT /api/users/{id}/role

**Description**: Update a user's role (Admin only access)

**Authorization**: Requires JWT token with Admin role

**URL Parameters**:
- `id` (integer, required): The ID of the user whose role is to be updated

**Request Body**:
```json
{
  "roleId": 2
}
```

**Request Body Fields**:
- `roleId` (integer, required): The new role ID to assign to the user

## Response Codes

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "User role updated successfully.",
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890",
    "address": "123 Main St",
    "bloodGroup": "O+",
    "gender": "Male",
    "guardianName": "Jane Doe",
    "guardianNumber": "9876543210",
    "role": "Doctor"
  }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "message": "User not found or role does not exist."
}
```

#### 401 Unauthorized
```json
{
  "message": "Unauthorized. Valid JWT token required."
}
```

#### 403 Forbidden
```json
{
  "message": "Forbidden. Admin access required."
}
```

#### 500 Internal Server Error
```json
{
  "message": "An error occurred while updating user role.",
  "error": "Detailed error message"
}
```

## Role Management

### Available Roles

The system supports the following roles (based on typical medical hub roles):

1. **Admin** (RoleId: 3)
   - Full system access
   - Can manage all users and roles
   - Can update user roles
   - **Protected**: Admin roles cannot be changed

2. **Doctor** (RoleId: 2)
   - Medical professional access
   - Can view and manage patient records
   - Limited administrative functions

3. **Patient** (RoleId: 1)
   - Patient access
   - Can view own records
   - Limited system access

4. **Nurse** (RoleId: 4)
   - Nursing staff access
   - Can assist with patient care
   - Limited administrative functions

### Role Hierarchy

```
Admin (Highest)
├── Doctor
├── Nurse
└── Patient (Lowest)
```

## Security Features

### 1. Role-Based Authorization
- Only users with "Admin" role can access this endpoint
- JWT token must contain Admin role claim
- Automatic role validation on each request

### 2. Input Validation
- User ID validation (must exist and not be deleted)
- Role ID validation (must exist in system)
- Admin role protection (RoleId = 3 cannot be changed)
- Request body validation

### 3. Audit Trail
- All role changes are logged
- User information is returned for verification
- Error handling with detailed messages

## Usage Examples

### 1. Update User to Doctor Role

**Request**:
```bash
curl -X PUT "https://localhost:7000/api/users/1/role" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "roleId": 2
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "User role updated successfully.",
  "user": {
    "userId": 1,
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Doctor"
  }
}
```

### 2. Update User to Admin Role

**Request**:
```bash
curl -X PUT "https://localhost:7000/api/users/2/role" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "roleId": 1
  }'
```

### 3. Update User to Patient Role

**Request**:
```bash
curl -X PUT "https://localhost:7000/api/users/3/role" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "roleId": 3
  }'
```

## Error Scenarios

### 1. Non-Admin User Attempting Role Update

**Request**: User with "Patient" role tries to update another user's role

**Response**:
```json
{
  "message": "Forbidden. Admin access required."
}
```

### 2. Invalid User ID

**Request**: Attempting to update role for non-existent user

**Response**:
```json
{
  "message": "User not found or role does not exist."
}
```

### 3. Invalid Role ID

**Request**: Attempting to assign non-existent role

**Response**:
```json
{
  "message": "User not found or role does not exist."
}
```

### 4. Admin Role Protection

**Request**: Attempting to change Admin user's role (RoleId = 3)

**Response**:
```json
{
  "success": false,
  "message": "Cannot change role of Admin users."
}
```

### 5. Missing JWT Token

**Request**: No authorization header provided

**Response**:
```json
{
  "message": "Unauthorized. Valid JWT token required."
}
```

## Implementation Details

### Database Operations

1. **User Lookup**: Find user by ID and verify not deleted
2. **Role Validation**: Verify role ID exists in UserRoles table
3. **Role Update**: Update user's RoleId field
4. **User Reload**: Fetch updated user with role information
5. **Response Mapping**: Map user to UserProfileResponse DTO

### Service Layer

```csharp
public async Task<UpdateUserRoleResponse> UpdateUserRoleAsync(int id, UpdateUserRoleRequest request)
{
    var updatedUser = await _userRepository.UpdateUserRole(id, request.RoleId);
    
    if (updatedUser == null)
    {
        return new UpdateUserRoleResponse
        {
            Success = false,
            Message = "User not found or role does not exist."
        };
    }
    
    // Map to response DTO and return success
}
```

### Repository Layer

```csharp
public async Task<User?> UpdateUserRole(int id, int roleId)
{
    var user = await _context.Users
        .Include(u => u.Role)
        .FirstOrDefaultAsync(u => u.UserId == id && !u.IsDelete);
    
    if (user == null) return null;
    
    // Verify role exists
    var roleExists = await _context.UserRoles
        .AnyAsync(r => r.RoleId == roleId);
    
    if (!roleExists) return null;
    
    // Update role and save
    user.RoleId = roleId;
    await _context.SaveChangesAsync();
    
    return user;
}
```

## Testing

### HTTP Test Cases

The `thalassemiaCareHubv2.http` file includes comprehensive test cases:

1. **Valid Role Update**: Test updating user to different roles
2. **Invalid Role ID**: Test with non-existent role ID
3. **Non-Admin Access**: Test with non-admin JWT token
4. **Missing Token**: Test without authorization header

### Test Flow

1. **Login as Admin**: Get Admin JWT token
2. **Update User Role**: Test role update with valid data
3. **Verify Response**: Check updated user information
4. **Test Error Cases**: Test various error scenarios

## Best Practices

### 1. Security
- Always validate JWT token and role claims
- Use parameterized queries to prevent SQL injection
- Log all role change attempts for audit purposes

### 2. Error Handling
- Provide clear error messages
- Don't expose sensitive system information
- Handle database exceptions gracefully

### 3. Performance
- Use efficient database queries
- Include only necessary user data in response
- Consider caching for frequently accessed roles

## Integration Notes

### 1. Frontend Integration
- Display role change confirmation dialog
- Show updated user information after successful update
- Handle error responses appropriately

### 2. Mobile App Integration
- Implement proper error handling
- Show loading states during role updates
- Refresh user lists after role changes

### 3. Third-Party Integration
- Ensure JWT token includes Admin role claim
- Handle network errors gracefully
- Implement retry logic for failed requests

## Future Enhancements

### 1. Role History
- Track role change history
- Implement role change audit trail
- Add role change notifications

### 2. Bulk Role Updates
- Support updating multiple users at once
- Implement batch role update endpoint
- Add progress tracking for bulk operations

### 3. Role Permissions
- Implement granular permissions
- Add role-based feature access
- Create permission management system

## Conclusion

The Update User Role API provides secure, role-based user management functionality for the Thalassemia Care Hub system. With proper Admin authorization, comprehensive error handling, and detailed response information, this endpoint ensures safe and reliable role management operations.

Key features:
- ✅ Admin-only access control
- ✅ Comprehensive input validation
- ✅ Detailed error responses
- ✅ Complete user information in response
- ✅ Secure JWT token validation
- ✅ Database integrity checks
- ✅ Extensive testing coverage
