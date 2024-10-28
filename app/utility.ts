// /app/utility.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, Habit, Todo, Reward } from './interface';

const STORAGE_KEY = 'app_data';

export const getStoredData = async (): Promise<AppData | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) {
            const data = JSON.parse(jsonValue);
            if (data.todo) {
                Object.values(data.todo).forEach((value) => {
                    const todo = value as Todo;
                    todo.when_made = new Date(todo.when_made);
                    todo.when_do = new Date(todo.when_do);
                });
            }
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error reading data:', error);
        return null;
    }
};

export const saveData = async (data: AppData): Promise<boolean> => {
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
};

export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

export const reorderItems = async <T extends { id?: string; order: number }>(
    data: Record<string, T>,
    fromIndex: number,
    toIndex: number
  ): Promise<Record<string, T>> => {
    const items = Object.values(data).sort((a, b) => a.order - b.order);
    const [movedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, movedItem);
    
    const updatedData: Record<string, T> = {};
    items.forEach((item, index) => {
      if (item.id) {
        updatedData[item.id] = {
          ...item,
          order: index,
        };
      }
    });
    
    return updatedData;
  };
  
  export const addHabit = async (data: AppData, habit: Omit<Habit, 'id' | 'order'>): Promise<AppData> => {
    const newData = { ...data };
    const id = generateId();
    const order = Object.keys(newData.habits).length;
    newData.habits[id] = { ...habit, id, order };
    await saveData(newData);
    return newData;
  };
  
  export const addTodo = async (data: AppData, todo: Omit<Todo, 'id' | 'order'>): Promise<AppData> => {
    const newData = { ...data };
    const id = generateId();
    const order = Object.keys(newData.todo).length;
    newData.todo[id] = { ...todo, id, order };
    await saveData(newData);
    return newData;
  };
  
  export const addReward = async (data: AppData, reward: Omit<Reward, 'id' | 'order'>): Promise<AppData> => {
    const newData = { ...data };
    const id = generateId();
    const order = Object.keys(newData.reward).length;
    newData.reward[id] = { ...reward, id, order };
    await saveData(newData);
    return newData;
  };

export const updateHabit = async (data: AppData, habit: Habit): Promise<AppData> => {
    if (!habit.id) throw new Error('Habit ID is required for update');
    const newData = { ...data };
    newData.habits[habit.id] = habit;
    await saveData(newData);
    return newData;
};

export const updateTodo = async (data: AppData, todo: Todo): Promise<AppData> => {
    if (!todo.id) throw new Error('Todo ID is required for update');
    const newData = { ...data };
    newData.todo[todo.id] = todo;
    await saveData(newData);
    return newData;
};

export const updateReward = async (data: AppData, reward: Reward): Promise<AppData> => {
    if (!reward.id) throw new Error('Reward ID is required for update');
    const newData = { ...data };
    newData.reward[reward.id] = reward;
    await saveData(newData);
    return newData;
};

export const deleteHabit = async (data: AppData, id: string): Promise<AppData> => {
    const newData = { ...data };
    delete newData.habits[id];
    await saveData(newData);
    return newData;
};

export const deleteTodo = async (data: AppData, id: string): Promise<AppData> => {
    const newData = { ...data };
    delete newData.todo[id];
    await saveData(newData);
    return newData;
};

export const deleteReward = async (data: AppData, id: string): Promise<AppData> => {
    const newData = { ...data };
    delete newData.reward[id];
    await saveData(newData);
    return newData;
};

export const updatePoints = async (data: AppData, points: number): Promise<AppData> => {
    const newData = { ...data };
    newData.points = points;
    await saveData(newData);
    return newData;
};