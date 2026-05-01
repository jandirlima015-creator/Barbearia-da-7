# Security Specification - BarberHouse

## Data Invariants
1. A user can only access their own profile (private data).
2. Customers can read available services and barbers.
3. Only admins can create/update/delete services and barbers.
4. Appointments must have a valid customerId (the logged-in user), barberId (exists), and serviceId (exists).
5. A customer can only read/update/cancel their own appointments.
6. A barber can read appointments assigned to them.
7. Appointments cannot be modified once set to 'completed' or 'cancelled' status (Terminal State Locking).
8. Every write must be validated for schema correctness and identity integrity.

## The Dirty Dozen Payloads (Rejections)
1. **Identity Spoofing**: Attempt to create an appointment with `customerId` of another user.
2. **Privilege Escalation**: Attempt to create a user profile with `role: 'admin'`.
3. **Ghost Update**: Attempt to update an appointment's `barberId` after it's been confirmed.
4. **Terminal Bypass**: Attempt to change a 'completed' appointment back to 'pending'.
5. **Orphan Write**: Create an appointment for a non-existent `serviceId`.
6. **Price Tampering**: Create an appointment with `totalPrice: 0` regardless of service price.
7. **Resource Poisoning**: Document ID with 2KB string.
8. **Shadow Field**: Adding `isPromoted: true` to a service.
9. **Timestamp Fraud**: Setting `createdAt` to a date in the past.
10. **Unauthorized Deletion**: Customer attempting to delete another user's appointment.
11. **PII Leak**: Unauthenticated user attempting to list all `users`.
12. **Status Skipping**: Transitioning from `pending` straight to `completed` without `confirmed`.

## Security Rules Plan
1. Default Deny.
2. `isValidId` and `isSignedIn` helpers.
3. `isOwner` and `isAdmin` helpers.
4. Specific match blocks for `users`, `services`, `barbers`, and `appointments`.
5. Terminal state logic for appointments.
