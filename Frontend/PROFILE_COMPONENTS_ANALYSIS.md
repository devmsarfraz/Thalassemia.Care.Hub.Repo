# Profile Page Components Analysis & Design

## Design Analysis

Based on the provided image, the profile page has a **two-column layout**:

### Layout Structure:
- **Left Column (Sidebar)**: 
  - User Profile Summary Card
  - Collapsible Change Password Section
  
- **Right Column (Main Content)**:
  - Edit Profile Form Card
  - Change Password Form Card

### Design Elements:
- Clean white cards on light grey background
- Modern rounded corners
- Profile picture with circular avatar
- Collapsible sections with chevron icons
- Red "Save" button and white "Cancel" button
- Blue "Submit" button for password change
- Blue "Edit Profile" button

---

## Required Components List (8 Components)

### 1. **ProfileLayout Component**
   - **Purpose**: Main container with two-column layout
   - **Props**: `children` (left sidebar content, right main content)
   - **Features**: 
     - Responsive grid layout (left: 3-4 columns, right: 8-9 columns)
     - Mobile responsive (stacks vertically on small screens)
   - **Location**: `src/components/profile/ProfileLayout.jsx`

### 2. **UserProfileSummary Component**
   - **Purpose**: Left sidebar card showing user summary
   - **Props**: 
     - `user` (user object with profile data)
     - `onEditClick` (callback to trigger edit mode)
   - **Features**:
     - Circular profile picture (with fallback to initials)
     - User full name display
     - Role badge
     - Email display
     - Phone number display
     - "Edit Profile" button
   - **Location**: `src/components/profile/UserProfileSummary.jsx`

### 3. **EditProfileForm Component**
   - **Purpose**: Main form for editing user profile information
   - **Props**:
     - `user` (current user data)
     - `onSubmit` (callback when form is submitted)
     - `onCancel` (callback when cancel is clicked)
     - `isLoading` (loading state)
   - **Fields** (based on UpdateUserRequest DTO):
     - Full Name (combined FirstName + LastName input or separate)
     - Gender (dropdown: Male, Female, Other)
     - Contact Number (phone input)
     - Email (read-only/disabled)
     - Address (text area)
     - Blood Group (dropdown: A+, A-, B+, B-, AB+, AB-, O+, O-)
     - Guardian Name (text input - optional)
     - Guardian Number (phone input - optional)
   - **Features**:
     - Form validation
     - Save and Cancel buttons
     - Loading states
   - **Location**: `src/components/profile/EditProfileForm.jsx`

### 4. **ChangePasswordForm Component**
   - **Purpose**: Form for changing user password
   - **Props**:
     - `onSubmit` (callback with password data)
     - `isLoading` (loading state)
     - `collapsible` (boolean - for left sidebar collapsed version)
   - **Fields**:
     - Old Password (password input with show/hide toggle)
     - New Password (password input with show/hide toggle)
     - Confirm Password (password input with show/hide toggle - frontend validation)
   - **Features**:
     - Password strength indicator (optional)
     - Show/hide password toggles
     - Form validation (match passwords, minimum length)
     - Submit button
   - **Location**: `src/components/profile/ChangePasswordForm.jsx`

### 5. **CollapsibleSection Component**
   - **Purpose**: Reusable collapsible/expandable section wrapper
   - **Props**:
     - `title` (section title)
     - `children` (content to show/hide)
     - `defaultExpanded` (boolean)
     - `onToggle` (optional callback)
   - **Features**:
     - Chevron icon (up/down based on state)
     - Smooth expand/collapse animation
     - Click header to toggle
   - **Location**: `src/components/profile/CollapsibleSection.jsx`

### 6. **AssociatedUserCard Component**
   - **Purpose**: Display and manage associated user (caregiver/patient relationship)
   - **Props**:
     - `associatedUser` (user object if associated)
     - `userRole` (current user's role)
     - `onAssociate` (callback to create association)
     - `onUpdate` (callback to update association)
     - `onRemove` (callback to remove association)
   - **Features**:
     - Display associated user info (if exists)
     - "Associate User" button/form (if not associated)
     - Search/select user dropdown (for association)
     - Update association option
     - Remove association option
     - Show relationship type (Caregiver ↔ Patient)
   - **Location**: `src/components/profile/AssociatedUserCard.jsx`

### 7. **UserSearchSelect Component**
   - **Purpose**: Search and select user for association
   - **Props**:
     - `onSelect` (callback when user is selected)
     - `excludeUserId` (user ID to exclude from results)
     - `filterRole` (optional role filter)
     - `placeholder` (search placeholder text)
   - **Features**:
     - Search input with debounce
     - Dropdown with user list
     - User display (name, email, role)
     - Loading state
   - **Location**: `src/components/profile/UserSearchSelect.jsx`

### 8. **FormField Component** (Reusable)
   - **Purpose**: Standardized form field wrapper
   - **Props**:
     - `label` (field label)
     - `type` (input type)
     - `name` (field name)
     - `value` (field value)
     - `onChange` (change handler)
     - `error` (error message)
     - `required` (boolean)
     - `disabled` (boolean)
     - `options` (for select/dropdown)
   - **Features**:
     - Consistent styling
     - Error display
     - Required indicator
   - **Location**: `src/components/profile/FormField.jsx`


---

## Backend API Endpoints Available

### User Profile APIs:
1. **GET** `/api/users/{id}` - Get user profile
2. **PUT** `/api/users/{id}` - Update user profile (UpdateUserRequest)
3. **POST** `/api/users/associate` - Associate caregiver with patient (AssociateUserRequest)
4. **POST** `/api/auth/update-password` - Update password (UpdatePassword)

### UpdateUserRequest Fields:
- FirstName (required)
- LastName (required)
- PhoneNumber (optional)
- Address (optional)
- BloodGroup (optional)
- Gender (optional)
- GuardianName (optional)
- GuardianNumber (optional)

### AssociateUserRequest Fields:
- CaregiverId (required)
- PatientId (required)

### UpdatePassword Fields:
- Email (required)
- CurrentPassword (required)
- NewPassword (required)

---

## Additional Features to Consider

### Missing from Current Backend (May Need Backend Updates):
1. **Get Associated User** - Need to check if UserProfileResponse includes AssociatedUser info

### Recommended Backend Enhancements:
1. Add `AssociatedUser` info to UserProfileResponse (if not already included)
2. Add endpoint to get associated user details (`GET /api/users/{id}/associated-user`)
3. Add endpoint to remove association (`DELETE /api/users/{id}/association`)

---

## Component Integration Plan

### Profile Page Structure:
```
Profile.jsx (Main Page)
├── ProfileLayout
    ├── Left Column:
    │   ├── UserProfileSummary
    │   └── CollapsibleSection
    │       └── ChangePasswordForm (collapsed version)
    │
    └── Right Column:
        ├── EditProfileForm
        │   ├── FormField components
        │   └── AssociatedUserCard
        └── ChangePasswordForm (full version)
```

---

## Design Specifications

### Colors:
- Primary Button: Red (#ef4444)
- Secondary Button: White with grey text
- Submit Button: Blue (#1e3a8a)
- Background: Light grey (#f8f9fa)
- Card Background: White (#ffffff)

### Spacing:
- Card padding: 24px
- Form field spacing: 16px vertical
- Button spacing: 12px horizontal

### Typography:
- Card titles: Bold, 20px
- Form labels: Medium, 14px
- Input text: Regular, 16px

---

## Implementation Priority

### Phase 1 (Core Components):
1. ProfileLayout
2. UserProfileSummary
3. EditProfileForm
4. ChangePasswordForm

### Phase 2 (Enhanced Features):
5. CollapsibleSection
6. AssociatedUserCard
7. UserSearchSelect

### Phase 3 (Polish):
8. FormField (reusable)

---

## Notes

- The image shows some inconsistencies (duplicate password sections, wrong data in fields) - these should be cleaned up in implementation
- Associated user functionality is available via `/api/users/associate` endpoint
- All form fields match the current UpdateUserRequest DTO structure

