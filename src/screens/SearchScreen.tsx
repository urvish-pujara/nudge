import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  SectionList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useReminders, Task } from '../context/RemindersContext';
import { getRecurrenceDescription } from '../utils/recurrenceUtils';

interface SearchScreenProps {
  navigation: any;
}

const priorityColors = {
  low: '#34C759',
  medium: '#FF9500',
  high: '#FF3B30',
};

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { lists } = useReminders();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const allTasks: (Task & { listName: string; listId: string })[] = [];
  lists.forEach(list => {
    list.tasks.forEach(task => {
      allTasks.push({
        ...task,
        listName: list.name,
        listId: list.id,
      });
    });
  });

  const filteredTasks = allTasks.filter(task => {
    const matchesQuery =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority =
      filterPriority === 'all' || task.priority === filterPriority;

    return matchesQuery && matchesPriority && !task.isCompleted;
  });

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const listName = task.listName;
    const existing = acc.find(group => group.title === listName);
    if (existing) {
      existing.data.push(task);
    } else {
      acc.push({
        title: listName,
        data: [task],
      });
    }
    return acc;
  }, [] as Array<{ title: string; data: (Task & { listName: string; listId: string })[] }>);

  const TaskItem = ({ task }: { task: Task & { listName: string; listId: string } }) => (
    <TouchableOpacity
      style={[styles.taskItem, { backgroundColor: theme.card }]}
      onPress={() => {
        const list = lists.find(l => l.id === task.listId);
        if (list) {
          navigation.navigate('Details', { list });
        }
      }}
    >
      <View style={[styles.taskIndicator, { backgroundColor: priorityColors[task.priority] }]} />
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, { color: theme.text }]}>{task.title}</Text>
        {task.description && (
          <Text style={[styles.taskDescription, { color: '#8E8E93' }]}>
            {task.description}
          </Text>
        )}
        <Text style={[styles.taskList, { color: '#8E8E93' }]}>{task.listName}</Text>
      </View>
      <Icon name="chevron-forward" size={16} color="#C7C7CC" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Search Header */}
      <View style={[styles.searchHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={[styles.searchBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
          <Icon name="search" size={18} color="#8E8E93" />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search tasks..."
            placeholderTextColor={isDarkMode ? '#8E8E93' : '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={[styles.filterContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPriority === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setFilterPriority('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filterPriority === 'all' ? '#007AFF' : theme.text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPriority === 'high' && styles.filterButtonActive,
          ]}
          onPress={() => setFilterPriority('high')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filterPriority === 'high' ? priorityColors.high : theme.text },
            ]}
          >
            High
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPriority === 'medium' && styles.filterButtonActive,
          ]}
          onPress={() => setFilterPriority('medium')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filterPriority === 'medium' ? priorityColors.medium : theme.text },
            ]}
          >
            Medium
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterPriority === 'low' && styles.filterButtonActive,
          ]}
          onPress={() => setFilterPriority('low')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filterPriority === 'low' ? priorityColors.low : theme.text },
            ]}
          >
            Low
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {filteredTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="search" size={50} color="#C7C7CC" />
          <Text style={[styles.emptyStateText, { color: theme.text }]}>
            {searchQuery ? 'No tasks found' : 'No active tasks'}
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: '#8E8E93' }]}>
            {searchQuery ? 'Try a different search term' : 'Create a new task to get started'}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={groupedTasks}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => <TaskItem task={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionHeader, { color: theme.text, backgroundColor: theme.bg }]}>
              {title}
            </Text>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  searchHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7C7CC',
  },
  filterButtonActive: {
    borderWidth: 0,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 10,
  },
  taskIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
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
    marginTop: 4,
    alignItems: 'center',
  },
  taskList: {
    fontSize: 12,
  },
  taskRecurrence: {
    fontSize: 11,
    marginLeft: 4,
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
});
