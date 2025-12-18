# Nuubi Canvas Integration Guide

## Overview

Nuubi is a social learning platform that helps students build study communities and track their academic progress through gamification and collaborative tools. This guide explains how to integrate Nuubi with Canvas LMS.

## Integration Options

Nuubi supports two integration methods:

1. **LTI 1.3 (Recommended)** - Modern, secure integration with enhanced features
2. **LTI 1.1** - Legacy integration for older Canvas instances

---

## Option 1: LTI 1.3 Integration (Recommended)

### Prerequisites
- Canvas Admin access
- Access to Developer Keys in Canvas Admin

### Installation Steps

#### Step 1: Create Developer Key

1. Navigate to **Admin** > **Developer Keys**
2. Click **+ Developer Key** > **+ LTI Key**
3. Select **Method: Paste JSON**
4. Copy the contents of `canvas-lti-1.3-config.json` (available at [GitHub](https://github.com/nuubiapp/nuubi-app-frontend-25/blob/main/canvas-lti-1.3-config.json))
5. Paste the JSON configuration
6. Click **Save**
7. Enable the Developer Key (toggle to "On")
8. **Important:** Copy the Client ID - you'll need this for the backend configuration

#### Step 2: Backend Configuration

Contact Nuubi support at support@nuubi.app with:
- Your Canvas instance URL (e.g., `canvas.youruniversity.edu`)
- The Client ID from Step 1
- Your institution name

The Nuubi team will configure the backend to accept LTI launches from your Canvas instance.

#### Step 3: Install App in Course

1. Navigate to your Canvas course
2. Go to **Settings** > **Apps** > **View App Configurations**
3. Click **+ App**
4. For **Configuration Type**, select **By Client ID**
5. Enter the Client ID from Step 1
6. Click **Submit**
7. Nuubi will now appear in your course navigation

---

## Option 2: LTI 1.1 Integration (Legacy)

### Prerequisites
- Canvas Admin or Teacher access
- Consumer Key and Shared Secret from Nuubi

### Get Credentials

Contact Nuubi support at support@nuubi.app to request:
- Consumer Key
- Shared Secret

### Installation Steps

#### Install as External App

1. Navigate to your Canvas course
2. Go to **Settings** > **Apps** > **View App Configurations**
3. Click **+ App**
4. Fill in the following:
   - **Configuration Type:** Paste XML
   - **Name:** Nuubi
   - **Consumer Key:** (provided by Nuubi support)
   - **Shared Secret:** (provided by Nuubi support)
5. Copy the contents of `canvas-lti-1.1-config.xml` (available at [GitHub](https://github.com/nuubiapp/nuubi-app-frontend-25/blob/main/canvas-lti-1.1-config.xml))
6. Paste into the **XML Configuration** field
7. Click **Submit**
8. Nuubi will now appear in your course navigation

---

## Configuration Files

### LTI 1.3 JSON Configuration
The complete LTI 1.3 configuration is available in: `canvas-lti-1.3-config.json`

**Key Features:**
- Course navigation placement
- Link selection for embedding content
- Access to course and user information
- Support for Assignment and Grade Services (AGS)
- Support for Names and Role Provisioning Services (NRPS)

### LTI 1.1 XML Configuration
The complete LTI 1.1 configuration is available in: `canvas-lti-1.1-config.xml`

**Key Features:**
- Course navigation
- Editor button for content embedding
- Access to course and user information

---

## Technical Details

### Launch URL
```
https://www.nuubi.app/lti-login
```

### OIDC Initiation URL (LTI 1.3 only)
```
https://coral-app-n96bn.ondigitalocean.app/lti/login
```

### Public JWK URL (LTI 1.3 only)
```
https://coral-app-n96bn.ondigitalocean.app/lti/jwks
```

### Domain
```
nuubi.app
```

### Privacy Level
Public - Nuubi receives the user's name, email, and course information to provide personalized learning experiences.

### Custom Fields
The integration passes the following Canvas variables:
- Course ID
- User ID
- User Login ID
- Course Name
- User's Full Name
- User's Email

---

## Placements

### Course Navigation
Nuubi appears in the course navigation menu, allowing students to access their study groups and learning progress directly from Canvas.

### Link Selection (LTI 1.3 only)
Instructors can embed Nuubi content in pages, assignments, and modules using the content selector.

### Editor Button (LTI 1.1 only)
Instructors can insert Nuubi content using the editor toolbar.

---

## Support

### Getting Help
- Email: support@nuubi.app
- Documentation: https://nuubi.app/help

### Known Issues
- First-time users will need to create a Nuubi account or sign in
- Students are automatically added to course-specific study groups
- Ensure pop-ups are enabled in your browser for the best experience

### Updates
Canvas administrators should check periodically for configuration updates at:
https://github.com/nuubiapp/nuubi-app-frontend-25

---

## Troubleshooting

### "Unable to launch external tool"
- Verify the Developer Key is enabled
- Confirm the Client ID is correct
- Check that your Canvas instance URL is registered with Nuubi support

### "Authentication failed"
- For LTI 1.1: Verify Consumer Key and Shared Secret are correct
- For LTI 1.3: Ensure the Developer Key is enabled and the Client ID matches

### Nuubi doesn't appear in course navigation
- Verify the app is installed in the course settings
- Check that course navigation is enabled in the placement settings
- Refresh your browser

### Students see error on first launch
- This is normal - students need to authorize Nuubi to access their Canvas information
- Have them accept the permissions prompt
- If the issue persists, contact Nuubi support

---

## Privacy and Data Usage

Nuubi collects:
- User name and email for account creation
- Course name and ID for group organization
- Learning activity data for progress tracking

All data is handled according to Nuubi's Privacy Policy and FERPA compliance standards.

For detailed privacy information, visit: https://nuubi.app/privacy

---

## Version History

- **v1.0** (December 2025) - Initial Canvas integration
  - LTI 1.3 support with course navigation
  - LTI 1.1 legacy support
  - Custom fields for Canvas data

---

## Contact Information

**Nuubi Support Team**
- Email: support@nuubi.app
- Website: https://nuubi.app
- GitHub: https://github.com/nuubiapp/nuubi-app-frontend-25
