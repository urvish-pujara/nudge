# Nudge - A Reminders App

A fully-featured React Native reminders app inspired by Apple's Reminders app. Built with React Native, TypeScript, and async storage for persistent data.

## Features Implemented

### ✅ Core Features
- **Multiple Lists**: Create, edit, and delete reminder lists with custom colors and icons
- **Task Management**: Add, edit, complete, and delete tasks with full descriptions
- **Priority Levels**: Mark tasks as high, medium, or low priority
- **Due Dates & Times**: Set due dates and times for reminders
- **Task Completion**: Check off completed tasks with visual indicators (strikethrough)
- **Sorting**: Sort tasks by priority or due date
- **Search**: Global search across all tasks with priority filtering
- **Dark Mode**: Full dark mode support throughout the app

### 🎨 UI/UX Highlights
- **iOS-style Design**: Native iOS design patterns and aesthetics
- **Dynamic Theming**: Light and dark theme support for all screens
- **Smooth Navigation**: Stack and tab navigation for intuitive app flow
- **Floating Action Button**: Quick access to create new tasks
- **Bottom Tab Navigation**: Easy switching between Lists and Search
- **Empty States**: Helpful empty state screens with guidance

### 💾 Data Persistence
- **AsyncStorage Integration**: All data automatically saved to device
- **Default Data**: Pre-loaded with sample tasks for demonstration
- **Automatic Sync**: Changes immediately persisted to storage

### 🔍 Search & Filtering
- **Global Search**: Search across all tasks in all lists
- **Priority Filtering**: Filter by High, Medium, or Low priority
- **Smart Grouping**: Results grouped by list for easy navigation

### 📱 Screens
1. **Home Screen** - View all lists with task counts
2. **Details Screen** - View and manage tasks in a specific list
3. **Add/Edit Task Screen** - Create and edit task details
4. **Search Screen** - Global search and filter across all tasks

## Project Structure

```
src/
├── context/
│   └── RemindersContext.tsx        # Global state management
├── screens/
│   ├── HomeScreen.tsx              # Lists view
│   ├── DetailsScreen.tsx           # Tasks view for a list
│   ├── AddEditTaskScreen.tsx       # Task creation/editing
│   ├── SearchScreen.tsx            # Global search
│   └── ListSettingsScreen.tsx      # List settings
├── utils/
│   ├── dateUtils.ts                # Date formatting and utilities
│   └── validation.ts               # Input validation
└── App.tsx                         # Main app with navigation
```

## Installation & Setup

### Prerequisites
- Node.js (v22.11.0 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS)

### Install Dependencies
```bash
cd c:\Users\Admin\Desktop\Nudge
npm install
```

### Run on Android
```bash
npm run android
```

### Run on iOS
```bash
npm run ios
```

## Technologies Used

### Core
- **React Native** (0.84.0) - Mobile app framework
- **React** (19.2.3) - UI library
- **TypeScript** - Type-safe development

### Navigation
- **@react-navigation/native** - Navigation framework
- **@react-navigation/stack** - Stack navigation
- **@react-navigation/bottom-tabs** - Bottom tab navigation
- **react-native-gesture-handler** - Gesture support
- **react-native-screens** - Native screen support

### Storage & UI
- **@react-native-async-storage/async-storage** - Persistent storage
- **@react-native-community/datetimepicker** - Date/time picker
- **react-native-vector-icons** - Icon library (Ionicons)
- **react-native-safe-area-context** - Safe area support

## Key Features Details

### Task Management
- Create tasks with title, description, priority, and due date/time
- Edit existing tasks
- Mark tasks as complete
- Delete tasks with confirmation
- Visual priority indicators

### List Management
- Create custom lists with:
  - Custom names
  - 8 color options
  - 12 icon choices
- Edit list details
- Delete lists with confirmation
- View task counts per list

### Smart Sorting
- **Sort by Priority**: High → Medium → Low
- **Sort by Date**: Earliest → Latest
- Toggle sorting on/off

### Search Functionality
- Search by task title or description
- Filter by priority level
- Results grouped by list
- Active tasks only

### Data Persistence
- All data stored locally using AsyncStorage
- Automatic saving on every change
- Pre-populated with sample data
- Survives app restarts

## UI Theme Colors

### Light Mode
- Background: #F2F2F7
- Cards: #FFFFFF
- Text: #000000
- Border: #C6C6C8

### Dark Mode
- Background: #000000
- Cards: #1C1C1E
- Text: #FFFFFF
- Border: #38383A

### Accent Colors
- Primary: #007AFF (Blue)
- Success: #34C759 (Green)
- Warning: #FF9500 (Orange)
- Danger: #FF3B30 (Red)
- Secondary: #AF52DE (Purple)

## Sample Data

The app comes with pre-populated sample data:
1. **Daily Action Items** (4 tasks) - Green list with daily workflow tasks
2. **Pending Tasks - Sortly** (0 tasks) - Blue list for pending work
3. **Pending Tasks** (6 tasks) - Red list with various pending items

## Future Enhancements

- Push notifications for due reminders
- Recurring tasks/reminders
- Subtasks within tasks
- iCloud synchronization
- Sharing lists with others
- Recurring patterns (daily, weekly, monthly)
- Location-based reminders
- Custom sounds and notifications
- Task categories/tags
- Export/import functionality

## Development Notes

### State Management
The app uses React Context API for global state management through `RemindersContext`. This provides a clean, Redux-free approach to managing app state.

### Async Storage
Data is automatically persisted using AsyncStorage. The context loads data on mount and saves whenever state changes.

### Styling
All screens use a theme-aware styling approach with light/dark mode support. Colors and spacing follow iOS design guidelines.

### Validation
Input validation utilities prevent invalid data entry (empty titles, invalid times, etc.).

## Testing

Unit tests can be run with:
```bash
npm test
```

## Building for Production

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
```bash
cd ios
xcodebuild -workspace Nudge.xcworkspace -scheme Nudge -configuration Release
```

## Troubleshooting

### AsyncStorage not persisting
- Check that dependencies are properly installed
- On Android, ensure proper permissions in AndroidManifest.xml
- Clear app data and reinstall if issues persist

### Icons not showing
- Rebuild the app: `npm run android` or `npm run ios`
- Clear your build cache

### Navigation issues
- Ensure all screens are registered in navigation stack
- Check that route names match navigation calls

## License

Copyright © 2026. All rights reserved.

## Support

For issues or feature requests, please contact support.
