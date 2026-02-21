# Month View Feature Documentation

## Overview

The Month View screen is a new tab in the Nudge app that displays all tasks for the current month, organized by date. This provides a calendar-like view of upcoming tasks and reminders.

## Features

### Task Organization
- **Date Headers**: Each date with tasks shows a formatted header: "13th March, Monday"
- **Chronological Order**: Tasks are displayed in chronological order throughout the month
- **All Dates**: Only dates with at least one task are shown
- **Complete & Incomplete**: Both completed and incomplete tasks are shown

### Task Display
Each task shows:
- ✓ **Checkbox**: Mark tasks as complete/incomplete
- **Title**: Task name with strikethrough when completed
- **Description**: Optional task description (if available)
- **Time**: Due time in 12-hour format (e.g., "2:30 PM") if set
- **Priority Badge**: Color-coded priority (H, M, L)
- **Recurrence Indicator**: Shows "Recurring" badge if task has a recurrence pattern

### Smart Recurrence Handling
- **Non-Recurring Tasks**: Must have a due date to appear
- **Recurring Tasks**: Automatically generate occurrences for the month based on:
  - Daily recurrence
  - Weekly (specific days of week)
  - Biweekly (every 2 weeks on specific days)
  - Monthly (specific date or pattern like "1st Monday")
  - Custom intervals with specific days

### Visual Features
- **Color Coding**:
  - Priority: High (Red), Medium (Orange), Low (Green)
  - Left border on tasks matches priority color
  - Time and recurring tags use blue (#5AC8FA)
- **Completion State**: Completed tasks show ✓ checkmark and strikethrough
- **Empty State**: Shows helpful message when no tasks exist for the month
- **Month Header**: Displays current month and total task count

## Architecture

### Component Structure
```
src/screens/MonthViewScreen.tsx
├── Task Organization (useMemo)
│   ├── Iterate through all days of month
│   ├── Check all lists for matching tasks
│   ├── Filter by due date (non-recurring)
│   └── Filter by recurrence matching (recurring)
├── SectionList Rendering
│   ├── Section Header: "13th March, Monday"
│   └── Tasks with checkbox, content, and metadata
└── Interactive Elements
    ├── Task Checkboxes (mark complete)
    └── Task Items (navigate to details)
```

### Data Flow

1. **Load Tasks**: All tasks from all lists are loaded from RemindersContext
2. **Filter by Month**: Filter tasks that occur in the current month
3. **Organize by Date**: Group tasks by their due date or recurrence occurrence
4. **Format Display**: Convert dates to human-readable format with day suffix
5. **Render Sections**: Display date headers and tasks using SectionList

## Usage

### Navigation
- New **"This Month"** tab in bottom navigation
- Calendar icon indicates the month view status
- Can navigate from Lists tab → click a task → Details → back to Month View

### Interactions
1. **Mark Complete**: Tap checkbox to toggle task completion
2. **View Details**: Tap task to navigate to detailed view
3. **Scroll**: Scroll through month to see all tasks
4. **Auto-refresh**: Month view updates when tasks are edited elsewhere

### Example Scenarios

#### Non-Recurring Task
```typescript
{
  id: '1',
  title: 'Buy groceries',
  dueDate: '2026-02-23',
  dueTime: '18:00',
  recurrence: undefined  // Non-recurring
}
// Shows on February 23rd at 6:00 PM
```

#### Daily Recurring Task
```typescript
{
  id: '2',
  title: 'Review emails',
  dueDate: '2026-02-22',
  recurrence: { type: 'daily' }
}
// Shows on every day of the month
```

#### Weekly Recurring Task
```typescript
{
  id: '3',
  title: 'Team meeting',
  dueDate: '2026-02-23',
  dueTime: '10:00',
  recurrence: {
    type: 'weekly',
    daysOfWeek: [1]  // Mondays (0=Sunday, 1=Monday)
  }
}
// Shows every Monday in the month at 10:00 AM
```

#### Monthly Recurring Task
```typescript
{
  id: '4',
  title: 'Pay rent',
  dueDate: '2026-03-01',
  recurrence: {
    type: 'monthly',
    dayOfMonth: 1  // 1st of month
  }
}
// Shows on the 1st of every month
```

## Implementation Details

### useColorScheme Hook
- Automatically supports light/dark mode
- Theme colors: background, card, text, border
- Consistent styling throughout the app

### Date Formatting
```typescript
// Input: 2026-02-23
// Output: "23rd February, Monday"
```

Uses helper function `getDayNumberSuffix()` to add ordinal suffixes (st, nd, rd, th).

### Performance Optimization
- Uses `useMemo` for task organization to prevent unnecessary recalculations
- SectionList only renders visible content on scroll
- Tasks are filtered once per render cycle

## Integration with Existing Features

### Context Integration
- Uses `useReminders()` hook to access all lists and tasks
- Uses `completeTask()` to toggle completion state
- Connects to `RemindersContext` for data persistence

### Utility Functions
- `isMatchingRecurrence()`: Determines if a task matches a specific date
- `formatTime()`: Converts 24-hour time to 12-hour display
- `getDueDateColor()`: Gets priority-based colors (not used here, available)

### Navigation
- Part of `RemindersStack` navigator
- Can navigate to `Details` screen for task details
- Accessible from bottom tab navigation

## Future Enhancements

- [ ] Day view: Tap a date to see detailed view for that day
- [ ] Filters: Show/hide completed tasks, filter by priority
- [ ] Drag-and-drop: Rearrange tasks within a day
- [ ] Inline editing: Quick edit task details from month view
- [ ] Multi-month view: Swipe between months
- [ ] Task indicators: Visual dots for tasks with alerts/notifications
- [ ] List filtering: Show tasks from specific lists only
- [ ] Export: Export month as PDF or calendar format

## Files Modified

### New Files
- `src/screens/MonthViewScreen.tsx` - Month view component (293 lines)

### Updated Files
- `src/context/RemindersContext.tsx` - Sample data with proper due dates
- `App.tsx` - Added MonthView to navigation stack and tabs

## Testing Checklist

- [ ] Month view displays all dates with tasks
- [ ] Date headers show correct format (e.g., "23rd February, Monday")
- [ ] Non-recurring tasks appear on their due date only
- [ ] Daily tasks appear on every day of the month
- [ ] Weekly tasks appear on correct days
- [ ] Monthly tasks appear on correct date
- [ ] Checkbox toggles task completion
- [ ] Completed tasks show checkmark and strikethrough
- [ ] Scrolling works smoothly
- [ ] Empty state displays when no tasks
- [ ] Light/dark theme applies correctly
- [ ] Time formats correctly in 12-hour
- [ ] Navigation to details works
- [ ] Updates reflect in other tabs
