# Association Request System - How It Works

## Overview
The association request system allows caregivers to request to associate with patients. The patient must accept the request before the association is created.

## User Roles
- **Patient** (Role ID: 1) - Can receive and accept/reject association requests
- **Caregiver** (Role ID: 2) - Can send association requests to patients

---

## Complete Workflow

### Step 1: Caregiver Sends Association Request

**Who:** Caregiver (logged in user)

**Where:** Profile Page → Associated User Card section

**How:**
1. Navigate to your Profile page
2. Scroll to the "Associated User" card (right column)
3. Click "Send Association Request" button
4. Search for a patient by name or email
5. Select the patient from the dropdown
6. Click "Send Request"

**What Happens:**
- A new `AssociationRequest` record is created in the database
- Status: `Pending`
- The patient receives a notification (shown in their profile)

**API Call:**
```
POST /api/users/association-request
Body: {
  "requesterId": 2,  // Caregiver ID
  "requestedUserId": 1  // Patient ID
}
```

---

### Step 2: Patient Views Pending Requests

**Who:** Patient (logged in user)

**Where:** Profile Page → Associated User Card section

**What They See:**
- "Pending Requests" section appears
- Shows caregiver name and email
- Shows "Pending" status badge
- Two buttons: "Accept" and "Reject"

**API Call:**
```
GET /api/users/{userId}/association-requests/pending
```

---

### Step 3: Patient Accepts or Rejects Request

#### Option A: Patient Accepts Request

**Action:** Click "Accept" button

**What Happens:**
1. Association request status changes to `Accepted`
2. `ResponseDate` is set to current date/time
3. **Automatic association is created:**
   - Caregiver's `AssociatedUserId` is set to Patient's ID
   - Association is now active
4. Both users can now see each other in their profiles

**API Call:**
```
PUT /api/users/association-request/{requestId}/accept
Body: { userId }  // Patient's ID
```

**Result:**
- Caregiver and Patient are now associated
- Both can see each other's information
- Association request is marked as "Accepted"

#### Option B: Patient Rejects Request

**Action:** Click "Reject" button

**What Happens:**
1. Association request status changes to `Rejected`
2. `ResponseDate` is set to current date/time
3. **No association is created**
4. Request is removed from pending list

**API Call:**
```
PUT /api/users/association-request/{requestId}/reject
Body: { userId }  // Patient's ID
```

**Result:**
- Request is rejected
- No association is created
- Caregiver can send a new request if needed

---

### Step 4: Viewing Association Status

#### For Caregiver:
- **Sent Requests Section:** Shows all requests they've sent with "Pending" status
- **Associated User Section:** Shows the patient if request was accepted

#### For Patient:
- **Pending Requests Section:** Shows requests waiting for their response
- **Associated User Section:** Shows the caregiver if request was accepted

---

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CAREGIVER                            │
│                                                              │
│  1. Go to Profile Page                                      │
│  2. Click "Send Association Request"                        │
│  3. Search and Select Patient                               │
│  4. Click "Send Request"                                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Status: PENDING REQUEST SENT                          │ │
│  │ Shows in "Sent Requests" section                      │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Request Created
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        PATIENT                               │
│                                                              │
│  1. Go to Profile Page                                      │
│  2. See "Pending Requests" section                          │
│  3. View Caregiver details                                  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  [Accept Button]  [Reject Button]                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  IF ACCEPTED:                                        │ │
│  │  → Association Created                               │ │
│  │  → Both users can see each other                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  IF REJECTED:                                        │ │
│  │  → No Association Created                           │ │
│  │  → Request marked as Rejected                       │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Database States

### AssociationRequest Table States:

| Status | Description | Association Created? |
|--------|-------------|----------------------|
| `Pending` | Request sent, waiting for response | ❌ No |
| `Accepted` | Patient accepted the request | ✅ Yes |
| `Rejected` | Patient rejected the request | ❌ No |

### Users Table (After Acceptance):

**Caregiver Record:**
```sql
AssociatedUserId = Patient's UserID
```

**Patient Record:**
```sql
AssociatedUserId = NULL (or existing association)
```

---

## Example Scenarios

### Scenario 1: Successful Association

1. **Jane Smith** (Caregiver, ID: 5) wants to care for **John** (Patient, ID: 3)
2. Jane goes to her profile → Clicks "Send Association Request"
3. Searches for "John" → Selects John (ID: 3)
4. Clicks "Send Request"
5. **Request Created:** `RequesterID=5, RequestedUserID=3, Status=Pending`
6. **John** logs in and sees pending request from Jane Smith
7. John clicks "Accept"
8. **Request Updated:** `Status=Accepted, ResponseDate=2025-01-XX`
9. **Association Created:** Jane Smith's `AssociatedUserId = 3`
10. Both can now see each other in their profiles

### Scenario 2: Rejected Request

1. **Nurse Jane** (Caregiver, ID: 7) sends request to **Mary** (Patient, ID: 4)
2. Mary sees the request but doesn't want this caregiver
3. Mary clicks "Reject"
4. **Request Updated:** `Status=Rejected, ResponseDate=2025-01-XX`
5. **No Association Created**
6. Nurse Jane can see the request was rejected in her "Sent Requests"

---

## API Endpoints Reference

### 1. Create Association Request
```
POST /api/users/association-request
Body: {
  "requesterId": int,
  "requestedUserId": int
}
Response: {
  "success": true,
  "message": "Association request created successfully.",
  "request": { ... }
}
```

### 2. Get Pending Requests (Received)
```
GET /api/users/{userId}/association-requests/pending
Response: [
  {
    "requestId": 1,
    "requesterId": 5,
    "requesterName": "Dr. Smith",
    "requesterEmail": "dr.smith@example.com",
    "status": "Pending",
    "requestDate": "2025-01-XX"
  }
]
```

### 3. Get Sent Requests
```
GET /api/users/{userId}/association-requests/sent
Response: [
  {
    "requestId": 1,
    "requestedUserId": 3,
    "requestedUserName": "John Doe",
    "requestedUserEmail": "john@example.com",
    "status": "Pending",
    "requestDate": "2025-01-XX"
  }
]
```

### 4. Accept Request
```
PUT /api/users/association-request/{requestId}/accept
Body: userId (int)
Response: {
  "success": true,
  "message": "Association request accepted and association created successfully.",
  "request": { ... },
  "caregiver": { ... },
  "patient": { ... }
}
```

### 5. Reject Request
```
PUT /api/users/association-request/{requestId}/reject
Body: userId (int)
Response: {
  "success": true,
  "message": "Association request rejected successfully.",
  "request": { ... }
}
```

---

## Frontend Components

### AssociatedUserCard Component
- Shows pending requests received
- Shows sent requests
- Allows sending new requests (for caregivers)
- Shows current association if exists
- Handles accept/reject actions

### UserSearchSelect Component
- Searchable dropdown for finding users
- Filters by role (Patient for caregivers, Caregiver for patients)
- Excludes current user from results

---

## Important Notes

1. **Only Caregivers can initiate requests** - Patients cannot send requests
2. **Only one pending request** can exist between the same requester and requested user
3. **Association is created automatically** when patient accepts
4. **Rejected requests** don't prevent sending new requests
5. **Status tracking** - Both users can see the status of their requests

---

## Troubleshooting

### Issue: "A pending association request already exists"
- **Solution:** Wait for the existing request to be accepted/rejected, or the requester can cancel it

### Issue: "You are not authorized to accept this request"
- **Solution:** Make sure you're logged in as the patient who received the request

### Issue: Request not showing in pending list
- **Solution:** Check that you're viewing the profile of the user who should receive the request

---

## Security Features

- ✅ Only the requested user can accept/reject requests
- ✅ Users cannot send requests to themselves
- ✅ Duplicate pending requests are prevented
- ✅ Foreign key constraints ensure data integrity
- ✅ Soft delete support (IsDelete flag)

