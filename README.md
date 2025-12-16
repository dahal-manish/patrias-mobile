# Patrias Mobile

A React Native mobile companion app for [Patrias](https://patrias.us) - helping users prepare for the US citizenship civics exam. Built with Expo, React Native, TypeScript, and Supabase.

## 🎯 Overview

Patrias Mobile is an iOS/Android app that provides a convenient way for users to practice civics questions on the go. The app syncs with the main Patrias web platform, allowing users to access their progress and practice sessions across devices.

## ✨ Features (MVP)

### Authentication
- **Email/Password Login** - Secure authentication using Supabase Auth
- **Sign Up** - Create new accounts with password validation
- **Session Persistence** - Secure session storage using Expo SecureStore
- **Auto-login** - Restores session on app launch

### Practice
- **10-Question Practice Sessions** - Quick practice rounds with real civics questions
- **Real Database Questions** - Fetches questions directly from Supabase
- **Progress Tracking** - Visual progress bar and score tracking
- **Immediate Feedback** - See correct/incorrect answers with visual indicators
- **Session Summary** - View your score and percentage at the end

### Progress
- **Last Session Display** - View your most recent practice session results
- **Score Breakdown** - See correct answers, total questions, and percentage
- **Persistent Storage** - Progress saved locally with AsyncStorage
- **Encouragement Messages** - Personalized feedback based on performance

### Notifications
- **Daily Reminders** - Schedule daily practice reminders at 8 PM
- **Permission Handling** - Automatic permission requests
- **Smart Scheduling** - Prevents duplicate reminders

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) ~54.0.29
- **Language**: TypeScript
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- **State Management**: 
  - [React Query](https://tanstack.com/query/latest) for server state
  - React Context for auth and progress
- **Backend**: [Supabase](https://supabase.com/)
  - Authentication
  - Database (questions)
- **Storage**: 
  - Expo SecureStore (session persistence)
  - AsyncStorage (progress tracking)
- **Notifications**: Expo Notifications

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (optional, for development)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Supabase account with project set up

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dahal-manish/patrias-mobile.git
   cd patrias-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Open `src/config/supabaseConfig.ts`
   - Replace the placeholder values with your Supabase URL and anon key:
     ```typescript
     export const SUPABASE_URL = "https://your-project.supabase.co";
     export const SUPABASE_ANON_KEY = "your-anon-key";
     ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser (limited functionality)

## 📁 Project Structure

```
patrias-mobile/
├── app/                    # Expo Router file-based routing
│   ├── (auth)/            # Authentication routes
│   │   ├── login.tsx      # Login screen
│   │   └── signup.tsx     # Signup screen
│   ├── (app)/             # Authenticated app routes
│   │   ├── home.tsx       # Home screen
│   │   ├── practice.tsx   # Practice session screen
│   │   └── progress.tsx   # Progress screen
│   └── _layout.tsx        # Root layout with providers
├── src/
│   ├── config/            # Configuration files
│   │   └── supabaseConfig.ts
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ProgressContext.tsx
│   ├── hooks/             # Custom React hooks
│   │   └── usePracticeQuestions.ts
│   └── lib/               # Utility libraries
│       ├── notifications.ts
│       ├── questions.ts
│       ├── supabase.ts
│       └── validation.ts
└── package.json
```

## 🔐 Authentication Flow

1. User opens app → Checks SecureStore for existing session
2. If session exists → Restores session and navigates to home
3. If no session → Shows login/signup screens
4. On login/signup → Saves session to SecureStore
5. On logout → Clears SecureStore and redirects to login

## 📊 Practice Flow

1. User taps "Start 10-question practice" on home screen
2. App fetches 10 random questions from Supabase
3. User answers questions one at a time
4. Immediate feedback shown (correct/incorrect)
5. Progress bar updates after each question
6. On completion → Shows summary with score
7. Result automatically saved to AsyncStorage

## 🔔 Notifications

- Daily reminders scheduled for 8:00 PM local time
- Requires notification permissions (requested automatically)
- Can be set/canceled from the home screen
- Uses Expo Notifications with proper Android channel setup

## 🧪 Development

### Adding New Features

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test thoroughly
4. Commit: `git commit -m "feat: description of changes"`
5. Push: `git push origin feature/your-feature-name`
6. Create a pull request on GitHub

### Code Style

- TypeScript strict mode enabled
- Follow React Native best practices
- Use functional components with hooks
- Keep components focused and reusable

## 🔒 Security

- **Never commit secrets**: Supabase service keys, API keys, etc.
- **Use anon key only**: The app only uses Supabase's public anon key
- **Secure storage**: Sensitive data (sessions) stored in SecureStore
- **Password validation**: Enforces strong password requirements

## 📝 Environment Variables

For production, consider moving Supabase credentials to environment variables:

1. Install `expo-constants` and `expo-env`
2. Create `.env` file (add to `.gitignore`)
3. Use `process.env.EXPO_PUBLIC_SUPABASE_URL` in config

## 🐛 Troubleshooting

### Common Issues

**"Network request failed"**
- Check Supabase URL and anon key in config
- Verify internet connection
- Check Supabase project is active

**"Notification permissions denied"**
- Go to device Settings → Apps → Patrias → Notifications
- Enable notifications manually

**"Session not persisting"**
- Check SecureStore permissions
- Clear app data and re-login

## 🚧 Roadmap

- [ ] User profile management
- [ ] Question history and review
- [ ] Advanced progress analytics
- [ ] Offline mode support
- [ ] Customizable reminder times
- [ ] Integration with web app progress
- [ ] Push notifications for achievements
- [ ] Dark mode support

## 📄 License

[Add your license here]

## 👥 Contributing

[Add contribution guidelines here]

## 📞 Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/dahal-manish/patrias-mobile/issues)
- Contact: [Add contact info]

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Backend powered by [Supabase](https://supabase.com/)
- Questions from USCIS civics test materials

---

Made with ❤️ for US citizenship test preparation

