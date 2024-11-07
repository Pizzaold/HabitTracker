// /hooks/useAppData.ts
import { useState, useEffect, useCallback } from 'react';
import { AppData, Habit, Todo, Reward } from '@/app/interface';
import * as Utils from '@/app/utility';

const DEFAULT_DATA: AppData = {
  habits: {},
  todo: {},
  reward: {},
  points: 0,
};

export function useAppData() {
  const [appData, setAppData] = useState<AppData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    const data = await Utils.getStoredData();
    const initialData = data || DEFAULT_DATA;
    
    const updatedData = await Utils.checkAndResetHabits(initialData);
    setAppData(updatedData);
    setIsLoading(false);
  }, []);


  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updatePoints = async (delta: number) => {
    const newPoints = appData.points + delta;
    const updatedData = await Utils.updatePoints(appData, newPoints);
    setAppData(updatedData);
    return updatedData;
  };

  const deleteHabit = async (habit: Habit) => {
    try {
      const updatedData = await Utils.deleteHabit(appData, habit.id!);
      setAppData(updatedData);
      return true;
    } catch (error) {
      console.error('Error deleting habit:', error);
      return false;
    }
  };

  const deleteTodo = async (todo: Todo) => {
    try {
      const updatedData = await Utils.deleteTodo(appData, todo.id!);
      setAppData(updatedData);
      return true;
    } catch (error) {
      console.error('Error deleting todo:', error);
      return false;
    }
  };

  const deleteReward = async (reward: Reward) => {
    try {
      const updatedData = await Utils.deleteReward(appData, reward.id!);
      setAppData(updatedData);
      return true;
    } catch (error) {
      console.error('Error deleting reward:', error);
      return false;
    }
  };

  const updateHabit = async (habit: Habit, isSystemUpdate: boolean = false) => {
    const wasCompletedBefore = appData.habits[habit.id!]?.done || false;
    const isCompletingNow = !wasCompletedBefore && habit.done;
    const isUserUncompletingNow = !isSystemUpdate && wasCompletedBefore && !habit.done;

    let updatedData = await Utils.updateHabit(appData, habit);
    
    if (isCompletingNow) {
        updatedData = await Utils.updatePoints(updatedData, updatedData.points + habit.points);
    } else if (isUserUncompletingNow) {
        updatedData = await Utils.updatePoints(updatedData, updatedData.points - habit.points);
    }
    
    setAppData(updatedData);
    return updatedData;
  };

  const updateReward = async (reward: Reward) => {
    try {
      const updatedData = await Utils.updateReward(appData, reward);
      setAppData(updatedData);
      return updatedData;
    } catch (error) {
      console.error('Error updating reward:', error);
      throw error;
    }
  };

  const updateTodo = async (todo: Todo) => {
    const wasCompletedBefore = appData.todo[todo.id!]?.done || false;
    const isCompletingNow = !wasCompletedBefore && todo.done;
    const isUncompletingNow = wasCompletedBefore && !todo.done;

    let updatedData = await Utils.updateTodo(appData, todo);
    

    if (isCompletingNow) {
      updatedData = await Utils.updatePoints(updatedData, updatedData.points + todo.points);
    } else if (isUncompletingNow) {
      updatedData = await Utils.updatePoints(updatedData, updatedData.points - todo.points);
    }
    
    setAppData(updatedData);
    return updatedData;
  };

  const claimReward = async (reward: Reward) => {
    if (appData.points >= reward.points) {
      const updatedData = await Utils.updatePoints(appData, appData.points - reward.points);
      setAppData(updatedData);
      return true;
    }
    return false;
  };

  const addHabit = async (habit: Omit<Habit, 'id'>) => {
    try {
      const currentData = {
        ...appData,
        habits: appData.habits || {},
      };
      const updatedData = await Utils.addHabit(currentData, habit);
      setAppData(updatedData);
      return true;
    } catch (error) {
      console.error('Error adding habit:', error);
      return false;
    }
  };

  const addTodo = async (todo: Omit<Todo, 'id'>) => {
    try {
      const currentData = {
        ...appData,
        todo: appData.todo || {},
      };
      const updatedData = await Utils.addTodo(currentData, todo);
      setAppData(updatedData);
      return true;
    } catch (error) {
      console.error('Error adding todo:', error);
      return false;
    }
  };

  const addReward = async (reward: Omit<Reward, 'id'>) => {
    try {
      const currentData = {
        ...appData,
        reward: appData.reward || {},
      };
      const updatedData = await Utils.addReward(currentData, reward);
      setAppData(updatedData);
      return true;
    } catch (error) {
      console.error('Error adding reward:', error);
      return false;
    }
  };

  return {
    appData,
    isLoading,
    refreshData,
    updatePoints,
    addHabit,
    updateHabit,
    deleteHabit,
    addTodo,
    updateTodo,
    deleteTodo,
    addReward,
    deleteReward,
    claimReward,
    updateReward
  };
}