# Role & Permission Matrix

| Feature / Action | Administrator | Receptionist | Therapist |
| --- | --- | --- | --- |
| **Book Appointment** | ✅ | ✅ | ❌ |
| **Cancel Appointment** | ✅ | ✅ | ❌ |
| **Reschedule Appointment** | ✅ | ✅ | ❌ |
| **Complete Session & Clinical Note** | ✅ | ❌ (HTTP 403) | ✅ (Own Sessions Only) |
| **Generate AI Summary** | ✅ | ❌ (HTTP 403) | ✅ (Own Sessions Only) |
| **Patient Directory Access** | Full | Full Demographics | Scoped (Assigned / Created) |
| **Staff Account Management** | Full | ❌ (HTTP 403) | ❌ (HTTP 403) |
| **System Settings** | Full | ❌ (HTTP 403) | ❌ (HTTP 403) |
