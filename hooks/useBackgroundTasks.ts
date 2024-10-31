// /hooks/useBackgroundTasks.ts
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { Habit } from "@/app/interface";
import * as Utils from "@/app/utility";

const HABIT_RESET_TASK = "HABIT_RESET_TASK";

TaskManager.defineTask(HABIT_RESET_TASK, async () => {
  try {
    const now = new Date();
    const resetTime = new Date(now);
    resetTime.setHours(0, 0, 0, 0);

    const appData = await Utils.getStoredData();
    if (!appData?.habits) return BackgroundFetch.BackgroundFetchResult.NoData;

    let hasUpdates = false;
    const updatedHabits = { ...appData.habits };

    for (const habitId in updatedHabits) {
      const habit = updatedHabits[habitId];
      const lastCompleted = habit.lastCompletedDate
        ? new Date(habit.lastCompletedDate)
        : null;

      if (habit.frequency === "daily") {
        if (lastCompleted) {
          const lastCompletedMidnight = new Date(lastCompleted);
          lastCompletedMidnight.setHours(0, 0, 0, 0);

          if (resetTime.getTime() > lastCompletedMidnight.getTime()) {
            hasUpdates = true;
            updatedHabits[habitId] = {
              ...habit,
              done: false,
              lastCompletedDate: undefined,
            };
          }
        } else if (!lastCompleted) {
          updatedHabits[habitId] = {
            ...habit,
            currentStreak: 0,
          };
        }
      } else if (habit.frequency === "weekly" && now.getDay() === 1) {
        if (lastCompleted) {
          const lastCompletedMidnight = new Date(lastCompleted);
          lastCompletedMidnight.setHours(0, 0, 0, 0);

          if (resetTime.getTime() > lastCompletedMidnight.getTime()) {
            hasUpdates = true;
            updatedHabits[habitId] = {
              ...habit,
              done: false,
              lastCompletedDate: undefined,
            };
          }
        } else if (!lastCompleted) {
          updatedHabits[habitId] = {
            ...habit,
            currentStreak: 0,
          };
        }
      }
    }

    if (hasUpdates) {
      await Utils.saveData({
        ...appData,
        habits: updatedHabits,
      });
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error("Background task error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const useBackgroundTasks = () => {
  const registerBackgroundTasks = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        HABIT_RESET_TASK
      );

      if (!isRegistered) {
        await BackgroundFetch.registerTaskAsync(HABIT_RESET_TASK, {
          minimumInterval: 60 * 5,
          stopOnTerminate: false,
          startOnBoot: true,
        });
      }
    } catch (error) {
      console.error("Task registration failed:", error);
    }
  };

  const unregisterBackgroundTasks = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        HABIT_RESET_TASK
      );
      if (isRegistered) {
        await BackgroundFetch.unregisterTaskAsync(HABIT_RESET_TASK);
      }
    } catch (error) {
      console.error("Task unregistration failed:", error);
    }
  };

  return {
    registerBackgroundTasks,
    unregisterBackgroundTasks,
  };
};
