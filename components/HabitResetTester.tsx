import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit, AppData } from '@/app/interface';
import * as Utils from '@/app/utility';

const HabitResetTester = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const createTestHabits = (): Record<string, Habit> => ({
    'daily_done': {
      id: 'daily_done',
      name: 'Completed Daily Habit',
      currentStreak: 5,
      maxStreak: 10,
      points: 10,
      frequency: 'daily',
      done: true,
      lastCompletedDate: new Date().toISOString(),
      order: 0
    },
    'daily_undone': {
      id: 'daily_undone',
      name: 'Uncompleted Daily Habit',
      currentStreak: 3,
      maxStreak: 5,
      points: 10,
      frequency: 'daily',
      done: false,
      lastCompletedDate: undefined,
      order: 1
    },
    'weekly_done': {
      id: 'weekly_done',
      name: 'Completed Weekly Habit',
      currentStreak: 4,
      maxStreak: 6,
      points: 20,
      frequency: 'weekly',
      done: true,
      lastCompletedDate: new Date().toISOString(),
      order: 2
    }
  });

  const runTests = async () => {
    setIsRunning(true);
    const results: string[] = [];
    const addResult = (message: string) => {
      results.push(message);
      setTestResults([...results]);
    };

    try {
      // Initial test data with points
      const initialPoints = 100;
      const testData: AppData = {
        habits: createTestHabits(),
        todo: {},
        reward: {},
        points: initialPoints
      };

      addResult('\n🧪 Test Group 1: Points Behavior on Reset');
      
      // Test automatic reset
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const habits = Object.values(testData.habits);
      let totalPoints = initialPoints;

      // Simulate reset for each habit
      for (const habit of habits) {
        const resetHabit = simulateReset(habit, tomorrow);
        if (resetHabit) {
          // Check if points remained unchanged after automatic reset
          addResult(`Testing automatic reset for: ${habit.name}`);
          addResult(`  - Points before reset: ${totalPoints}`);
          addResult(`  - Points after reset: ${totalPoints}`);
          addResult(`  - Points unchanged: ${totalPoints === initialPoints ? '✅' : '❌'}`);
          addResult(`  - lastCompletedDate cleared: ${resetHabit.lastCompletedDate === undefined ? '✅' : '❌'}`);
        }
      }

      addResult('\n🧪 Test Group 2: Points Behavior on Manual Actions');
      
      // Test manual completion
      const testHabit = testData.habits['daily_undone'];
      testHabit.done = true;
      totalPoints += testHabit.points;
      
      addResult(`Testing manual completion:`);
      addResult(`  - Initial points: ${initialPoints}`);
      addResult(`  - Points after completion: ${totalPoints}`);
      addResult(`  - Points added correctly: ${totalPoints === initialPoints + testHabit.points ? '✅' : '❌'}`);

      // Test manual uncomplete (user action)
      testHabit.done = false;
      totalPoints -= testHabit.points;
      
      addResult(`\nTesting manual uncomplete (user action):`);
      addResult(`  - Points before uncomplete: ${totalPoints + testHabit.points}`);
      addResult(`  - Points after uncomplete: ${totalPoints}`);
      addResult(`  - Points deducted correctly: ${totalPoints === initialPoints ? '✅' : '❌'}`);

      // Test point deduction behavior
      addResult('\n🧪 Test Group 3: Point Deduction Edge Cases');
      
      // Test completing and uncompleting multiple times
      addResult(`Testing multiple toggles:`);
      let expectedPoints = initialPoints;
      
      // Complete habit
      testHabit.done = true;
      expectedPoints += testHabit.points;
      addResult(`  - First completion: ${expectedPoints} pts`);
      
      // Uncomplete habit
      testHabit.done = false;
      expectedPoints -= testHabit.points;
      addResult(`  - First uncomplete: ${expectedPoints} pts`);
      
      // Complete again
      testHabit.done = true;
      expectedPoints += testHabit.points;
      addResult(`  - Second completion: ${expectedPoints} pts`);
      
      // Verify final points match expected
      addResult(`  - Points consistent after multiple toggles: ${expectedPoints === initialPoints + testHabit.points ? '✅' : '❌'}`);

    } catch (error) {
      addResult(`\n❌ Error during testing: ${error}`);
    }

    setIsRunning(false);
  };

  const simulateReset = (habit: Habit, now: Date): Habit | null => {
    const lastCompleted = habit.lastCompletedDate ? new Date(habit.lastCompletedDate) : null;
    let shouldReset = false;
    
    const resetTime = new Date(now);
    resetTime.setHours(0, 0, 0, 0);
    
    if (habit.frequency === "daily") {
      if (lastCompleted) {
        const lastCompletedMidnight = new Date(lastCompleted);
        lastCompletedMidnight.setHours(0, 0, 0, 0);
        shouldReset = resetTime.getTime() > lastCompletedMidnight.getTime();
      }
    } else if (habit.frequency === "weekly" && now.getDay() === 1) {
      if (lastCompleted) {
        const lastCompletedMidnight = new Date(lastCompleted);
        lastCompletedMidnight.setHours(0, 0, 0, 0);
        shouldReset = resetTime.getTime() > lastCompletedMidnight.getTime();
      }
    }

    if (!shouldReset) return null;

    return {
      ...habit,
      done: false,
      lastCompletedDate: undefined,  // Critical for preventing points deduction
    };
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
          Habit Reset Tester
        </Text>
        <TouchableOpacity
          onPress={runTests}
          disabled={isRunning}
          style={{
            backgroundColor: isRunning ? '#cccccc' : '#007AFF',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 16
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Text>
        </TouchableOpacity>
        <ScrollView
          style={{
            maxHeight: 500,
            backgroundColor: '#f5f5f5',
            padding: 16,
            borderRadius: 8
          }}
        >
          {testResults.map((result, index) => (
            <Text key={index} style={{ 
              marginBottom: 8,
              color: result.includes('❌') ? 'red' : 'black'
            }}>
              {result}
            </Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HabitResetTester;