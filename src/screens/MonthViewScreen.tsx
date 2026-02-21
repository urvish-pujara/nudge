import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  SectionList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useReminders, Task } from '../context/RemindersContext';
import { getNextOccurrence, isMatchingRecurrence } from '../utils/recurrenceUtils';
import { formatTime, getDueDateColor } from '../utils/dateUtils';

interface MonthViewScreenProps {
  navigation: any;
}

interface TaskForDay {
  date: string;
  dateLabel: string;
  tasks: Task[];
}

interface SectionData {
  title: string;
  data: Task[];
}

export const MonthViewScreen: React.FC<MonthViewScreenProps> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { lists, completeTask } = useReminders();

  const currentDate = useMemo(() => new Date(), []);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get all tasks for current month, organized by due date
  const tasksByDate = useMemo(() => {
    const tasksMap = new Map<string, Task[]>();

    // Get first and last day of month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Iterate through all dates in the month
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const currentDateString = d.toISOString().split('T')[0];
      const dayTasks: Task[] = [];

      // Check all lists for matching tasks
      lists.forEach(list => {
        list.tasks.forEach(task => {
          let shouldInclude = false;

          // Non-recurring tasks with due date
          if (!task.recurrence && task.dueDate) {
            if (task.dueDate === currentDateString) {
              shouldInclude = true;
            }
          }
          // Recurring tasks
          else if (task.recurrence) {
            // Check if this day matches the recurrence pattern
            if (isMatchingRecurrence(currentDateString, task.recurrence)) {
              shouldInclude = true;
            }
          }

          if (shouldInclude) {
            dayTasks.push(task);
          }
        });
      });

      // Only add date to map if it has tasks
      if (dayTasks.length > 0) {
        tasksMap.set(currentDateString, dayTasks);
      }
    }

    return tasksMap;
  }, [lists, currentMonth, currentYear]);

  // Format tasks for SectionList
  const sections: SectionData[] = useMemo(() => {
    const sortedDates = Array.from(tasksByDate.keys()).sort();

    return sortedDates.map(dateString => {
      const date = new Date(dateString);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayNum = date.getDate();

      // Format: "13th March, Monday"
      const suffix = getDayNumberSuffix(dayNum);
      const monthName = date.toLocaleDateString('en-US', { month: 'long' });
      const title = `${dayNum}${suffix} ${monthName}, ${dayName}`;

      return {
        title,
        data: tasksByDate.get(dateString) || [],
      };
    });
  }, [tasksByDate]);

  const handleCompleteTask = (task: Task) => {
    if (task.id && task.listId) {
      completeTask(task.listId, task.id);
    }
  };

  const handleTaskPress = (task: Task) => {
    // Navigate to task details or edit
    const list = lists.find(l => l.id === task.listId);
    if (list) {
      navigation.navigate('Details', { listId: task.listId });
    }
  };

  const renderTaskItem = ({ item: task, index }: { item: Task; index: number }) => {
    const priorityColors: Record<string, string> = {
      low: '#34C759',
      medium: '#FF9500',
      high: '#FF3B30',
    };

    return (
      <TouchableOpacity
        key={index}
        style={[styles.taskItem, { backgroundColor: theme.card, borderLeftColor: priorityColors[task.priority] }]}
        onPress={() => handleTaskPress(task)}
        activeOpacity={0.7}
      >
        <TouchableOpacity
          onPress={() => handleCompleteTask(task)}
          style={styles.checkboxContainer}
        >
          <View
            style={[
              styles.checkbox,
              task.isCompleted && { backgroundColor: '#34C759' },
              { borderColor: task.isCompleted ? '#34C759' : '#C7C7CC' },
            ]}
          >
            {task.isCompleted && <Icon name="checkmark" size={14} color="#FFF" />}
          </View>
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <Text
            style={[
              styles.taskTitle,
              { color: theme.text, textDecorationLine: task.isCompleted ? 'line-through' : 'none' },
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>

          <View style={styles.taskMeta}>
            {task.dueTime && (
              <View style={styles.timeTag}>
                <Icon name="time" size={12} color="#5AC8FA" />
                <Text style={styles.timeText}>{formatTime(task.dueTime)}</Text>
              </View>
            )}

            {task.recurrence && (
              <View style={styles.recurringTag}>
                <Icon name="repeat" size={12} color="#5AC8FA" />
                <Text style={styles.recurringText}>Recurring</Text>
              </View>
            )}

            <View style={[styles.priorityTag, { backgroundColor: priorityColors[task.priority] }]}>
              <Text style={styles.priorityText}>{task.priority[0].toUpperCase()}</Text>
            </View>
          </View>

          {task.description && (
            <Text style={[styles.taskDescription, { color: '#8E8E93' }]} numberOfLines={1}>
              {task.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View>
          <Text style={[styles.monthTitle, { color: theme.text }]}>
            {new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <Text style={[styles.taskCount, { color: '#8E8E93' }]}>
            {Array.from(tasksByDate.values()).reduce((sum, tasks) => sum + tasks.length, 0)} tasks this month
          </Text>
        </View>
      </View>

      {sections.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="calendar" size={64} color={isDarkMode ? '#404040' : '#E0E0E0'} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No tasks this month</Text>
          <Text style={[styles.emptySubtext, { color: '#8E8E93' }]}>
            Add a task to get started
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.id + index}
          renderItem={renderTaskItem}
          renderSectionHeader={({ section: { title } }) => (
            <View style={[styles.sectionHeader, { backgroundColor: theme.bg }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
            </View>
          )}
          stickySectionHeadersEnabled={false}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

// Helper function to get day suffix (1st, 2nd, 3rd, 4th, etc.)
function getDayNumberSuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

const lightTheme = { bg: '#F2F2F7', card: '#FFF', text: '#000', border: '#C6C6C8' };
const darkTheme = { bg: '#000', card: '#1C1C1E', text: '#FFF', border: '#38383A' };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskCount: {
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginTop: 16,
    marginBottom: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  taskItem: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 10,
    borderLeftWidth: 4,
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    padding: 4,
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(90, 200, 250, 0.1)',
    borderRadius: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#5AC8FA',
    fontWeight: '500',
  },
  recurringTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(90, 200, 250, 0.1)',
    borderRadius: 4,
  },
  recurringText: {
    fontSize: 11,
    color: '#5AC8FA',
    fontWeight: '500',
  },
  priorityTag: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});
