# Project Structure

## Overview
Nudge - A React Native reminders app like iPhone's Reminders app with support for recurring tasks, dark mode, priorities, and local persistence.

## Folder Structure

```
Nudge/
├── android/                          # Android native configuration
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml  # App manifest
│   │   │   └── res/
│   │   │       ├── mipmap-mdpi/     # 48px app icons (baseline)
│   │   │       ├── mipmap-hdpi/     # 72px app icons
│   │   │       ├── mipmap-xhdpi/    # 96px app icons
│   │   │       ├── mipmap-xxhdpi/   # 144px app icons
│   │   │       └── mipmap-xxxhdpi/  # 192px app icons
│   └── build.gradle
│
├── ios/                              # iOS native configuration
│   ├── Nudge/
│   │   ├── AppDelegate.swift
│   │   ├── Info.plist
│   │   └── Images.xcassets/
│   │       └── AppIcon.appiconset/  # All iOS app icons
│   └── Podfile
│
├── src/                              # TypeScript/React source code
│   ├── components/
│   │   ├── RecurrenceSelector.tsx    # Recurrence configuration UI modal
│   │   └── TimePicker.tsx            # Time selection component
│   ├── context/
│   │   └── RemindersContext.tsx      # Global state management
│   ├── screens/
│   │   ├── HomeScreen.tsx            # List management (main screen)
│   │   ├── DetailsScreen.tsx         # Task viewing and management
│   │   ├── AddEditTaskScreen.tsx     # Task creation/editing form
│   │   ├── SearchScreen.tsx          # Global task search
│   │   └── ListSettingsScreen.tsx    # List configuration
│   ├── types/
│   │   └── react-native-vector-icons.d.ts  # Icon type declarations
│   └── utils/
│       ├── dateUtils.ts              # Date formatting and comparison
│       ├── recurrenceUtils.ts        # Recurring task logic
│       └── validation.ts             # Comprehensive input validation
│
├── assets/                           # Application resources
│   ├── icons/
│   │   ├── nudge-64.png
│   │   ├── nudge-128.png
│   │   └── nudge-256.png
│   └── images/
│       ├── nudge.png                 # Original app icon
│       ├── nudge-512.png
│       └── nudge-1024.png
│
├── public/                           # Source assets
│   └── nudge.png                     # Source app icon (1024x1024)
│
├── __tests__/
│   └── App.test.tsx
│
├── App.tsx                           # App entry point and navigation setup
├── app.json                          # React Native app config
├── babel.config.js                   # Babel transpiler config
├── jest.config.js                    # Test configuration
├── metro.config.js                   # Metro bundler config
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
├── generate_icons.py                 # Icon generation utility script
├── FEATURES.md                       # Feature documentation
├── README.md                         # Project readme
├── RECURRING_TASKS_GUIDE.md         # Recurring task guide
└── QUICKSTART.md                     # Quick start guide

```

## Key Directories Explained

### `src/` - Source Code
All TypeScript/React code for the app logic and UI. Organized by function:
- **components/**: Reusable UI components
- **context/**: Redux/Context state management
- **screens/**: Main screen components
- **types/**: TypeScript type definitions
- **utils/**: Helper functions and utilities

### `android/` - Android Assets
Native Android configuration and app icons in multiple DPI densities:
- mdpi: 48×48 (baseline)
- hdpi: 72×72  
- xhdpi: 96×96
- xxhdpi: 144×144
- xxxhdpi: 192×192

### `ios/` - iOS Assets
Native iOS configuration with app icons for all Apple device scales:
- AppIcon.appiconset: Contains icons for all iPhone/iOS sizes

### `assets/` - Application Resources
Organized app assets:
- **icons/**: Standard icon sizes (64, 128, 256)
- **images/**: Full resolution images and splash screens (512, 1024)

## Icon Generation

The app icons were generated from `public/nudge.png` (1024×1024) using the `generate_icons.py` script.

Run icon generation:
```bash
python generate_icons.py
```

This generates:
- ✓ Android icons in 5 DPI densities
- ✓ iOS icons for all required scales
- ✓ Asset folder copies for app use

## Dependencies

### Core
- **react-native**: 0.84.0 - Mobile framework
- **react**: 19.2.3 - UI library
- **typescript**: 5.8.3 - Type safety

### Navigation
- **@react-navigation/native**: 7.x
- **@react-navigation/stack**: 7.x
- **@react-navigation/bottom-tabs**: 7.x

### UI & Icons
- **react-native-gesture-handler**: 2.x
- **react-native-safe-area-context**: 4.x
- **react-native-screens**: 4.x
- **react-native-vector-icons**: 10.3.0 (Ionicons)

### Data & Storage
- **@react-native-async-storage/async-storage**: 1.21.0 - Local persistence

### Date/Time
- **@react-native-community/datetimepicker**: 7.7.0 - Date and time selection

### Development
- **babel**: 7.x - Code transpilation
- **jest**: 29.x - Testing framework
- **eslint**: Code linting
- **prettier**: Code formatting

## Building & Running

### Install Dependencies
```bash
npm install
```

### Android
```bash
npx react-native run-android
```

### iOS
```bash
npx react-native run-ios
```

### Testing
```bash
npm test
```

### Type Checking
```bash
npx tsc --noEmit
```

## Architecture

### State Management
Global state managed via React Context (RemindersContext) with:
- ReminderList objects containing tasks
- Task objects with dates, times, priorities, and recurrence
- Automatic AsyncStorage persistence

### Validation
Comprehensive validation utilities for:
- Time format (24-hour HH:MM)
- Date/datetime combinations  
- Recurrence patterns and intervals
- Task data integrity
- Notification preparation

### Navigation
Bottom tab navigation with:
1. Reminders Stack: HomeScreen → DetailsScreen → AddEditTaskScreen
2. Search Stack: SearchScreen → DetailsScreen

## Features Implemented

✅ Create, read, update, delete reminder lists  
✅ Create, read, update, delete tasks  
✅ Set task priority (low, medium, high)  
✅ Set due dates with date picker  
✅ Set due times with visual time picker  
✅ Recurring tasks (daily, weekly, biweekly, monthly, custom)  
✅ Task completion tracking  
✅ Global task search with filtering  
✅ Light/dark theme support  
✅ Local data persistence (AsyncStorage)  
✅ Comprehensive input validation  
✅ Custom app icon  

## Future Enhancements

- Push notifications for due tasks
- Cloud sync (iCloud, Google Drive)
- Shared reminder lists
- Task attachments
- Voice input for tasks
- Siri integration (iOS)
- Widget support (iOS/Android)
