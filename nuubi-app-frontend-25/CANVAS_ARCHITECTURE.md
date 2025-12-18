# Nuubi Canvas Integration Architecture

## Integration Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Canvas LMS                                │
│                                                                   │
│  ┌──────────────────┐                                            │
│  │  Course Page     │                                            │
│  │  ┌────────────┐  │   LTI Launch Request                       │
│  │  │ Nuubi Link │──┼───────────────────┐                        │
│  │  └────────────┘  │                   │                        │
│  └──────────────────┘                   │                        │
└──────────────────────────────────────────┼────────────────────────┘
                                          │
                                          ▼
                    ┌──────────────────────────────────────┐
                    │    Nuubi Frontend (React Native)     │
                    │    https://www.nuubi.app/lti-login   │
                    │                                       │
                    │  ┌─────────────────────────────────┐ │
                    │  │  LtiLoginScreen.js              │ │
                    │  │  - Extracts LTI token           │ │
                    │  │  - Sends to backend API         │ │
                    │  └─────────────────────────────────┘ │
                    └──────────────────┬───────────────────┘
                                      │
                                      │ POST /lti/session
                                      │ with id_token
                                      ▼
                    ┌──────────────────────────────────────┐
                    │     Nuubi Backend API                │
                    │ https://coral-app-n96bn...app        │
                    │                                       │
                    │  ┌─────────────────────────────────┐ │
                    │  │  /lti/login (OIDC Init)         │ │
                    │  │  /lti/session (Validate)        │ │
                    │  │  /lti/jwks (Public Keys)        │ │
                    │  └─────────────────────────────────┘ │
                    │                                       │
                    │  - Validates LTI token               │
                    │  - Creates/authenticates user        │
                    │  - Creates course group              │
                    │  - Returns JWT token                 │
                    └──────────────────┬───────────────────┘
                                      │
                                      │ Returns:
                                      │ - JWT token
                                      │ - Group ID
                                      │ - User info
                                      ▼
                    ┌──────────────────────────────────────┐
                    │    Nuubi Frontend                     │
                    │                                       │
                    │  - Store JWT in sessionStorage       │
                    │  - Connect Socket.io                 │
                    │  - Navigate to Group Tabs            │
                    │  - User can now use Nuubi!           │
                    └──────────────────────────────────────┘
```

## LTI 1.3 Authentication Flow (Recommended)

```
┌─────────┐                ┌─────────┐               ┌─────────┐
│ Canvas  │                │  Nuubi  │               │  Nuubi  │
│   LMS   │                │ Frontend│               │ Backend │
└────┬────┘                └────┬────┘               └────┬────┘
     │                          │                         │
     │  1. User clicks Nuubi    │                         │
     │─────────────────────────>│                         │
     │                          │                         │
     │  2. Initiate OIDC Login  │                         │
     │                          │──────────────────────> │
     │                          │  GET /lti/login        │
     │                          │                         │
     │  3. OIDC Auth Request   │                         │
     │<─────────────────────────│<─────────────────────────┤
     │                          │                         │
     │  4. User authorizes      │                         │
     │                          │                         │
     │  5. LTI Launch with     │                         │
     │     id_token             │                         │
     │─────────────────────────>│                         │
     │  Redirect to             │                         │
     │  /lti-login?token=...    │                         │
     │                          │                         │
     │                          │  6. Validate token      │
     │                          │──────────────────────> │
     │                          │  POST /lti/session     │
     │                          │  {id_token: ...}       │
     │                          │                         │
     │                          │  7. User & group data   │
     │                          │<─────────────────────────┤
     │                          │  {jwt, groupId, ...}   │
     │                          │                         │
     │                          │  8. Connect Socket.io   │
     │                          │──────────────────────> │
     │                          │  auth: {token: jwt}    │
     │                          │                         │
     │                          │  9. Navigate to app     │
     │                          │     User logged in!     │
     │                          │                         │
```

## LTI 1.1 Authentication Flow (Legacy)

```
┌─────────┐                ┌─────────┐               ┌─────────┐
│ Canvas  │                │  Nuubi  │               │  Nuubi  │
│   LMS   │                │ Frontend│               │ Backend │
└────┬────┘                └────┬────┘               └────┬────┘
     │                          │                         │
     │  1. User clicks Nuubi    │                         │
     │─────────────────────────>│                         │
     │  POST /lti-login          │                         │
     │  oauth_signature=...     │                         │
     │  user_id=...             │                         │
     │  context_id=...          │                         │
     │                          │                         │
     │                          │  2. Validate OAuth sig  │
     │                          │──────────────────────> │
     │                          │  Forward LTI params    │
     │                          │                         │
     │                          │  3. Create/auth user    │
     │                          │<─────────────────────────┤
     │                          │  {jwt, groupId, ...}   │
     │                          │                         │
     │                          │  4. User logged in!     │
     │                          │                         │
```

## Data Flow

### Information Received from Canvas

**LTI 1.3:**
- `iss` - Canvas instance URL
- `sub` - User ID
- `name` - User's full name
- `email` - User's email address
- `context.id` - Course ID
- `context.title` - Course name
- `roles` - User's role (Student, Instructor, etc.)

**LTI 1.1:**
- `user_id` - User ID
- `lis_person_name_full` - User's full name
- `lis_person_contact_email_primary` - User's email
- `context_id` - Course ID
- `context_title` - Course name
- `roles` - User's role

### Information Sent to Nuubi Backend

```json
{
  "id_token": "eyJhbGc...",  // LTI token (1.3) or OAuth signed params (1.1)
  "user_id": "123",
  "context_id": "456",
  "name": "John Doe",
  "email": "john@university.edu",
  "course_name": "Introduction to Computer Science"
}
```

### Response from Nuubi Backend

```json
{
  "success": true,
  "jwt": "eyJhbGc...",      // Nuubi JWT token
  "email": "john@university.edu",
  "groupId": "789",         // Course group ID
  "groupName": "Introduction to Computer Science",
  "invitePasscode": "ABC123",
  "loggedIn": true
}
```

## Configuration Files

### LTI 1.3 Configuration (canvas-lti-1.3-config.json)

**Key Properties:**
- `target_link_uri` - Where Canvas sends the user
- `oidc_initiation_url` - OIDC authentication endpoint
- `public_jwk_url` - Public key for token verification
- `scopes` - Permissions requested (grades, membership)
- `placements` - Where Nuubi appears in Canvas

### LTI 1.1 Configuration (canvas-lti-1.1-config.xml)

**Key Properties:**
- `launch_url` - Where Canvas sends the user
- `privacy_level` - Data sharing level (public)
- `course_navigation` - Appears in course menu
- `custom_fields` - Canvas variables passed to Nuubi

## Security Considerations

### LTI 1.3 Security Features
✅ OAuth 2.0 / OIDC authentication
✅ JWT token signing with public/private keys
✅ State and nonce validation
✅ HTTPS required
✅ Token expiration

### LTI 1.1 Security Features
✅ OAuth 1.0a signature validation
✅ Consumer key / shared secret
✅ Timestamp and nonce validation
✅ HTTPS required

### Nuubi Security Measures
✅ JWT tokens for session management
✅ HTTPS/TLS encryption
✅ FERPA compliance
✅ Secure storage of credentials
✅ Regular security audits
✅ Data encryption at rest

## Canvas Integration Placements

### Course Navigation
- Appears in left sidebar of Canvas course
- Always accessible to students
- Direct link to course group

### Link Selection (LTI 1.3 only)
- Allows embedding Nuubi content in:
  - Pages
  - Assignments
  - Modules
  - Discussions

### Editor Button (LTI 1.1 only)
- Appears in rich content editor toolbar
- Allows inserting Nuubi content

## Files Reference

| File | Purpose | Format |
|------|---------|--------|
| `canvas-lti-1.3-config.json` | LTI 1.3 configuration | JSON |
| `canvas-lti-1.1-config.xml` | LTI 1.1 configuration | XML |
| `CANVAS_INTEGRATION.md` | Complete installation guide | Markdown |
| `CANVAS_QUICKSTART.md` | Quick reference | Markdown |
| `CANVAS_APP_STORE_SUBMISSION.md` | App store submission template | Markdown |
| `components/LtiLoginScreen.js` | Frontend LTI handler | JavaScript |
| `vercel.json` | Frontend routing config | JSON |

## Support Resources

- **Installation:** CANVAS_INTEGRATION.md
- **Quick Start:** CANVAS_QUICKSTART.md
- **Submission:** CANVAS_APP_STORE_SUBMISSION.md
- **Email:** support@nuubi.app
- **Website:** https://nuubi.app
