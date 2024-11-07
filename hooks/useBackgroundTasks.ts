// /hooks/useBackgroundTasks.ts
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { Habit } from "@/app/interface";
import * as Utils from "@/app/utility";

const HABIT_RESET_TASK = "HABIT_RESET_TASK";

TaskManager.defineTask(HABIT_RESET_TASK, async () => {
  try {
    const appData = await Utils.getStoredData();
    if (!appData) return BackgroundFetch.BackgroundFetchResult.NoData;

    const updatedData = await Utils.checkAndResetHabits(appData);
    if (updatedData !== appData) {
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
          minimumInterval: 60,
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
