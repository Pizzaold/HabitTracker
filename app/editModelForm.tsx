import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '@/app/style';
import { Habit, Todo, Reward, FrequencyType } from '@/app/interface';

interface EditModalFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: Habit | Todo | Reward) => void;
  onDelete: (item: Habit | Todo | Reward) => void;
  item: Habit | Todo | Reward;
  type: 'habit' | 'todo' | 'reward';
}

const EditModalForm = ({
  visible,
  onClose,
  onSave,
  onDelete,
  item,
  type,
}: EditModalFormProps) => {
  const [formData, setFormData] = useState(item);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      `Are you sure you want to delete "${formData.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(formData);
            onClose();
          },
        },
      ]
    );
  };

  const handleSave = () => {
    if (!formData.name) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    onSave(formData);
    onClose();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && type === 'todo') {
      setFormData((prevFormData) => ({
        ...(prevFormData as Todo),
        when_do: selectedDate,
      }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.formTitle}>
              Edit {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Name</Text>
              <TextInput
                style={styles.formInput}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter name"
                placeholderTextColor="#999"
              />
            </View>

            {'description' in formData && (
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  value={(formData as Todo | Reward).description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                  multiline
                  numberOfLines={4}
                  placeholder="Enter description"
                  placeholderTextColor="#999"
                />
              </View>
            )}

            {'points' in formData && (
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Points</Text>
                <TextInput
                  style={[styles.formInput, styles.formNumberInput]}
                  value={formData.points.toString()}
                  onChangeText={(text) => {
                    const points = parseInt(text) || 0;
                    setFormData({ ...formData, points });
                  }}
                  keyboardType="numeric"
                  placeholder="Enter points"
                  placeholderTextColor="#999"
                />
              </View>
            )}

            {type === 'habit' && (
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Frequency</Text>
                <View style={styles.frequencySelector}>
                  <TouchableOpacity
                    style={[
                      styles.frequencyOption,
                      (formData as Habit).frequency === 'daily' &&
                        styles.frequencyOptionSelected,
                    ]}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        frequency: 'daily' as FrequencyType,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.frequencyOptionText,
                        (formData as Habit).frequency === 'daily' &&
                          styles.frequencyOptionTextSelected,
                      ]}
                    >
                      Daily
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.frequencyOption,
                      (formData as Habit).frequency === 'weekly' &&
                        styles.frequencyOptionSelected,
                    ]}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        frequency: 'weekly' as FrequencyType,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.frequencyOptionText,
                        (formData as Habit).frequency === 'weekly' &&
                          styles.frequencyOptionTextSelected,
                      ]}
                    >
                      Weekly
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {type === 'todo' && (
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Due Date</Text>
                <TouchableOpacity
                  style={styles.formInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>
                    {(formData as Todo).when_do.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={(formData as Todo).when_do}
                    mode="date"
                    onChange={onDateChange}
                  />
                )}
              </View>
            )}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EditModalForm;