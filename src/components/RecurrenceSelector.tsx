import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RecurrenceConfig, RecurrenceType, getRecurrenceDescription } from '../utils/recurrenceUtils';
import DateTimePicker from '@react-native-community/datetimepicker';

interface RecurrenceSelectorProps {
  value: RecurrenceConfig | undefined;
  onChange: (recurrence: RecurrenceConfig | undefined) => void;
  startDate?: string;
  isDarkMode: boolean;
  theme: any;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const RecurrenceSelector: React.FC<RecurrenceSelectorProps> = ({
  value,
  onChange,
  startDate = new Date().toISOString().split('T')[0],
  isDarkMode,
  theme,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState<RecurrenceType>(value?.type || 'none');
  const [selectedDays, setSelectedDays] = useState<number[]>(value?.daysOfWeek || [1, 2, 3, 4, 5]); // Mon-Fri default
  const [dayOfMonth, setDayOfMonth] = useState(value?.dayOfMonth?.toString() || '1');
  const [monthDay, setMonthDay] = useState<'first' | 'second' | 'third' | 'fourth' | 'last'>(
    value?.monthDay || 'first'
  );
  const [monthDayName, setMonthDayName] = useState(value?.monthDayName || 1); // Monday
  const [interval, setInterval] = useState(value?.interval?.toString() || '2');
  const [endDate, setEndDate] = useState(value?.endDate || '');
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleToggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const handleSave = () => {
    if (selectedType === 'none') {
      onChange(undefined);
    } else {
      const config: RecurrenceConfig = {
        type: selectedType,
        startDate,
      };

      switch (selectedType) {
        case 'daily':
          break;
        case 'weekly':
          config.daysOfWeek = selectedDays.length > 0 ? selectedDays : [1, 2, 3, 4, 5];
          break;
        case 'biweekly':
          config.daysOfWeek = selectedDays.length > 0 ? selectedDays : [1];
          config.interval = 2;
          break;
        case 'monthly':
          if (selectedType === 'monthly') {
            config.monthDay = monthDay;
            config.monthDayName = monthDayName;
          } else {
            config.dayOfMonth = parseInt(dayOfMonth, 10);
          }
          break;
        case 'custom':
          config.interval = parseInt(interval, 10) || 2;
          config.daysOfWeek = selectedDays.length > 0 ? selectedDays : [1, 2, 3, 4, 5];
          break;
      }

      if (endDate) {
        config.endDate = endDate;
      }

      onChange(config);
    }
    setShowModal(false);
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const currentRecurrence = value || { type: 'none' };
  const recurrenceText = getRecurrenceDescription(currentRecurrence);

  return (
    <View>
      <TouchableOpacity
        style={[styles.trigger, { backgroundColor: theme.card }]}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.triggerLeft}>
          <Icon name="repeat" size={18} color="#5AC8FA" />
          <Text style={[styles.triggerLabel, { color: theme.text }]}>Recurrence</Text>
        </View>
        <View style={styles.triggerRight}>
          <Text style={[styles.triggerValue, { color: theme.text }]}>{recurrenceText}</Text>
          <Icon name="chevron-forward" size={16} color="#C7C7CC" />
        </View>
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={[styles.modalButton, { color: '#007AFF' }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Recurrence</Text>
              <TouchableOpacity onPress={handleSave}>
                <Text style={[styles.modalButton, { color: '#007AFF', fontWeight: 'bold' }]}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Recurrence Type Selection */}
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Repeat</Text>
              <View style={[styles.optionGroup, { backgroundColor: theme.card }]}>
                {(['none', 'daily', 'weekly', 'biweekly', 'monthly', 'custom'] as RecurrenceType[]).map(
                  type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.option,
                        selectedType === type && styles.selectedOption,
                        { borderBottomColor: theme.border },
                      ]}
                      onPress={() => setSelectedType(type)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          { color: theme.text },
                          selectedType === type && styles.selectedOptionText,
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                      {selectedType === type && <Icon name="checkmark" size={20} color="#007AFF" />}
                    </TouchableOpacity>
                  )
                )}
              </View>

              {/* Weekly Days Selection */}
              {(selectedType === 'weekly' || selectedType === 'biweekly' || selectedType === 'custom') && (
                <>
                  <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>
                    Select Days
                  </Text>
                  <View style={styles.daysGrid}>
                    {dayNames.map((day, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dayButton,
                          selectedDays.includes(index) && styles.dayButtonSelected,
                          {
                            backgroundColor: selectedDays.includes(index) ? '#007AFF' : theme.card,
                            borderColor: '#C7C7CC',
                          },
                        ]}
                        onPress={() => handleToggleDay(index)}
                      >
                        <Text
                          style={[
                            styles.dayButtonText,
                            { color: selectedDays.includes(index) ? '#FFF' : theme.text },
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {/* Monthly Options */}
              {selectedType === 'monthly' && (
                <>
                  <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>
                    Monthly Pattern
                  </Text>

                  {/* Pattern Type Selection */}
                  <View style={styles.patternTypeGroup}>
                    <TouchableOpacity
                      style={[styles.patternTypeButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                      onPress={() => {}}
                    >
                      <Text style={[styles.patternTypeLabel, { color: theme.text }]}>
                        Specific Day Option
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Occurrence Selection */}
                  <Text style={[styles.subSectionTitle, { color: theme.text }]}>Recurrence</Text>
                  <View style={[styles.optionGroup, { backgroundColor: theme.card }]}>
                    {([
                      { key: 'first', label: '1st' },
                      { key: 'second', label: '2nd' },
                      { key: 'third', label: '3rd' },
                      { key: 'fourth', label: '4th' },
                      { key: 'last', label: 'Last' },
                    ] as { key: 'first' | 'second' | 'third' | 'fourth' | 'last'; label: string }[]).map(
                      opt => (
                        <TouchableOpacity
                          key={opt.key}
                          style={[
                            styles.option,
                            monthDay === opt.key && styles.selectedOption,
                            { borderBottomColor: theme.border },
                          ]}
                          onPress={() => setMonthDay(opt.key)}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              { color: theme.text },
                              monthDay === opt.key && styles.selectedOptionText,
                            ]}
                          >
                            {opt.label} occurrence
                          </Text>
                          {monthDay === opt.key && <Icon name="checkmark" size={20} color="#007AFF" />}
                        </TouchableOpacity>
                      )
                    )}
                  </View>

                  {/* Day Selection */}
                  <Text style={[styles.subSectionTitle, { color: theme.text }]}>Day</Text>
                  <View style={[styles.optionGroup, { backgroundColor: theme.card }]}>
                    {fullDayNames.map((day, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.option,
                          monthDayName === index && styles.selectedOption,
                          { borderBottomColor: theme.border },
                        ]}
                        onPress={() => setMonthDayName(index)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            { color: theme.text },
                            monthDayName === index && styles.selectedOptionText,
                          ]}
                        >
                          {day}
                        </Text>
                        {monthDayName === index && <Icon name="checkmark" size={20} color="#007AFF" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {/* Custom Interval */}
              {selectedType === 'custom' && (
                <>
                  <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>
                    Interval (Weeks)
                  </Text>
                  <View style={[styles.inputContainer, { borderColor: theme.border }]}>
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      keyboardType="number-pad"
                      placeholder="e.g., 2 for every 2 weeks"
                      placeholderTextColor={isDarkMode ? '#8E8E93' : '#999'}
                      value={interval}
                      onChangeText={setInterval}
                    />
                  </View>
                </>
              )}

              {/* End Date Options */}
              <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>
                End Recurrence
              </Text>
              <TouchableOpacity
                style={[styles.endDateButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Icon name="calendar" size={18} color="#FF9500" />
                <Text style={[styles.endDateText, { color: theme.text }]}>
                  {endDate ? new Date(endDate).toLocaleDateString() : 'No end date'}
                </Text>
              </TouchableOpacity>

              {/* Summary */}
              <View style={[styles.summary, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                <Text style={[styles.summaryText, { color: theme.text }]}>
                  {getRecurrenceDescription(
                    selectedType === 'none'
                      ? { type: 'none' }
                      : {
                          type: selectedType,
                          daysOfWeek:
                            selectedType !== 'monthly' && selectedDays.length > 0
                              ? selectedDays
                              : undefined,
                          monthDay: selectedType === 'monthly' ? monthDay : undefined,
                          monthDayName: selectedType === 'monthly' ? monthDayName : undefined,
                          interval: selectedType === 'custom' ? parseInt(interval, 10) : undefined,
                          startDate,
                          endDate: endDate || undefined,
                        }
                  )}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Picker for End Date */}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate ? new Date(endDate) : new Date()}
          mode="date"
          display="spinner"
          onChange={handleEndDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  triggerLabel: {
    fontSize: 16,
    marginLeft: 16,
  },
  triggerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  triggerValue: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: '500',
  },
  overlay: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 10,
  },
  optionGroup: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  selectedOption: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayButton: {
    width: '14%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 8,
  },
  dayButtonSelected: {
    borderWidth: 0,
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  patternTypeGroup: {
    marginBottom: 16,
  },
  patternTypeButton: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  patternTypeLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  input: {
    paddingVertical: 10,
    fontSize: 16,
  },
  endDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  endDateText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  summary: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
