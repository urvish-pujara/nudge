import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  DrawerLayoutAndroid,
  Alert,
  SectionList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useReminders, Task, ReminderList } from '../context/RemindersContext';
import { getDueDateLabel, getDueDateColor, formatTime } from '../utils/dateUtils';
import { getRecurrenceDescription, getNextOccurrence } from '../utils/recurrenceUtils';

interface DetailsScreenProps {
  route: any;
  navigation: any;
}

const priorityColors = {
  low: '#34C759',
  medium: '#FF9500',
  high: '#FF3B30',
};

export const DetailsScreen: React.FC<DetailsScreenProps> = ({ route, navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { list: initialList } = route.params || {};
  const { lists, completeTask, deleteTask, editTask } = useReminders();
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'none'>('none');
  const [showOptions, setShowOptions] = useState(false);

  const list = lists.find(l => l.id === initialList.id) || initialList;

  const handleCompleteTask = (taskId: string) => {
    completeTask(list.id, taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask(list.id, taskId),
        },
      ]
    );
  };

  const handleEditTask = (task: Task) => {
    navigation.navigate('AddEditTask', { listId: list.id, task });
  };

  const getCompletedTasks = () => list.tasks.filter((t: Task) => t.isCompleted);
  const getActiveTasks = () => list.tasks.filter((t: Task) => !t.isCompleted);

  const sortTasks = (tasks: Task[]) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    if (sortBy === 'date') {
      return [...tasks].sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }
    return tasks;
  };

  const TaskItem = ({ task }: { task: Task }) => (
    <View
      style={[
        styles.taskItem,
        { backgroundColor: theme.card, borderBottomColor: theme.border },
      ]}
    >
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleCompleteTask(task.id)}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: task.isCompleted ? '#007AFF' : 'transparent',
              borderColor: task.isCompleted ? '#007AFF' : '#C7C7CC',
            },
          ]}
        >
          {task.isCompleted && (
            <Icon name="checkmark" size={16} color="#FFF" />
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => handleEditTask(task)}
      >
        <Text
          style={[
            styles.taskTitle,
            {
              color: theme.text,
              textDecorationLine: task.isCompleted ? 'line-through' : 'none',
              opacity: task.isCompleted ? 0.6 : 1,
            },
          ]}
        >
          {task.title}
        </Text>
        {task.description && (
          <Text
            style={[
              styles.taskDescription,
              {
                color: isDarkMode ? '#8E8E93' : '#666',
                opacity: task.isCompleted ? 0.5 : 1,
              },
            ]}
          >
            {task.description}
          </Text>
        )}
        <View style={styles.taskMeta}>
          {task.dueDate && (
            <Text style={[styles.taskMetaText, { color: getDueDateColor(task.dueDate) }]}>
              📅 {getDueDateLabel(task.dueDate)}
            </Text>
          )}
          {task.dueTime && (
            <Text style={[styles.taskMetaText, { color: '#8E8E93' }]}>
              🕐 {formatTime(task.dueTime)}
            </Text>
          )}
          {task.recurrence && task.recurrence.type !== 'none' && (
            <Text style={[styles.taskMetaText, { color: '#5AC8FA' }]}>
              🔄 {getRecurrenceDescription(task.recurrence)}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.taskActions}>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: priorityColors[task.priority] },
          ]}
        >
          <Text style={styles.priorityBadgeText}>
            {task.priority[0].toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
          <Icon name="trash" size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const activeTasks = sortTasks(getActiveTasks());
  const completedTasks = getCompletedTasks();

  const sections = [
    {
      title: 'Active Tasks',
      data: activeTasks,
      showHeader: true,
    },
    {
      title: 'Completed',
      data: completedTasks,
      showHeader: completedTasks.length > 0,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <View style={[styles.listIcon, { backgroundColor: list.color }]}>
            <Icon name={list.icon} size={24} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {list.name}
            </Text>
            <Text style={[styles.taskCount, { color: '#8E8E93' }]}>
              {activeTasks.length} task{activeTasks.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
          <Icon name="ellipsis-horizontal" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Options Menu */}
      {showOptions && (
        <View style={[styles.optionsMenu, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              setSortBy(sortBy === 'priority' ? 'none' : 'priority');
              setShowOptions(false);
            }}
          >
            <Icon
              name={sortBy === 'priority' ? 'checkmark' : 'arrow-down'}
              size={18}
              color={sortBy === 'priority' ? '#007AFF' : '#8E8E93'}
            />
            <Text style={[styles.optionText, { color: theme.text }]}>Sort by Priority</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionItem, { borderTopColor: theme.border, borderTopWidth: 0.5 }]}
            onPress={() => {
              setSortBy(sortBy === 'date' ? 'none' : 'date');
              setShowOptions(false);
            }}
          >
            <Icon
              name={sortBy === 'date' ? 'checkmark' : 'calendar'}
              size={18}
              color={sortBy === 'date' ? '#007AFF' : '#8E8E93'}
            />
            <Text style={[styles.optionText, { color: theme.text }]}>Sort by Date</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tasks List */}
      {activeTasks.length === 0 && completedTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="checkmark-done" size={50} color="#C7C7CC" />
          <Text style={[styles.emptyStateText, { color: theme.text }]}>
            No reminders yet
          </Text>
          <Text
            style={[styles.emptyStateSubtext, { color: '#8E8E93' }]}
          >
            Tap + to create a new reminder
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections.filter(s => s.data.length > 0 || s.showHeader)}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => <TaskItem task={item} />}
          renderSectionHeader={({ section: { title, showHeader } }) =>
            showHeader ? (
              <Text
                style={[
                  styles.sectionHeader,
                  { color: theme.text, backgroundColor: theme.bg },
                ]}
              >
                {title}
              </Text>
            ) : null
          }
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.listContentContainer}
          style={styles.listContainer}
        />
      )}

      {/* FAB Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => navigation.navigate('AddEditTask', { listId: list.id })}
      >
        <Icon name="add" size={28} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

const lightTheme = {
  bg: '#F2F2F7',
  card: '#FFF',
  text: '#000',
  border: '#C6C6C8',
};
const darkTheme = {
  bg: '#000',
  card: '#1C1C1E',
  text: '#FFF',
  border: '#38383A',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskCount: {
    fontSize: 14,
    marginTop: 4,
  },
  optionsMenu: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  listContentContainer: {
    paddingBottom: 90,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskDescription: {
    fontSize: 13,
    marginTop: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },
  taskMetaText: {
    fontSize: 12,
    marginRight: 12,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  priorityBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 1,
  },
});
