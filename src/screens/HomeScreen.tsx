import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useReminders } from '../context/RemindersContext';

interface HomeScreenProps {
  navigation: any;
}

const colors = [
  '#4CD964', // Green
  '#007AFF', // Blue
  '#FF3B30', // Red
  '#FF9500', // Orange
  '#AF52DE', // Purple
  '#FF2D55', // Pink
  '#00C7BE', // Teal
  '#FFCC00', // Yellow
];

const icons = [
  'list',
  'star',
  'school',
  'briefcase',
  'cart',
  'heart',
  'home',
  'checkmark-done',
  'document',
  'camera',
  'music',
  'airplane',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { lists, addList, deleteList, editList, getTaskCount } = useReminders();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const [editingList, setEditingList] = useState<any>(null);

  const handleAddList = () => {
    if (!newListName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }
    addList(newListName, selectedColor, selectedIcon);
    setNewListName('');
    setSelectedColor(colors[0]);
    setSelectedIcon(icons[0]);
    setShowAddModal(false);
  };

  const handleEditList = () => {
    if (!newListName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }
    editList(editingList.id, newListName, selectedColor, selectedIcon);
    setNewListName('');
    setSelectedColor(colors[0]);
    setSelectedIcon(icons[0]);
    setShowEditModal(false);
    setEditingList(null);
  };

  const handleDeleteList = (listId: string, listName: string) => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${listName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteList(listId),
        },
      ]
    );
  };

  const openEditModal = (list: any) => {
    setEditingList(list);
    setNewListName(list.name);
    setSelectedColor(list.color);
    setSelectedIcon(list.icon);
    setShowEditModal(true);
  };

  const ListItem = ({ item }: { item: any }) => {
    const recurringTasksCount = item.tasks.filter(
      (t: any) => t.recurrence && t.recurrence.type !== 'none'
    ).length;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { list: item })}
        onLongPress={() => openEditModal(item)}
        style={[styles.listItem, { backgroundColor: theme.card }]}
      >
        <View style={styles.leftContent}>
          <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
            <Icon name={item.icon} size={20} color="#FFF" />
          </View>
          <View style={styles.textContent}>
            <Text style={[styles.listName, { color: theme.text }]}>{item.name}</Text>
            <View style={styles.listMeta}>
              <Text style={[styles.taskCount, { color: '#8E8E93' }]}>
                {getTaskCount(item.id)} task{getTaskCount(item.id) !== 1 ? 's' : ''}
              </Text>
              {recurringTasksCount > 0 && (
                <View style={[styles.recurringBadge, { backgroundColor: '#5AC8FA' }]}>
                  <Icon name="repeat" size={10} color="#FFF" />
                  <Text style={styles.recurringBadgeText}>{recurringTasksCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.rightContent}>
          <TouchableOpacity
            onPress={() => handleDeleteList(item.id, item.name)}
            style={styles.deleteButton}
          >
            <Icon name="trash" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Reminders</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Icon name="add-circle" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {lists.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="list" size={50} color="#C7C7CC" />
          <Text style={[styles.emptyStateText, { color: theme.text }]}>
            No lists yet
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: '#8E8E93' }]}>
            Create a new list to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={lists}
          renderItem={ListItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add List Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={[styles.modalButton, { color: '#007AFF' }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.text }]}>New List</Text>
              <TouchableOpacity onPress={handleAddList}>
                <Text style={[styles.modalButton, { color: '#007AFF', fontWeight: 'bold' }]}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {/* List Name Input */}
              <View style={styles.inputSection}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>List Name</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
                  placeholder="Enter list name"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#999'}
                  value={newListName}
                  onChangeText={setNewListName}
                />
              </View>

              {/* Color Selection */}
              <View style={styles.colorSection}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Color</Text>
                <View style={styles.colorGrid}>
                  {colors.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.colorOptionSelected,
                      ]}
                      onPress={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && (
                        <Icon name="checkmark" size={20} color="#FFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Icon Selection */}
              <View style={styles.iconSection}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Icon</Text>
                <View style={styles.iconGrid}>
                  {icons.map(icon => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconOption,
                        {
                          backgroundColor: selectedIcon === icon ? selectedColor + '30' : 'transparent',
                          borderColor: selectedIcon === icon ? selectedColor : theme.border,
                        },
                      ]}
                      onPress={() => setSelectedIcon(icon)}
                    >
                      <Icon
                        name={icon}
                        size={24}
                        color={selectedIcon === icon ? selectedColor : theme.text}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Preview */}
              <View style={styles.previewSection}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Preview</Text>
                <View style={[styles.previewItem, { backgroundColor: theme.bg }]}>
                  <View style={[styles.previewIcon, { backgroundColor: selectedColor }]}>
                    <Icon name={selectedIcon} size={24} color="#FFF" />
                  </View>
                  <Text style={[styles.previewText, { color: theme.text }]}>
                    {newListName || 'List Name'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit List Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={[styles.modalButton, { color: '#007AFF' }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Edit List</Text>
              <TouchableOpacity onPress={handleEditList}>
                <Text style={[styles.modalButton, { color: '#007AFF', fontWeight: 'bold' }]}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputSection}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>List Name</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
                  placeholder="Enter list name"
                  placeholderTextColor={isDarkMode ? '#8E8E93' : '#999'}
                  value={newListName}
                  onChangeText={setNewListName}
                />
              </View>

              <View style={styles.colorSection}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Color</Text>
                <View style={styles.colorGrid}>
                  {colors.map(color => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.colorOptionSelected,
                      ]}
                      onPress={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && (
                        <Icon name="checkmark" size={20} color="#FFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.iconSection}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Icon</Text>
                <View style={styles.iconGrid}>
                  {icons.map(icon => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconOption,
                        {
                          backgroundColor: selectedIcon === icon ? selectedColor + '30' : 'transparent',
                          borderColor: selectedIcon === icon ? selectedColor : theme.border,
                        },
                      ]}
                      onPress={() => setSelectedIcon(icon)}
                    >
                      <Icon
                        name={icon}
                        size={24}
                        color={selectedIcon === icon ? selectedColor : theme.text}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.previewSection}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Preview</Text>
                <View style={[styles.previewItem, { backgroundColor: theme.bg }]}>
                  <View style={[styles.previewIcon, { backgroundColor: selectedColor }]}>
                    <Icon name={selectedIcon} size={24} color="#FFF" />
                  </View>
                  <Text style={[styles.previewText, { color: theme.text }]}>
                    {newListName || 'List Name'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
