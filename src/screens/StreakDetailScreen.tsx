import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useReminders } from '../context/RemindersContext';

const { width } = Dimensions.get('window');

const StreakDetailScreen = ({ route, navigation }: any) => {
  const { listId, taskId } = route.params;
  const colorScheme = useColorScheme();
  const { lists, toggleStreakDate } = useReminders();

  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#0a0a0a' : '#f8f8f8';
  const textColor = isDark ? '#fff' : '#000';
  const cardBackground = isDark ? '#1a1a1a' : '#fff';
  const borderColor = isDark ? '#333' : '#e0e0e0';
  const accentGreen = '#4CAF50';
  const accentOrange = '#FF9500';

  const list = lists.find(l => l.id === listId);
  const task = list?.tasks.find(t => t.id === taskId);

  // Set header title
  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Mark Your Progress',
      headerTitleStyle: { fontWeight: '600', fontSize: 18 },
    });
  }, [navigation]);

  const dateArray = useMemo(() => {
    if (!task?.streakStartDate) return [];

    const dates: string[] = [];
    const startDate = new Date(task.streakStartDate);
    const today = new Date();

    // Generate all dates from today back to streak start
    let currentDate = new Date(today);
    currentDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);

    while (currentDate >= startDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return dates;
  }, [task?.streakStartDate]);

  const completedDates = task?.completedDates || [];
  const completionPercentage = dateArray.length > 0 
    ? Math.round((completedDates.length / dateArray.length) * 100)
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const handleToggleDate = (date: string) => {
    toggleStreakDate(listId, taskId, date);
  };

  const renderDateItem = ({ item: date }: { item: string }) => {
    const isCompleted = completedDates.includes(date);
    const isToday = date === new Date().toISOString().split('T')[0];

    return (
      <TouchableOpacity
        onPress={() => handleToggleDate(date)}
        activeOpacity={0.7}
        style={[
          styles.dateCard,
          {
            backgroundColor: isCompleted ? accentGreen + '15' : cardBackground,
            borderColor: isToday ? accentOrange : (isCompleted ? accentGreen : borderColor),
            borderWidth: isToday ? 2 : 1,
          },
        ]}
      >
        <View style={styles.dateCardContent}>
          <View style={styles.dateInfo}>
            <Text
              style={[
                styles.datePrimary,
                {
                  color: textColor,
                  fontWeight: isToday ? '700' : (isCompleted ? '600' : '500'),
                },
              ]}
            >
              {formatDate(date)}
            </Text>
            <Text style={[styles.dateSecondary, { color: '#888' }]}>
              {getDayOfWeek(date)} • {date}
            </Text>
          </View>

          <View style={styles.checkboxContainer}>
            {isCompleted ? (
              <View
                style={[
                  styles.completedCheckbox,
                  { backgroundColor: accentGreen },
                ]}
              >
                <Icon name="checkmark" size={16} color="#fff" />
              </View>
            ) : (
              <View
                style={[
                  styles.emptyCheckbox,
                  {
                    backgroundColor: cardBackground,
                    borderColor: borderColor,
                  },
                ]}
              />
            )}
          </View>
        </View>
        {isToday && (
          <View style={styles.todayIndicator}>
            <Text style={styles.todayLabel}>TODAY</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={[styles.taskHeader, { backgroundColor: cardBackground }]}>
        <View style={styles.taskTitleContainer}>
          <Icon name="checkmark-circle-outline" size={28} color={accentGreen} />
          <Text style={[styles.mainTitle, { color: textColor }]}>{task?.title}</Text>
        </View>
        <Text style={[styles.taskDescription, { color: '#888' }]}>
          {task?.recurrence?.type ? 
            task.recurrence.type.charAt(0).toUpperCase() + task.recurrence.type.slice(1) 
            : 'One-time'
          }
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statBox, { backgroundColor: cardBackground }]}>
          <View style={styles.statContent}>
            <Icon name="flame" size={24} color={accentOrange} />
            <View style={styles.statTextContainer}>
              <Text style={[styles.statValue, { color: accentOrange }]}>
                {task?.currentStreak || 0}
              </Text>
              <Text style={[styles.statLabel, { color: '#888' }]}>Current</Text>
            </View>
          </View>
        </View>

        <View style={[styles.statBox, { backgroundColor: cardBackground }]}>
          <View style={styles.statContent}>
            <Icon name="trophy" size={24} color="#FFD700" />
            <View style={styles.statTextContainer}>
              <Text style={[styles.statValue, { color: '#FFD700' }]}>
                {task?.bestStreak || 0}
              </Text>
              <Text style={[styles.statLabel, { color: '#888' }]}>Best</Text>
            </View>
          </View>
        </View>

        <View style={[styles.statBox, { backgroundColor: cardBackground }]}>
          <View style={styles.statContent}>
            <Icon name="chart-pie" size={24} color={accentGreen} />
            <View style={styles.statTextContainer}>
              <Text style={[styles.statValue, { color: accentGreen }]}>
                {completionPercentage}%
              </Text>
              <Text style={[styles.statLabel, { color: '#888' }]}>Progress</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.progressContainer, { backgroundColor: cardBackground }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: textColor }]}>
            {completedDates.length} of {dateArray.length} completed
          </Text>
          <Text style={[styles.progressPercent, { color: accentGreen }]}>
            {completionPercentage}%
          </Text>
        </View>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: borderColor,
              overflow: 'hidden',
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: accentGreen,
                width: `${completionPercentage}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={dateArray}
        renderItem={renderDateItem}
        keyExtractor={(item) => item}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 30,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  taskHeader: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 12,
    flex: 1,
  },
  taskDescription: {
    fontSize: 13,
    marginLeft: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  progressContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  dateCard: {
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  dateCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInfo: {
    flex: 1,
    marginRight: 12,
  },
  datePrimary: {
    fontSize: 16,
    marginBottom: 4,
  },
  dateSecondary: {
    fontSize: 12,
  },
  checkboxContainer: {
    padding: 4,
  },
  completedCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
  },
  todayIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF9500',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  todayLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});

export default StreakDetailScreen;
