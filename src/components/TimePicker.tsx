import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatTimeString, convertTo12Hour, validateTimePicker, isValidTimeFormat } from '../utils/validation';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  isDarkMode: boolean;
  theme: any;
  label?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  isDarkMode,
  theme,
  label = 'Time',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tempHours, setTempHours] = useState(0);
  const [tempMinutes, setTempMinutes] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [inputMode, setInputMode] = useState<'picker' | 'manual'>('picker');
  const [manualInput, setManualInput] = useState(value);
  const [error, setError] = useState<string>('');

  // Initialize state from value
  React.useEffect(() => {
    if (value && isValidTimeFormat(value)) {
      const parsed = convertTo12Hour(value);
      if (parsed) {
        setTempHours(parsed.hours);
        setTempMinutes(parsed.minutes);
        setPeriod(parsed.period);
      }
      setManualInput(value);
    } else if (value) {
      setManualInput(value);
      setError('Invalid time format');
    }
  }, [value, showModal]);

  const handleHourChange = (text: string) => {
    const num = parseInt(text, 10);
    if (!text) {
      setTempHours(0);
    } else if (!isNaN(num) && num >= 1 && num <= 12) {
      setTempHours(num);
      setError('');
    } else {
      setError('Hours must be 1-12');
    }
  };

  const handleMinuteChange = (text: string) => {
    const num = parseInt(text, 10);
    if (!text) {
      setTempMinutes(0);
    } else if (!isNaN(num) && num >= 0 && num <= 59) {
      setTempMinutes(num);
      setError('');
    } else {
      setError('Minutes must be 0-59');
    }
  };

  const handleManualInput = (text: string) => {
    setManualInput(text);
    if (isValidTimeFormat(text)) {
      setError('');
    } else if (text === '') {
      setError('');
    } else {
      setError('Format: HH:MM (24-hour)');
    }
  };

  const handleApply = () => {
    if (inputMode === 'picker') {
      // Validate picker input
      const validation = validateTimePicker(
        period === 'PM' && tempHours !== 12 ? tempHours + 12 : period === 'AM' && tempHours === 12 ? 0 : tempHours,
        tempMinutes
      );

      if (!validation.valid) {
        setError(validation.error || 'Invalid time');
        return;
      }

      let h = tempHours;
      if (period === 'PM' && h !== 12) {
        h += 12;
      } else if (period === 'AM' && h === 12) {
        h = 0;
      }
      const formattedTime = formatTimeString(h, tempMinutes);
      onChange(formattedTime);
    } else {
      // Validate manual input
      if (!isValidTimeFormat(manualInput)) {
        setError('Invalid format. Use HH:MM');
        return;
      }
      onChange(manualInput);
    }
    setError('');
    setShowModal(false);
  };

  const incrementHour = () => {
    const newHours = tempHours === 12 ? 1 : tempHours + 1;
    setTempHours(newHours);
  };

  const decrementHour = () => {
    const newHours = tempHours === 1 ? 12 : tempHours - 1;
    setTempHours(newHours);
  };

  const incrementMinute = () => {
    const newMinutes = tempMinutes === 59 ? 0 : tempMinutes + 1;
    setTempMinutes(newMinutes);
  };

  const decrementMinute = () => {
    const newMinutes = tempMinutes === 0 ? 59 : tempMinutes - 1;
    setTempMinutes(newMinutes);
  };

  // Quick time presets for common times
  const timePresets = [
    { label: '09:00 AM', time: '09:00' },
    { label: '12:00 PM', time: '12:00' },
    { label: '02:00 PM', time: '14:00' },
    { label: '05:00 PM', time: '17:00' },
    { label: '09:00 PM', time: '21:00' },
  ];

  const displayValue = value || 'No time set';

  return (
    <View>
      <TouchableOpacity
        style={[styles.trigger, { backgroundColor: theme.card }]}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.triggerLeft}>
          <Icon name="time" size={18} color="#5AC8FA" />
          <Text style={[styles.triggerLabel, { color: theme.text }]}>{label}</Text>
        </View>
        <View style={styles.triggerRight}>
          <Text style={[styles.triggerValue, { color: theme.text }]}>{displayValue}</Text>
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
              <Text style={[styles.modalTitle, { color: theme.text }]}>Set Time</Text>
              <TouchableOpacity onPress={handleApply}>
                <Text style={[styles.modalButton, { color: '#007AFF', fontWeight: 'bold' }]}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Mode Selection */}
              <View style={[styles.modeSelector, { backgroundColor: theme.bg }]}>
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    inputMode === 'picker' && styles.modeButtonActive,
                    { borderColor: theme.border },
                  ]}
                  onPress={() => {
                    setInputMode('picker');
                    setError('');
                  }}
                >
                  <Icon name="ellipse-oob" size={16} color={inputMode === 'picker' ? '#007AFF' : '#8E8E93'} />
                  <Text style={[styles.modeButtonText, { color: theme.text }]}>Picker</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    inputMode === 'manual' && styles.modeButtonActive,
                    { borderColor: theme.border },
                  ]}
                  onPress={() => {
                    setInputMode('manual');
                    setError('');
                  }}
                >
                  <Icon name="pencil" size={16} color={inputMode === 'manual' ? '#007AFF' : '#8E8E93'} />
                  <Text style={[styles.modeButtonText, { color: theme.text }]}>Manual</Text>
                </TouchableOpacity>
              </View>

              {/* Picker Mode */}
              {inputMode === 'picker' && (
                <>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>12-Hour Format</Text>

                  <View style={[styles.pickerContainer, { backgroundColor: theme.bg }]}>
                    {/* Hour Picker */}
                    <View style={styles.timeUnit}>
                      <TouchableOpacity onPress={incrementHour}>
                        <Icon name="chevron-up" size={24} color="#007AFF" />
                      </TouchableOpacity>

                      <View style={[styles.timeDisplay, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <TextInput
                          style={[styles.timeInput, { color: theme.text }]}
                          value={String(tempHours).padStart(2, '0')}
                          onChangeText={handleHourChange}
                          maxLength={2}
                          keyboardType="number-pad"
                          selectTextOnFocus
                        />
                      </View>

                      <TouchableOpacity onPress={decrementHour}>
                        <Icon name="chevron-down" size={24} color="#007AFF" />
                      </TouchableOpacity>
                    </View>

                    {/* Separator */}
                    <Text style={[styles.separator, { color: theme.text }]}>:</Text>

                    {/* Minute Picker */}
                    <View style={styles.timeUnit}>
                      <TouchableOpacity onPress={incrementMinute}>
                        <Icon name="chevron-up" size={24} color="#007AFF" />
                      </TouchableOpacity>

                      <View style={[styles.timeDisplay, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <TextInput
                          style={[styles.timeInput, { color: theme.text }]}
                          value={String(tempMinutes).padStart(2, '0')}
                          onChangeText={handleMinuteChange}
                          maxLength={2}
                          keyboardType="number-pad"
                          selectTextOnFocus
                        />
                      </View>

                      <TouchableOpacity onPress={decrementMinute}>
                        <Icon name="chevron-down" size={24} color="#007AFF" />
                      </TouchableOpacity>
                    </View>

                    {/* Period Selector */}
                    <View style={styles.periodSelector}>
                      <TouchableOpacity
                        style={[
                          styles.periodButton,
                          period === 'AM' && styles.periodButtonActive,
                          {
                            backgroundColor: period === 'AM' ? '#007AFF' : theme.bg,
                            borderColor: theme.border,
                          },
                        ]}
                        onPress={() => setPeriod('AM')}
                      >
                        <Text style={[styles.periodText, { color: period === 'AM' ? '#FFF' : theme.text }]}>
                          AM
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.periodButton,
                          period === 'PM' && styles.periodButtonActive,
                          {
                            backgroundColor: period === 'PM' ? '#007AFF' : theme.bg,
                            borderColor: theme.border,
                          },
                        ]}
                        onPress={() => setPeriod('PM')}
                      >
                        <Text style={[styles.periodText, { color: period === 'PM' ? '#FFF' : theme.text }]}>
                          PM
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Preview */}
                  <View style={[styles.preview, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                    <Text style={[styles.previewLabel, { color: '#8E8E93' }]}>24-Hour Format:</Text>
                    <Text style={[styles.previewTime, { color: theme.text }]}>
                      {formatTimeString(
                        period === 'PM' && tempHours !== 12 ? tempHours + 12 : period === 'AM' && tempHours === 12 ? 0 : tempHours,
                        tempMinutes
                      )}
                    </Text>
                  </View>
                </>
              )}

              {/* Manual Mode */}
              {inputMode === 'manual' && (
                <>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>24-Hour Format (HH:MM)</Text>

                  <View style={[styles.manualInputContainer, { borderColor: theme.border }]}>
                    <TextInput
                      style={[styles.manualInput, { color: theme.text }]}
                      placeholder="e.g., 14:30"
                      placeholderTextColor={isDarkMode ? '#8E8E93' : '#999'}
                      value={manualInput}
                      onChangeText={handleManualInput}
                      maxLength={5}
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>

                  <Text style={[styles.hint, { color: '#8E8E93' }]}>
                    Enter time in 24-hour format (00:00 - 23:59)
                  </Text>
                </>
              )}

              {/* Error Message */}
              {error && (
                <View style={[styles.errorBox, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
                  <Icon name="alert-circle" size={16} color="#FF3B30" />
                  <Text style={[styles.errorText, { color: '#FF3B30' }]}>{error}</Text>
                </View>
              )}

              {/* Quick Presets */}
              <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>Quick Presets</Text>
              <View style={styles.presetsGrid}>
                {timePresets.map((preset, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.presetButton, { backgroundColor: theme.bg, borderColor: theme.border }]}
                    onPress={() => {
                      setManualInput(preset.time);
                      onChange(preset.time);
                      setShowModal(false);
                    }}
                  >
                    <Text style={[styles.presetLabel, { color: theme.text }]}>{preset.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 4,
    borderRadius: 10,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  modeButtonActive: {
    borderWidth: 0,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingVertical: 20,
    borderRadius: 10,
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeDisplay: {
    width: 70,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  timeInput: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
  separator: {
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  periodSelector: {
    marginLeft: 12,
  },
  periodButton: {
    width: 50,
    paddingVertical: 8,
    marginVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodButtonActive: {
    borderWidth: 0,
  },
  periodText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  preview: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  previewTime: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  manualInputContainer: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  manualInput: {
    fontSize: 20,
    paddingVertical: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  presetButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
  },
  presetLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
