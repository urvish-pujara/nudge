import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useReminders } from '../context/RemindersContext';

export const StreaksScreen: React.FC<any> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { lists } = useReminders();

  const allTasks = lists.flatMap(l => (l.tasks || []).map(t => ({ ...t, listName: l.name, listId: l.id })));
  const streakTasks = allTasks.filter(t => t.streakEnabled);

  // Sort by current streak descending
  const sortedTasks = [...streakTasks].sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0));

  const getStreakColor = (streak: number) => {
    if (streak === 0) return '#FF9500';
    if (streak < 7) return '#FF9500';
    if (streak < 30) return '#4CAF50';
    return '#FFD700';
  };

  const renderItem = ({ item }: any) => {
    const current = item.currentStreak || 0;
    const best = item.bestStreak || 0;
    const streakColor = getStreakColor(current);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate('StreakDetail', { listId: item.listId, taskId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.taskTitle, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.taskMeta, { color: '#8E8E93' }]}>
              {item.listName} • {item.recurrence?.type || 'one-time'}
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#8E8E93" />
        </View>

        <View style={styles.streakContainer}>
          <View style={styles.streakBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Icon name="flame" size={20} color={streakColor} style={{ marginRight: 4 }} />
              <Text style={[styles.streakLabel, { color: theme.text }]}>Current</Text>
            </View>
            <Text style={[styles.streakNumber, { color: streakColor }]}>{current}</Text>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: streakColor,
                    width: `${Math.min((current / 30) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.streakBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Icon name="trophy" size={20} color="#FFD700" style={{ marginRight: 4 }} />
              <Text style={[styles.streakLabel, { color: theme.text }]}>Best</Text>
            </View>
            <Text style={[styles.streakNumber, { color: '#FFD700' }]}>{best}</Text>
          </View>

          {item.lastCompletedDate && (
            <View style={styles.streakBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Icon name="calendar" size={20} color="#5AC8FA" style={{ marginRight: 4 }} />
                <Text style={[styles.streakLabel, { color: theme.text }]}>Last</Text>
              </View>
              <Text style={[styles.streakValue, { color: '#5AC8FA' }]}>{item.lastCompletedDate}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Streaks</Text>
        <Icon name="flame" size={24} color="#FF9500" />
      </View>

      {streakTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="flame" size={50} color="#C7C7CC" />
          <Text style={[styles.emptyText, { color: theme.text }]}>No streaks yet</Text>
          <Text style={[styles.emptySubtext, { color: '#8E8E93' }]}>
            Enable streak tracking when creating a recurring task
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedTasks}
          keyExtractor={t => `${t.listId}-${t.id}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const lightTheme = { bg: '#F2F2F7', card: '#FFF', text: '#000', border: '#C6C6C8' };
const darkTheme = { bg: '#000', card: '#1C1C1E', text: '#FFF', border: '#38383A' };

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 32, fontWeight: 'bold' },
  listContent: { paddingHorizontal: 16, paddingVertical: 16 },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  taskTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  taskMeta: { fontSize: 12 },
  streakContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  streakBox: { flex: 1 },
  streakLabel: { fontSize: 12, fontWeight: '500' },
  streakNumber: { fontSize: 24, fontWeight: 'bold', marginBottom: 6 },
  streakValue: { fontSize: 14, fontWeight: '500' },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center' },
});
