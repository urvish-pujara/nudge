# Nudge - Quick Start Guide

Welcome to Nudge, a fully-featured Reminders app built with React Native! This guide will help you get up and running.

## 🚀 Getting Started

### Step 1: Install Dependencies
All dependencies have been installed. If you need to reinstall them:
```bash
npm install
```

### Step 2: Run the App

**For Android:**
```bash
npm run android
```

**For iOS:**
```bash
npm run ios
```

## 📱 App Features at a Glance

### Home Tab - Your Reminders Lists
- View all your reminder lists
- See task count for each list
- Tap a list to view its tasks
- Long press a list to edit it
- Swipe left to delete a list
- Tap the + button to create a new list

### Details Screen - Tasks in a List
- View all tasks in a list
- Completed tasks are shown at the bottom
- Tap any task to edit it
- Tap the checkbox to mark tasks complete
- Tap the trash icon to delete a task
- Tap the + button to create a new task
- Use the menu (⋯) to sort by priority or date

### Create/Edit Task
- Add a title (required)
- Add optional description/notes
- Set priority (High, Medium, Low)
- Set due date (optional)
- Set due time (optional, HH:MM format)
- Changes are auto-saved

### Search Tab - Find Anything
- Search across all tasks
- Filter by priority level
- Results are grouped by list
- Tap a task to go to that list

## 🎨 Customizing Lists

When creating or editing a list, you can:
- **Choose a Name**: Any name you like (required)
- **Pick a Color**: 8 colors including blue, green, red, orange, purple, pink, teal, and yellow
- **Select an Icon**: 12 icon options like list, star, school, briefcase, cart, heart, home, etc.

## 💡 Tips & Tricks

1. **Quick Task Creation**: Use the + FAB button on any details screen
2. **Search Everything**: The Search tab searches across all your lists
3. **Sorting**: Toggle sorting by priority or date using the menu in Details screen
4. **Priority Colors**:
   - 🔴 Red = High Priority
   - 🟡 Orange = Medium Priority
   - 🟢 Green = Low Priority
5. **Due Date Colors**: 
   - Overdue tasks show in red
   - Today's tasks show in orange
   - Tomorrow's tasks show in orange
   - Future tasks show in green

## 📋 Sample Data

The app comes pre-loaded with sample data:
1. **Daily Action Items** - Daily workflow tasks
2. **Pending Tasks - Sortly** - Sortly-related pending work
3. **Pending Tasks** - General pending items

Feel free to delete these and create your own lists!

## 🔄 Data Storage

All your data is automatically saved to your device using AsyncStorage. Your lists, tasks, and settings will persist even after closing the app.

## 🌙 Dark Mode

The app automatically supports your device's dark mode setting. All screens include full dark mode support with optimized colors.

## ⚠️ Troubleshooting

### App won't start?
1. Ensure all dependencies are installed: `npm install`
2. Clear build cache: `npm run android -- --no-cache` or `npm run ios -- --reset-cache`
3. Try deleting `node_modules` and reinstalling

### Icons not showing?
1. Rebuild the app
2. For Android: `npm run android`
3. For iOS: `npm run ios`

### Data not persisting?
1. Check device storage has space
2. Restart the app
3. Try creating a new task to ensure storage is working

### Crashes when switching screens?
1. Check that you're on the latest code
2. Rebuild the app completely
3. Check Android Logcat or iOS console for error messages

## 📚 Project Structure

```
Nudge/
├── src/
│   ├── context/
│   │   └── RemindersContext.tsx      # State management
│   ├── screens/
│   │   ├── HomeScreen.tsx             # Lists view
│   │   ├── DetailsScreen.tsx          # Tasks view
│   │   ├── AddEditTaskScreen.tsx      # Task editor
│   │   ├── SearchScreen.tsx           # Search
│   │   └── ListSettingsScreen.tsx     # Settings
│   ├── utils/
│   │   ├── dateUtils.ts               # Date helpers
│   │   └── validation.ts              # Validation
│   └── types/
│       └── react-native-vector-icons.d.ts
├── App.tsx                            # Navigation setup
├── package.json                       # Dependencies
└── tsconfig.json                      # TypeScript config
```

## 🔧 Key Technologies

- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **React Navigation** - App navigation
- **AsyncStorage** - Local data persistence
- **DateTimePicker** - Date/time selection
- **Ionicons** - Beautiful icons

## 📝 Creating Your First Task

1. Open the app (you'll see 3 sample lists)
2. Tap "Daily Action Items" (green list)
3. Tap the + button
4. Enter a task title
5. (Optional) Add a description, priority, date, and time
6. Tap "Save"
7. Your task will appear in the list!

## ✅ Marking Tasks Complete

1. Find the task in your list
2. Tap the empty circle on the left
3. The task will show a checkmark and move to "Completed"
4. Tap again to mark it incomplete

## 🗑️ Deleting Tasks

1. Swipe left on a task OR
2. Tap the trash icon on the right
3. Confirm deletion

## 🔍 Searching Tasks

1. Tap the "Search" tab at the bottom
2. Type in the search box to find tasks
3. Use the filter buttons to filter by priority
4. Tap a result to navigate to that list

## 🌟 Advanced Features

### Sorting Tasks
1. Open a list (Details screen)
2. Tap the menu (⋯) in the top right
3. Choose "Sort by Priority" or "Sort by Date"
4. Tap again to toggle sorting off

### Editing Task Details
1. Tap any task to edit it
2. Change title, description, priority, date, or time
3. Tap "Save" - changes are instant!

### Dark Mode
The app automatically uses your system's dark mode setting:
- **iOS**: Settings → Display & Brightness
- **Android**: Settings → Display → Dark Theme

## 💾 Backup Your Data

Your data is stored locally on your device. To preserve it:
- For Android: Use Android's built-in backup
- For iOS: Ensure iCloud backup is enabled

## 🎯 Next Steps

1. ✅ Create your first list with your preferred color and icon
2. ✅ Add tasks that matter to you
3. ✅ Set priorities and due dates
4. ✅ Use search to find tasks across lists
5. ✅ Check off completed tasks

## 📞 Need Help?

If you encounter any issues:
1. Check this guide first
2. Review the error message
3. Try the troubleshooting section above
4. Restart the app
5. Rebuild if needed

Enjoy using Nudge! Stay organized! 🚀
