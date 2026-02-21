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
      { id: '1', title: 'Review emails', description: 'Check and respond to important emails', dueDate: '',dueTime: '', isCompleted: false, priority: 'high', listId: '1' },
      { id: '2', title: 'Team meeting', description: '10:00 AM - Project sync', dueDate:'', dueTime: '10:00', isCompleted: false, priority: 'high', listId: '1' },
      { id: '3', title: 'Update documentation', description: 'Update project README', dueDate: '', dueTime: '', isCompleted: true, priority: 'medium', listId: '1' },
      { id: '4', title: 'Code review', description: 'Review PR #123', dueDate: '', dueTime: '', isCompleted: false, priority: 'medium', listId: '1' },
    ],
  },
  {
    id: '2',
    name: 'Pending Tasks - Sortly',
    color: '#007AFF',
    icon: 'desktop-outline',
    tasks: [],
  },
  {
    id: '3',
    name: 'Pending Tasks',
    color: '#FF3B30',
    icon: 'time',
    tasks: [
      { id: '1', title: 'Buy groceries', description: 'Milk, eggs, bread', dueDate: '', dueTime: '', isCompleted: false, priority: 'low', listId: '3' },
      { id: '2', title: 'Call dentist', description: 'Schedule appointment', dueDate: '', dueTime: '', isCompleted: false, priority: 'medium', listId: '3' },
      { id: '3', title: 'Pay bills', description: 'Electricity and water', dueDate: '', dueTime: '', isCompleted: true, priority: 'high', listId: '3' },
      { id: '4', title: 'Car maintenance', description: 'Oil change', dueDate: '', dueTime: '', isCompleted: false, priority: 'medium', listId: '3' },
      { id: '5', title: 'Laundry', description: 'Wash clothes', dueDate: '', dueTime: '', isCompleted: false, priority: 'low', listId: '3' },
      { id: '6', title: 'Plan weekend trip', description: 'Book hotel and flights', dueDate: '', dueTime: '', isCompleted: false, priority: 'low', listId: '3' },
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
