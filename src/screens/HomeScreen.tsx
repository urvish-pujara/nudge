import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useReminders } from '../context/RemindersContext';

interface HomeScreenProps {
  navigation: any;
}

 

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { lists, completeTask, deleteTask } = useReminders();

  // flatten tasks across lists
  const allTasks = lists.flatMap(l => (l.tasks || []).map(t => ({ ...t, listId: l.id, listName: l.name })));

  const dailyTasks = allTasks.filter(t => t.recurrence && t.recurrence.type === 'daily');
  const weeklyTasks = allTasks.filter(t => t.recurrence && t.recurrence.type === 'weekly');
  const monthlyTasks = allTasks.filter(t => t.recurrence && t.recurrence.type === 'monthly');
  const oneTimeTasks = allTasks.filter(t => !t.recurrence || t.recurrence.type === 'none');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Reminders</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddEditTask') }>
          <Icon name="add-circle" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.listContent}>
        {/** Category tiles — tap to open CategoryScreen */}
        <TouchableOpacity style={[styles.listItem, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('Category', { category: 'daily' })}>
          <View style={styles.leftContent}>
            <View style={[styles.iconCircle, { backgroundColor: '#4CD964' }]}>
              <Icon name="repeat" size={20} color="#FFF" />
            </View>
            <View style={styles.textContent}>
              <Text style={[styles.listName, { color: theme.text }]}>Daily</Text>
              <Text style={[styles.taskCount, { color: '#8E8E93' }]}>{dailyTasks.length} task{dailyTasks.length !== 1 ? 's' : ''}</Text>
            </View>
          </View>
          <View style={styles.rightContent}><Icon name="chevron-forward" size={20} color="#8E8E93" /></View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.listItem, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('Category', { category: 'weekly' })}>
          <View style={styles.leftContent}>
            <View style={[styles.iconCircle, { backgroundColor: '#5AC8FA' }]}>
              <Icon name="calendar" size={20} color="#FFF" />
            </View>
            <View style={styles.textContent}>
              <Text style={[styles.listName, { color: theme.text }]}>Weekly</Text>
              <Text style={[styles.taskCount, { color: '#8E8E93' }]}>{weeklyTasks.length} task{weeklyTasks.length !== 1 ? 's' : ''}</Text>
            </View>
          </View>
          <View style={styles.rightContent}><Icon name="chevron-forward" size={20} color="#8E8E93" /></View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.listItem, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('Category', { category: 'monthly' })}>
          <View style={styles.leftContent}>
            <View style={[styles.iconCircle, { backgroundColor: '#007AFF' }]}>
              <Icon name="calendar" size={20} color="#FFF" />
            </View>
            <View style={styles.textContent}>
              <Text style={[styles.listName, { color: theme.text }]}>Monthly</Text>
              <Text style={[styles.taskCount, { color: '#8E8E93' }]}>{monthlyTasks.length} task{monthlyTasks.length !== 1 ? 's' : ''}</Text>
            </View>
          </View>
          <View style={styles.rightContent}><Icon name="chevron-forward" size={20} color="#8E8E93" /></View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.listItem, { backgroundColor: theme.card }]} onPress={() => navigation.navigate('Category', { category: 'one-time' })}>
          <View style={styles.leftContent}>
            <View style={[styles.iconCircle, { backgroundColor: '#AF52DE' }]}>
              <Icon name="document" size={20} color="#FFF" />
            </View>
            <View style={styles.textContent}>
              <Text style={[styles.listName, { color: theme.text }]}>One-time</Text>
              <Text style={[styles.taskCount, { color: '#8E8E93' }]}>{oneTimeTasks.length} task{oneTimeTasks.length !== 1 ? 's' : ''}</Text>
            </View>
          </View>
          <View style={styles.rightContent}><Icon name="chevron-forward" size={20} color="#8E8E93" /></View>
        </TouchableOpacity>
      </View>

      
    </SafeAreaView>
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
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContent: {
    flex: 1,
  },
  listName: {
    fontSize: 17,
    fontWeight: '500',
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  taskCount: {
    fontSize: 13,
  },
  recurringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  recurringBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  modalButton: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  colorSection: {
    marginBottom: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  colorOption: {
    width: '20%',
    aspectRatio: 1,
    borderRadius: 50,
    margin: '2.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  iconSection: {
    marginBottom: 24,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  iconOption: {
    width: '20%',
    aspectRatio: 1,
    borderRadius: 12,
    margin: '2.5%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  previewSection: {
    marginBottom: 20,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  previewIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  previewText: {
    fontSize: 17,
    fontWeight: '500',
  },
});
