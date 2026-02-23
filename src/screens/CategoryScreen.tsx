import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, useColorScheme, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useReminders, Task } from '../context/RemindersContext';
import { formatTime } from '../utils/dateUtils';

interface CategoryScreenProps {
  route: any;
  navigation: any;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({ route, navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { lists, completeTask, deleteTask } = useReminders();

  const { category } = route.params || { category: 'daily' };

  // flatten tasks
  const allTasks = lists.flatMap(l => (l.tasks || []).map(t => ({ ...t, listId: l.id, listName: l.name })));

  const [selectedWeekday, setSelectedWeekday] = useState<number | null>(null);

  let tasks: (Task & { listName?: string; listId?: string })[] = [];
  if (category === 'daily') tasks = allTasks.filter(t => t.recurrence && t.recurrence.type === 'daily');
  else if (category === 'weekly') tasks = allTasks.filter(t => t.recurrence && t.recurrence.type === 'weekly');
  else if (category === 'monthly') tasks = allTasks.filter(t => t.recurrence && t.recurrence.type === 'monthly');
  else tasks = allTasks.filter(t => !t.recurrence || t.recurrence.type === 'none');

  const weekdays = ['All', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const TaskItem = ({ task }: { task: any }) => (
    <View style={[styles.taskItem, { backgroundColor: theme.card, borderBottomColor: theme.border }]}> 
      <TouchableOpacity style={styles.checkboxContainer} onPress={() => completeTask(task.listId, task.id)}>
        <View style={[styles.checkbox, { backgroundColor: task.isCompleted ? '#007AFF' : 'transparent', borderColor: task.isCompleted ? '#007AFF' : '#C7C7CC' }]}>
          {task.isCompleted && <Icon name="checkmark" size={16} color="#FFF" />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.taskContent} onPress={() => navigation.navigate('AddEditTask', { listId: task.listId, task })}>
        <Text style={[styles.taskTitle, { color: theme.text, textDecorationLine: task.isCompleted ? 'line-through' : 'none' }]}>{task.title}</Text>
        {task.description ? <Text style={[styles.taskDescription, { color: isDarkMode ? '#8E8E93' : '#666' }]}>{task.description}</Text> : null}
        <View style={styles.taskMeta}>
          {task.dueDate && <Text style={[styles.taskMetaText, { color: '#8E8E93' }]}>{task.dueDate}</Text>}
          {task.dueTime && <Text style={[styles.taskMetaText, { color: '#8E8E93' }]}>{formatTime(task.dueTime)}</Text>}
          {task.listName && <Text style={[styles.taskMetaText, { color: '#8E8E93' }]}>{task.listName}</Text>}
        </View>
      </TouchableOpacity>

      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => deleteTask(task.listId, task.id)}>
          <Icon name="trash" size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const filtered = category === 'weekly' && selectedWeekday !== null
    ? tasks.filter(t => (t.recurrence?.daysOfWeek || []).includes(selectedWeekday))
    : tasks;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}> 
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}> 
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{category[0].toUpperCase() + category.slice(1)}</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {category === 'weekly' && (
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              {weekdays.map((d, i) => (
                <TouchableOpacity key={d} onPress={() => setSelectedWeekday(i === 0 ? null : i - 1)} style={{ padding: 8, marginRight: 8, borderRadius: 8, backgroundColor: (selectedWeekday === (i-1) || (i===0 && selectedWeekday===null)) ? '#E5E5EA' : 'transparent' }}>
                  <Text style={{ color: '#8E8E93' }}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {filtered.length === 0 ? (
          <View style={{ padding: 16 }}><Text style={{ color: '#8E8E93' }}>No tasks</Text></View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={t => `${t.listId}-${t.id}`}
            renderItem={({ item }) => <TaskItem task={item} />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          />
        )}
      </View>
    </View>
  );
};

const lightTheme = { bg: '#F2F2F7', card: '#FFF', text: '#000', border: '#C6C6C8' };
const darkTheme = { bg: '#000', card: '#1C1C1E', text: '#FFF', border: '#38383A' };

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  taskItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, marginBottom: 8 },
  checkboxContainer: { padding: 4 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  taskContent: { flex: 1, marginLeft: 12 },
  taskTitle: { fontSize: 16, fontWeight: '500' },
  taskDescription: { fontSize: 13, marginTop: 4 },
  taskMeta: { flexDirection: 'row', marginTop: 6, alignItems: 'center' },
  taskMetaText: { fontSize: 12, marginRight: 12, color: '#8E8E93' },
  taskActions: { marginLeft: 8 },
});
