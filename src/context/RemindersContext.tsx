import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecurrenceConfig } from '../utils/recurrenceUtils';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  listId: string;
  recurrence?: RecurrenceConfig;
  isRecurringInstance?: boolean;
  parentTaskId?: string;
}

export interface ReminderList {
  id: string;
  name: string;
  color: string;
  icon: string;
  tasks: Task[];
}

interface RemindersContextType {
  lists: ReminderList[];
  addList: (name: string, color: string, icon: string) => void;
  deleteList: (listId: string) => void;
  editList: (listId: string, name: string, color: string, icon: string) => void;
  addTask: (listId: string, task: Omit<Task, 'id' | 'listId'>) => void;
  deleteTask: (listId: string, taskId: string) => void;
  editTask: (listId: string, taskId: string, task: Partial<Task>) => void;
  completeTask: (listId: string, taskId: string) => void;
  getTaskCount: (listId: string) => number;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

const RemindersContext = createContext<RemindersContextType | undefined>(undefined);

const STORAGE_KEY = 'REMINDERS_DATA';

const defaultLists: ReminderList[] = [
  {
    id: '1',
    name: 'Daily Action Items',
    color: '#4CD964',
    icon: 'list',
    tasks: [
      { id: '1', title: 'Review emails', description: 'Check and respond to important emails', dueDate: '2026-02-22', dueTime: '', isCompleted: false, priority: 'high', listId: '1', recurrence: { type: 'daily' } },
      { id: '2', title: 'Team meeting', description: '10:00 AM - Project sync', dueDate: '2026-02-23', dueTime: '10:00', isCompleted: false, priority: 'high', listId: '1', recurrence: { type: 'weekly', daysOfWeek: [1] } },
      { id: '3', title: 'Update documentation', description: 'Update project README', dueDate: '2026-02-24', dueTime: '', isCompleted: true, priority: 'medium', listId: '1' },
      { id: '4', title: 'Code review', description: 'Review PR #123', dueDate: '2026-02-25', dueTime: '14:00', isCompleted: false, priority: 'medium', listId: '1' },
      { id: '5', title: 'Deploy to production', description: 'Release v2.1', dueDate: '2026-02-26', dueTime: '15:30', isCompleted: false, priority: 'high', listId: '1' },
      { id: '6', title: 'Sprint planning', description: 'Plan next sprint', dueDate: '2026-02-27', dueTime: '09:00', isCompleted: false, priority: 'medium', listId: '1' },
    ],
  },
  {
    id: '2',
    name: 'Monthly Tasks',
    color: '#007AFF',
    icon: 'desktop-outline',
    tasks: [
        { id: '1', title: 'Pay rent', description: 'Due on the 1st of every month', dueDate: '2026-03-01', dueTime: '', isCompleted: false, priority: 'high', listId: '2', recurrence: { type: 'monthly', dayOfMonth: 1 } },
        { id: '2', title: 'Pay electricity bill', description: 'Due on the 5th of every month', dueDate: '2026-02-05', dueTime: '', isCompleted: true, priority: 'medium', listId: '2', recurrence: { type: 'monthly', dayOfMonth: 5 } },
        { id: '3', title: 'Pay loan installment', description: 'Due on the 15th of every month', dueDate: '2026-02-15', dueTime: '', isCompleted: false, priority: 'high', listId: '2', recurrence: { type: 'monthly', dayOfMonth: 15 } },
        { id: '4', title: 'Pay credit card bill', description: 'Due on the 20th of every month', dueDate: '2026-02-20', dueTime: '', isCompleted: false, priority: 'medium', listId: '2', recurrence: { type: 'monthly', dayOfMonth: 20 } },
        { id: '5', title: 'Review monthly expenses', description: 'Analyze spending and budget for next month', dueDate: '2026-02-28', dueTime: '', isCompleted: false, priority: 'low', listId: '2' },
        { id: '6', title: 'Review salary payslip', description: 'Check for any discrepancies in the payslip', dueDate: '2026-02-19', dueTime: '', isCompleted: false, priority: 'low', listId: '2' },
    ],
  },
  {
    id: '3',
    name: 'Personal Tasks',
    color: '#FF3B30',
    icon: 'time',
    tasks: [
      { id: '1', title: 'Buy groceries', description: 'Milk, eggs, bread', dueDate: '2026-02-23', dueTime: '18:00', isCompleted: false, priority: 'low', listId: '3' },
      { id: '2', title: 'Call dentist', description: 'Schedule appointment', dueDate: '2026-02-24', dueTime: '', isCompleted: false, priority: 'medium', listId: '3' },
      { id: '3', title: 'Gym session', description: 'Evening workout', dueDate: '2026-02-22', dueTime: '18:30', isCompleted: true, priority: 'high', listId: '3', recurrence: { type: 'weekly', daysOfWeek: [0, 2, 4] } },
      { id: '4', title: 'Car maintenance', description: 'Oil change', dueDate: '2026-02-28', dueTime: '', isCompleted: false, priority: 'medium', listId: '3' },
      { id: '5', title: 'Laundry', description: 'Wash clothes', dueDate: '2026-02-22', dueTime: '19:00', isCompleted: false, priority: 'low', listId: '3', recurrence: { type: 'weekly', daysOfWeek: [6] } },
      { id: '6', title: 'Plan weekend trip', description: 'Book hotel and flights', dueDate: '2026-02-21', dueTime: '', isCompleted: false, priority: 'low', listId: '3' },
    ],
  },
];

export const RemindersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<ReminderList[]>(defaultLists);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setLists(JSON.parse(data));
      } else {
        setLists(defaultLists);
        await saveDataToStorage(defaultLists);
      }
    } catch (error) {
      console.log('Error loading data:', error);
      setLists(defaultLists);
    }
  };

  const saveDataToStorage = async (data: ReminderList[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  const saveData = async () => {
    await saveDataToStorage(lists);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [lists]);

  const addList = (name: string, color: string, icon: string) => {
    const newList: ReminderList = {
      id: Date.now().toString(),
      name,
      color,
      icon,
      tasks: [],
    };
    setLists([...lists, newList]);
  };

  const deleteList = (listId: string) => {
    setLists(lists.filter(list => list.id !== listId));
  };

  const editList = (listId: string, name: string, color: string, icon: string) => {
    setLists(lists.map(list =>
      list.id === listId ? { ...list, name, color, icon } : list
    ));
  };

  const addTask = (listId: string, task: Omit<Task, 'id' | 'listId'>) => {
    setLists(lists.map(list =>
      list.id === listId
        ? {
            ...list,
            tasks: [
              ...list.tasks,
              {
                ...task,
                id: Date.now().toString(),
                listId,
              },
            ],
          }
        : list
    ));
  };

  const deleteTask = (listId: string, taskId: string) => {
    setLists(lists.map(list =>
      list.id === listId
        ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
        : list
    ));
  };

  const editTask = (listId: string, taskId: string, updates: Partial<Task>) => {
    setLists(lists.map(list =>
      list.id === listId
        ? {
            ...list,
            tasks: list.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
          }
        : list
    ));
  };

  const completeTask = (listId: string, taskId: string) => {
    editTask(listId, taskId, { isCompleted: !lists.find(l => l.id === listId)?.tasks.find(t => t.id === taskId)?.isCompleted });
  };

  const getTaskCount = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    return list ? list.tasks.filter(task => !task.isCompleted).length : 0;
  };

  return (
    <RemindersContext.Provider value={{ lists, addList, deleteList, editList, addTask, deleteTask, editTask, completeTask, getTaskCount, loadData, saveData }}>
      {children}
    </RemindersContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(RemindersContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within RemindersProvider');
  }
  return context;
};
