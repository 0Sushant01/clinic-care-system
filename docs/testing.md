# Automated Test Suite & Verification

## Running Tests

### Backend Unit Test Suite
```bash
cd backend
source venv/bin/activate
python manage.py test apps.appointments
```

### Test Coverage Highlights
- `test_receptionist_cannot_complete_appointment_returns_403`: Verifies receptionist `/complete/` guard.
- `test_therapist_can_complete_own_appointment`: Verifies therapist completed session flow.
- `test_therapist_cannot_complete_another_therapists_appointment_returns_403`: Verifies therapist ownership isolation.
- `test_admin_can_complete_any_appointment`: Verifies admin authorization.
- `test_overlapping_appointments_returns_409_conflict`: Verifies time slot double-booking prevention (`HTTP 409 Conflict`).
- `test_sequential_appointments_succeed`: Verifies `09:00-10:00` followed by `10:00-11:00` succeeds.
- `test_cancelled_appointments_do_not_block_booking`: Verifies cancelled slots can be re-booked.
- `test_updating_appointment_excludes_self_from_overlap`: Verifies self-exclusion during appointment updates.

### Frontend Build Verification
```bash
cd frontend
npm run build
```
