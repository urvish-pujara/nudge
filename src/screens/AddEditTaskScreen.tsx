import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  useColorScheme,
  Modal,
  FlatList,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useReminders, Task } from '../context/RemindersContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RecurrenceSelector } from '../components/RecurrenceSelector';
import { TimePicker } from '../components/TimePicker';
import { RecurrenceConfig } from '../utils/recurrenceUtils';
import { validateTask, validateRecurrence } from '../utils/validation';

interface AddEditTaskScreenProps {
  route: any;
  navigation: any;
}

const priorityOptions: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
const priorityColors = {
  low: '#34C759',
  medium: '#FF9500',
  high: '#FF3B30',
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const AddEditTaskScreen: React.FC<AddEditTaskScreenProps> = ({ route, navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { addTask, editTask, lists } = useReminders();

  const { listId, task } = route.params || {};
  
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate) : new Date());
  const [dueTime, setDueTime] = useState(task?.dueTime || '');
  const [recurrence, setRecurrence] = useState<RecurrenceConfig | undefined>(task?.recurrence);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [streakEnabled, setStreakEnabled] = useState<boolean>(task?.streakEnabled || false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSaveTask = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate.toISOString().split('T')[0],
      dueTime,
      recurrence,
      isCompleted: task?.isCompleted || false,
      streakEnabled,
    };

    // Validate task
    const taskValidation = validateTask(taskData);
    if (!taskValidation.valid) {
      Alert.alert('Validation Error', taskValidation.errors[0] || 'Invalid task data');
      return;
    }

    // Validate recurrence if present
    if (recurrence) {
      const recurrenceValidation = validateRecurrence(recurrence);
      if (!recurrenceValidation.valid) {
        Alert.alert('Recurrence Error', recurrenceValidation.errors[0] || 'Invalid recurrence pattern');
        return;
      }
    }

    const targetListId = listId || (lists && lists.length > 0 ? lists[0].id : undefined);
    if (task?.id) {
      // if editing, require the original listId from route or task
      const editListId = listId || task.parentTaskId || task.listId || targetListId;
      if (editListId) editTask(editListId, task.id, taskData);
    } else {
      if (targetListId) {
        // initialize streak metadata for new task if enabled
        if (streakEnabled) {
          const today = new Date().toISOString().split('T')[0];
          (taskData as any).streakStartDate = today;
          (taskData as any).lastCompletedDate = undefined;
          (taskData as any).currentStreak = 0;
          (taskData as any).bestStreak = 0;
        }
        addTask(targetListId, taskData as any);
      }
    }

    navigation.goBack();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.headerButton, { color: '#007AFF' }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {task ? 'Edit Task' : 'New Task'}
        </Text>
        <TouchableOpacity onPress={handleSaveTask}>
          <Text style={[styles.headerButton, { color: '#007AFF', fontWeight: 'bold' }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <TextInput
            style={[styles.titleInput, { color: theme.text, backgroundColor: theme.bg }]}
            placeholder="Task Title"
            placeholderTextColor={isDarkMode ? '#8E8E93' : '#999'}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description Input */}
        <View style={[styles.section, { backgroundColor: theme.card, marginTop: 10 }]}>
          <TextInput
            style={[styles.descriptionInput, { color: theme.text, backgroundColor: theme.bg }]}
            placeholder="Notes"
            placeholderTextColor={isDarkMode ? '#8E8E93' : '#999'}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Recurrence Selector */}
        <View style={[styles.section, { marginTop: 10 }]}>
          <RecurrenceSelector
            value={recurrence}
            onChange={setRecurrence}
            startDate={dueDate.toISOString().split('T')[0]}
            isDarkMode={isDarkMode}
            theme={theme}
          />
        </View>

        {/* Streak Toggle Section */}
        <View style={[styles.section, { marginTop: 10 }]}>
          <View style={[styles.optionRow, { backgroundColor: theme.card }]}>
            <View style={styles.optionLeft}>
              <Icon name="flame" size={18} color="#FF9500" />
              <Text style={[styles.optionLabel, { color: theme.text }]}>Track Streak</Text>
            </View>
            <Switch
              value={streakEnabled}
              onValueChange={setStreakEnabled}
              trackColor={{ false: '#767577', true: '#81C784' }}
              thumbColor={streakEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Priority Section */}
        <View style={[styles.section, { marginTop: 10 }]}>
          <TouchableOpacity
            style={[styles.optionRow, { backgroundColor: theme.card }]}
            onPress={() => setShowPriorityMenu(true)}
          >
            <View style={styles.optionLeft}>
              <Icon name="flag" size={18} color={priorityColors[priority]} />
              <Text style={[styles.optionLabel, { color: theme.text }]}>Priority</Text>
            </View>
            <View style={styles.optionRight}>
              <View style={[styles.priorityBadge, { backgroundColor: priorityColors[priority] }]}>
                <Text style={styles.priorityText}>{priorityLabels[priority]}</Text>
              </View>
              <Icon name="chevron-forward" size={16} color="#C7C7CC" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Date Section */}
        <View style={[styles.section, { marginTop: 10 }]}>
          <TouchableOpacity
            style={[styles.optionRow, { backgroundColor: theme.card }]}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.optionLeft}>
              <Icon name="calendar" size={18} color="#FF9500" />
              <Text style={[styles.optionLabel, { color: theme.text }]}>Due Date</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={[styles.optionValue, { color: theme.text }]}>
                {dueDate ? formatDate(dueDate) : 'No Date'}
              </Text>
              <Icon name="chevron-forward" size={16} color="#C7C7CC" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Time Section */}
        <View style={[styles.section, { marginTop: 10 }]}>
          <TimePicker
            value={dueTime}
            onChange={setDueTime}
            isDarkMode={isDarkMode}
            theme={theme}
            label="Due Time"
          />
        </View>
      </ScrollView>

      {/* Priority Modal */}
      <Modal visible={showPriorityMenu} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowPriorityMenu(false)} activeOpacity={1}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Priority</Text>
            {priorityOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.priorityOption, priority === option && styles.selectedOption]}
                onPress={() => {
                  setPriority(option);
                  setShowPriorityMenu(false);
                }}
              >
                <View style={[styles.priorityCircle, { backgroundColor: priorityColors[option] }]} />
                <Text style={[styles.priorityOptionText, { color: theme.text }]}>
                  {priorityLabels[option]} Priority
                </Text>
                {priority === option && <Icon name="checkmark" size={20} color={priorityColors[option]} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const lightTheme = { bg: '#F2F2F7', card: '#FFF', text: '#000', border: '#C6C6C8' };
const darkTheme = { bg: '#000', card: '#1C1C1E', text: '#FFF', border: '#38383A' };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  headerButton: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 16,
  },
  descriptionInput: {
    fontSize: 16,
    padding: 16,
    textAlignVertical: 'top',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    marginLeft: 16,
  },
  optionValue: {
    fontSize: 16,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  priorityText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeInput: {
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C7C7CC',
    width: 80,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  selectedOption: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  priorityCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityOptionText: {
    fontSize: 16,
    flex: 1,
  },
});
