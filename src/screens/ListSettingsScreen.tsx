import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useReminders, ReminderList } from '../context/RemindersContext';

interface ListSettingsScreenProps {
  route: any;
  navigation: any;
}

export const ListSettingsScreen: React.FC<ListSettingsScreenProps> = ({ route, navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { lists, deleteList } = useReminders();
  const { listId } = route.params || {};

  const list = lists.find(l => l.id === listId);

  if (!list) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>List not found</Text>
      </View>
    );
  }

  const handleDeleteList = () => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${list.name}" and all its tasks?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteList(list.id);
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.settingItem}>
            <View style={[styles.colorPreview, { backgroundColor: list.color }]} />
            <View style={styles.settingText}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>List Name</Text>
              <Text style={[styles.settingValue, { color: '#8E8E93' }]}>{list.name}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: '#FF3B30' }]}
          onPress={handleDeleteList}
        >
          <Icon name="trash" size={18} color="#FFF" />
          <Text style={styles.deleteButtonText}>Delete List</Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
