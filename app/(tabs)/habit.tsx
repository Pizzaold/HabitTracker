// /app/(tabs)/habit.tsx
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Habit } from "../interface";
import styles from "../style";
import { AddNewButton } from "@/components/AddNewButton";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppData } from "@/hooks/useAppData";
import { useBackgroundTasks } from "@/hooks/useBackgroundTasks";
import React from "react";
import * as Utils from '@/app/utility';
import { ReorderableList } from '@/components/ReorderableList';
import { EditModalForm } from "../editModelForm";

const HabitScreen = () => {
  const { appData, isLoading, updateHabit, deleteHabit, refreshData } = useAppData();
  const { registerBackgroundTasks } = useBackgroundTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  useEffect(() => {
    registerBackgroundTasks();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [])
  );

  const handleToggleHabit = async (habit: Habit) => {
    try {
      const now = new Date();
  
      if (!habit.done) {
        const newCurrentStreak = habit.currentStreak + 1;
        await updateHabit({
          ...habit,
          done: true,
          currentStreak: newCurrentStreak,
          maxStreak:
            newCurrentStreak > habit.maxStreak
              ? newCurrentStreak
              : habit.maxStreak,
          lastCompletedDate: now.toISOString(),
        });
      } else {
        await updateHabit({
          ...habit,
          done: false,
          currentStreak: habit.currentStreak - 1,
          maxStreak: habit.maxStreak,
          lastCompletedDate: undefined,
        });
      }
    } catch (error) {
      console.error("Error updating habit:", error);
      Alert.alert("Error", "Failed to update habit");
    }
  };


  const handleLongPress = (habit: Habit) => {
    setSelectedHabit(habit);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (updatedHabit: Habit) => {
    try {
      await updateHabit(updatedHabit);
    } catch (error) {
      console.error('Error updating habit:', error);
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  const handleDelete = async (habit: Habit) => {
    setIsDeleting(true);
    try {
      const success = await deleteHabit(habit);
      if (!success) {
        Alert.alert('Error', 'Failed to delete habit');
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      Alert.alert('Error', 'Failed to delete habit');
    }
    setIsDeleting(false);
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    try {
      const reorderedHabits = await Utils.reorderItems(appData.habits, fromIndex, toIndex);
      const updatedData = {
        ...appData,
        habits: reorderedHabits,
      };
      await Utils.saveData(updatedData);
      refreshData();
    } catch (error) {
      console.error('Error reordering habits:', error);
      Alert.alert('Error', 'Failed to reorder habits');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index > 0) {
      await handleReorder(index, index - 1);
    }
  };
  
  const handleMoveDown = async (index: number) => {
    const habits = Object.values(appData.habits);
    if (index < habits.length - 1) {
      await handleReorder(index, index + 1);
    }
  };  

  const renderHabitItem = (habit: Habit) => (
    <View
      style={[
        styles.card,
        habit.done && { backgroundColor: "#f0f0f0" },
        { marginBottom: 0 }
      ]}
    >
      <TouchableOpacity
        onPress={() => handleToggleHabit(habit)}
        onLongPress={() => handleLongPress(habit)}
        delayLongPress={500}
        activeOpacity={0.7}
        style={{ flex: 1 }}
      >
        <Text
          style={[
            styles.title,
            habit.done && { textDecorationLine: "line-through" },
          ]}
        >
          {habit.name}
        </Text>
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>
            {habit.currentStreak}{" "}
            {habit.frequency === "weekly" ? "week" : "day"} streak
          </Text>
          <Text style={styles.highStreakText}>
            Highest: {habit.maxStreak}{" "}
            {habit.frequency === "weekly" ? "weeks" : "days"}
          </Text>
        </View>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>{habit.points} pts</Text>
        </View>
      </TouchableOpacity>
    </View>
  );  

  if (isLoading || isDeleting) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Habits</Text>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{appData.points} pts</Text>
          </View>
        </View>
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Habits</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>{appData.points} pts</Text>
        </View>
      </View>
      <View style={styles.container}>
        {!appData?.habits || Object.keys(appData.habits).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Make your first habit!</Text>
          </View>
        ) : (
        <ScrollView>
          <ReorderableList
            data={Object.values(appData.habits).sort((a, b) => a.order - b.order)}
            renderItem={renderHabitItem}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
          />
        </ScrollView>
        )}
      </View>
      <AddNewButton
        onPress={() =>
          router.push({
            pathname: "/form",
            params: { type: "habit" },
          })
        }
      />
      {selectedHabit && (
        <EditModalForm
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedHabit(null);
          }}
          onSave={(item) => handleSaveEdit(item as Habit)}
          onDelete={(item) => handleDelete(item as Habit)}
          item={selectedHabit}
          type="habit"
        />
      )}
    </SafeAreaView>
  );
};

export default HabitScreen;
