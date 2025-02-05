// /app/form.tsx
import React from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import styles from "./style";
import { Habit, Todo, Reward, FrequencyType } from "./interface";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useAppData } from "@/hooks/useAppData";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function FormScreen() {
  const { type } = useLocalSearchParams<{
    type: "habit" | "todo" | "reward";
  }>();
  const { addHabit, addTodo, addReward } = useAppData();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && type === "todo") {
      setFormData((prevFormData) => ({
        ...(prevFormData as Todo),
        when_do: selectedDate,
      }));
    }
  };

  const [formData, setFormData] = useState(() => {
    switch (type) {
      case "habit":
        return {
          name: "",
          currentStreak: 0,
          maxStreak: 0,
          points: 0,
          frequency: "daily" as FrequencyType,
          done: false,
        } as Habit;
      case "todo":
        return {
          name: "",
          description: "",
          points: 0,
          when_made: new Date(),
          when_do: new Date(),
          done: false,
        } as Todo;
      case "reward":
        return {
          name: "",
          description: "",
          points: 0,
        } as Reward;
      default:
        throw new Error("Invalid form type");
    }
  });

  const handleSubmit = async () => {
    try {
      if (!formData.name) {
        Alert.alert("Error", "Name is required");
        return;
      }

      switch (type) {
        case "habit":
          await addHabit(formData as Habit);
          break;
        case "todo":
          await addTodo(formData as Todo);
          break;
        case "reward":
          await addReward(formData as Reward);
          break;
      }

      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save item");
      console.error("Save error:", error);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        Add New {type.charAt(0).toUpperCase() + type.slice(1)}
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

      {(type === "todo" || type === "reward") && (
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

      {"points" in formData && (
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

      {type === "habit" && (
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Frequency</Text>
          <View style={styles.frequencySelector}>
            <TouchableOpacity
              style={[
                styles.frequencyOption,
                (formData as Habit).frequency === "daily" &&
                  styles.frequencyOptionSelected,
              ]}
              onPress={() => setFormData({ ...formData, frequency: "daily" })}
            >
              <Text
                style={[
                  styles.frequencyOptionText,
                  (formData as Habit).frequency === "daily" &&
                    styles.frequencyOptionTextSelected,
                ]}
              >
                Daily
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.frequencyOption,
                (formData as Habit).frequency === "weekly" &&
                  styles.frequencyOptionSelected,
              ]}
              onPress={() => setFormData({ ...formData, frequency: "weekly" })}
            >
              <Text
                style={[
                  styles.frequencyOptionText,
                  (formData as Habit).frequency === "weekly" &&
                    styles.frequencyOptionTextSelected,
                ]}
              >
                Weekly
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {type === "todo" && (
        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Due Date</Text>
          <TouchableOpacity
            style={styles.formInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{(formData as Todo).when_do.toLocaleDateString()}</Text>
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

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <Text style={styles.submitButtonText}>
          Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
