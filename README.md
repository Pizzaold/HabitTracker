# Habit Tracker App

A mobile application built with React Native and Expo that I made for myself to help me build better habits through gamification. You can track habits, complete todos, and earn points to claim rewards.

## Features

- **Habit Tracking**
  - Create daily and weekly habits
  - Track completion streaks
  - Automatic reset at midnight for daily habits
  - Automatic reset on Mondays for weekly habits
  - Earn points for completing habits

- **Todo Management**
  - Create one-time tasks
  - Set due dates
  - Earn points for completion

- **Reward System**
  - Create custom rewards
  - Spend earned points on rewards

- **Points System**
  - Earn points for completing habits and todos
  - Spend points on rewards
  - Track total points balance

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development), Xcode (for iOS development) or just Expo GO app

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Pizzaold/HabitTracker
cd HabitTrackerApp
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Install Expo Go on your mobile device from:
   - [App Store](https://apps.apple.com/app/apple-store/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Running the App

1. Start the development server:
```bash
yarn expo start
# or
npm run expo start
```

2. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

Alternatively, press:
- `a` to open on Android emulator
- `i` to open on iOS simulator

## Project Structure

```
HabitTrackerApp/
├── app/                    # Main application code
│   ├── (tabs)/            # Tab-based navigation screens
│   ├── interface.ts       # TypeScript interfaces
│   └── utility.ts         # Utility functions
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
└── assets/               # Images and other static assets
```

## Key Components

- `useAppData.ts`: Manages application state and data persistence
- `useBackgroundTasks.ts`: Handles automatic habit resets
- `HabitResetTester.tsx`: Test utility for habit reset functionality

## Development Notes

- The app uses Expo Router for navigation
- Data is persisted using AsyncStorage
- Background tasks run every 15 minutes to check and reset habits
- Points system manages user progression
- Habits and todos can be reordered using drag controls

## Building for Production

1. Configure app.json for your deployment needs

2. Build for Android:
```bash
eas build -p android
```

3. Build for iOS:
```bash
eas build -p ios
```

## Troubleshooting

If you encounter the plugin error during startup:
1. Check app.json plugin configuration
2. Clear Expo cache:
```bash
yarn expo start --clear
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

GNU General Public License v3.0

