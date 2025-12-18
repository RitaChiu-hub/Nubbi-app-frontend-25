# Nuubi - Social Learning Platform

Nuubi is a social learning platform that helps students build study communities and track their academic progress through gamification and collaborative tools.

## Features

- 🎓 **Study Groups** - Create and join study groups with classmates
- 📊 **Progress Tracking** - Monitor your learning journey with analytics
- 🏆 **Achievements & Badges** - Earn rewards for your accomplishments
- 💬 **Real-time Chat** - Communicate with group members
- 📝 **Collaborative Posts** - Share notes and resources
- 🎯 **Task Management** - Organize your study tasks

## Canvas LMS Integration

Nuubi integrates seamlessly with Canvas LMS using LTI (Learning Tools Interoperability).

### For Canvas Administrators

We provide two integration options:

1. **LTI 1.3 (Recommended)** - Modern, secure integration with enhanced features
2. **LTI 1.1** - Legacy integration for older Canvas instances

**Quick Start:**
- See [CANVAS_QUICKSTART.md](CANVAS_QUICKSTART.md) for quick installation steps
- See [CANVAS_INTEGRATION.md](CANVAS_INTEGRATION.md) for complete integration guide

**Configuration Files:**
- `canvas-lti-1.3-config.json` - LTI 1.3 JSON configuration
- `canvas-lti-1.1-config.xml` - LTI 1.1 XML configuration

### For Students

Once your instructor has installed Nuubi in Canvas:
1. Click on "Nuubi" in your course navigation
2. Sign in or create a free account
3. Start collaborating with your classmates!

## Technology Stack

- **Frontend:** React Native (Expo)
- **State Management:** React Context API
- **Navigation:** React Navigation
- **UI Components:** React Native Paper, React Native Elements
- **Real-time Communication:** Socket.io
- **Platform Support:** iOS, Android, Web

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

```bash
npm install
```

### Running the App

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

### Environment

The app connects to the Nuubi backend at `https://coral-app-n96bn.ondigitalocean.app`

## Project Structure

```
├── components/          # React components
│   ├── AccountContext.jsx   # User authentication context
│   ├── Views.jsx           # Main navigation structure
│   ├── LtiLoginScreen.js   # Canvas LTI integration
│   ├── Chat/              # Chat and messaging components
│   ├── Groups/            # Group management components
│   ├── Login/             # Authentication components
│   ├── UserSettings/      # User settings and profile
│   └── ...
├── assets/             # Images, icons, and static files
├── styles/             # Style definitions
├── canvas-lti-1.3-config.json  # Canvas LTI 1.3 configuration
├── canvas-lti-1.1-config.xml   # Canvas LTI 1.1 configuration
├── App.js              # Application entry point
└── package.json        # Project dependencies
```

## LTI Integration Details

### How It Works

1. User launches Nuubi from Canvas
2. Canvas sends an LTI launch request to Nuubi
3. Nuubi authenticates the user via LTI
4. User is automatically logged in and added to their course group
5. User can access all Nuubi features within their course context

### Technical Implementation

- **Launch URL:** `https://www.nuubi.app/lti-login`
- **OIDC Init URL:** `https://coral-app-n96bn.ondigitalocean.app/lti/login`
- **JWK URL:** `https://coral-app-n96bn.ondigitalocean.app/lti/jwks`

The LTI integration is handled by:
- `components/LtiLoginScreen.js` - Frontend LTI authentication handler
- Backend API at `https://coral-app-n96bn.ondigitalocean.app/lti/*`

## Support

- **Email:** support@nuubi.app
- **Website:** https://nuubi.app
- **Canvas Integration Help:** See [CANVAS_INTEGRATION.md](CANVAS_INTEGRATION.md)

## Privacy & Security

Nuubi is FERPA compliant and follows industry best practices for student data privacy.

- **Privacy Policy:** https://nuubi.app/privacy
- **Terms of Service:** https://nuubi.app/terms

## License

Copyright © 2025 Nuubi. All rights reserved.

## Contributing

This is a private repository. For collaboration inquiries, please contact support@nuubi.app.
