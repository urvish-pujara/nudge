# Recurring Tasks Guide

## Overview

Your Reminders app now supports advanced recurring task scheduling. You can create tasks that repeat daily, weekly, biweekly, monthly, or with custom patterns.

## Recurrence Types

### 1. **Daily**
Task repeats every single day.
```
Example: "Drink water" repeats daily
```

### 2. **Weekly**
Task repeats on selected days of the week.
```
Example: "Team meeting" on Monday, Wednesday, Friday
```

### 3. **Biweekly (Every 2 Weeks)**
Task repeats every 2 weeks on selected days.
```
Example: "Project review" every 2 weeks on Thursday
```

### 4. **Monthly**
Task repeats on a specific day or pattern each month.

#### Sub-types:

**a) Specific Occurrence of Day**
- First Monday of the month
- Last Friday of the month
- Third Wednesday of the month
- Etc.

```
Example: "Pay rent" on the 1st of every month
Example: "Team outing" on the last Friday of every month
Example: "Review goals" on the first Monday of every month
```

### 5. **Custom**
Create your own repeating pattern with specific interval and days.
```
Example: "Every 2 weeks on Monday and Thursday"
Example: "Every 3 weeks on Friday"
Example: "Every 4 weeks on Tuesday and Saturday"
```

## How to Use

### Creating a Recurring Task

1. **Open Home Screen** → Tap the blue "+" button to create a new task
2. **Fill in Task Details**:
   - Title (required)
   - Description (optional)
   - Due Date
   - Time
   - Priority

3. **Set Recurrence**:
   - Tap the **"Recurrence"** section
   - Modal opens with recurrence options
   - Select recurrence type: Daily, Weekly, Biweekly, Monthly, or Custom
   - Configure according to type (see sections below)
   - Optionally set an end date
   - Tap **Done** to save

4. **Save Task** → Tap **Save** to create the recurring task

### Editing a Recurring Task

1. In **Details Screen**, tap on any task to edit it
2. Modify any field including recurrence settings
3. Tap **Save** to update

### Recurrence Patterns

#### **Daily Setup**
- No additional configuration needed
- Task repeats every day

#### **Weekly Setup**
1. Select "Weekly" from the type list
2. Tap days from the grid (Sun-Sat)
   - Default: Monday-Friday
   - You can select any combination
3. Set optional end date if needed
4. Tap Done

#### **Biweekly Setup**
1. Select "Biweekly" from the type list
2. Tap days you want (e.g., Thursday)
3. Task will repeat every 2 weeks on those days
4. Set optional end date
5. Tap Done

#### **Monthly Setup**

**Method 1: Specific Day of Month**
- Example: "Send invoice" on the 15th
- Just select a day number

**Method 2: Relative Day Pattern** (Recommended)
1. Select "Monthly"
2. Choose recurrence pattern:
   - **1st** (first occurrence)
   - **2nd** (second occurrence)
   - **3rd** (third occurrence)
   - **4th** (fourth occurrence)
   - **Last** (last occurrence)

3. Choose the day:
   - Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday

4. Examples:
   ```
   ✓ First Monday of the month → Team standup
   ✓ Last Friday of the month → Team happy hour
   ✓ Second Tuesday of the month → Budget review
   ✓ Fourth Thursday of the month → Quarterly planning
   ```

#### **Custom Setup**

For complex patterns like "every 2 weeks on specific days":

1. Select "Custom"
2. Enter interval (e.g., 2 for every 2 weeks, 3 for every 3 weeks)
3. Select the days of the week (Monday, Thursday, etc.)
4. Set optional end date
5. Tap Done

**Examples**:
```
Configuration: Interval=2, Days=[Monday, Thursday]
Result: Repeats every 2 weeks on Monday and Thursday

Configuration: Interval=4, Days=[Tuesday, Saturday]  
Result: Repeats every 4 weeks on Tuesday and Saturday

Configuration: Interval=3, Days=[Friday]
Result: Repeats every 3 weeks on Friday
```

### End Date (Optional)

All recurrence types support an optional end date:

1. In the recurrence modal, tap "End Recurrence"
2. Select a date from the date picker
3. Task will stop recurring after this date
4. Leave blank for no end date (task repeats indefinitely)

## Visual Indicators

### On Home Screen
- Lists showing recurring tasks display a **blue recurrence badge**
- Shows the count of recurring tasks in that list
- Icon: 🔄

### On Details Screen
- Each recurring task shows:
  - **Recurrence description**: "Every Monday", "First Friday of month", etc.
  - **Blue icon**: 🔄 indicating it's recurring
  - **Priority badge**: H/M/L
  - **Due date**: If set

### On Search Screen
- Search results show recurrence info for matching tasks
- Format: "Task Name • Every 2 weeks on Thursday"

## Examples

### Daily Tasks
```
Exercise - Daily at 7:00 AM
Take medication - Daily
```

### Weekly Tasks
```
Team meeting - Every Monday, Wednesday, Friday at 10:00 AM
Grocery shopping - Every Saturday at 9:00 AM
```

### Biweekly Tasks
```
Paycheck - Every 2 weeks on Friday
Status report - Every 2 weeks on Tuesday
```

### Monthly Tasks
```
Pay rent - First day of month
Team outing - Last Friday of the month
Review goals - First Monday of the month
Car maintenance - 15th of every month
Performance review - Third Thursday of the month
```

### Custom Patterns
```
Team standup - Every week on Mon, Wed, Fri at 9:00 AM
Project reviews - Every 2 weeks on Thursday at 2:00 PM
Check-ins - Every 3 weeks on Monday and Friday
```

## Sorting and Filtering

### Sort by Priority
- Displays high priority recurring tasks first
- Icon: ⬇️

### Sort by Date
- Displays tasks in chronological order by due date
- Upcoming recurring instances shown first

### Search Recurring Tasks
1. Go to **Search tab**
2. Type to search by title or description
3. Filter by priority if needed
4. Results show recurrence info for each task

## Best Practices

1. **Use meaningful titles**: "Team Standup" instead of "Meeting"
2. **Set due times**: Helps with reminders and organization
3. **Use priorities**: High priority for important recurring tasks
4. **Set end dates**: For temporary recurring tasks (project deadlines, seasonal tasks)
5. **Test patterns**: Create one instance and verify the recurrence pattern works as expected

## Advanced Patterns

### Starting Tasks on Specific Dates
- Set the due date to your preferred start date
- The recurrence pattern calculated from that date forward

### Complex Work Schedules
- **2-week sprints on Tuesday**: Every 2 weeks on Tuesday
- **Bi-weekly meetings**: Every 2 weeks on specific days
- **Monthly reviews**: Every first Monday

### Project-based Recurring Tasks
- Set end dates matching project timelines
- Change status as project progresses
- Delete recurring tasks when project completes

## Limitations & Notes

- ⏱️ Requires setting a due date (start date for recurrence)
- 📅 Time zone is based on device settings
- 🔄 Recurrence patterns are fixed (can't have complex conditional logic)
- 🗑️ Deleting a recurring task deletes all instances
- ✏️ Editing a task affects all future recurrences

## Technical Details

### Recurrence Configuration Object

```typescript
interface RecurrenceConfig {
  type: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom'
  daysOfWeek?: number[]      // 0=Sun, 1=Mon, ..., 6=Sat
  dayOfMonth?: number         // 1-31
  monthDay?: string           // 'first', 'second', 'third', 'fourth', 'last'
  monthDayName?: number       // Day of week for month pattern
  interval?: number           // For custom patterns
  startDate?: string          // ISO date string
  endDate?: string            // ISO date string
  occurrences?: number        // Max repetitions
}
```

### Storage
- All recurrence configurations stored in AsyncStorage
- Automatically persisted with task
- Survives app restart

## Future Enhancements

Potential features for future versions:
- 📬 Push notifications for recurring task due times
- 📊 Analytics on recurring task completion
- 🎯 Recurring subtasks
- 🔗 Linked recurring tasks (complete one, auto-update related)
- 📤 Export recurring task schedules
- ⏰ Smart reminders based on recurrence pattern
- 🌍 Timezone awareness for global teams
