// /app/(tabs)/todo.tsx
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { Todo } from "../interface";
import styles from "../style";
import { AddNewButton } from "@/components/AddNewButton";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppData } from "@/hooks/useAppData";
import React from "react";
import * as Utils from '@/app/utility';
import { ReorderableList } from '@/components/ReorderableList';
import { EditModalForm } from "../editModelForm";

const TodoScreen = () => {
  const { appData, isLoading, updateTodo, deleteTodo, refreshData } = useAppData();
  const [isDeleting, setIsDeleting] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [])
  );

  const handleToggleTodo = async (todo: Todo) => {
    try {
      await updateTodo({
        ...todo,
        done: !todo.done
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleLongPress = (todo: Todo) => {
    setSelectedTodo(todo);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (updatedTodo: Todo) => {
    try {
      await updateTodo(updatedTodo);
    } catch (error) {
      console.error('Error updating todo:', error);
      Alert.alert('Error', 'Failed to update todo');
    }
  };
  
  const handleDelete = async (todo: Todo) => {
    setIsDeleting(true);
    try {
      const success = await deleteTodo(todo);
      if (!success) {
        Alert.alert('Error', 'Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      Alert.alert('Error', 'Failed to delete todo');
    }
    setIsDeleting(false);
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    try {
      const reorderedTodos = await Utils.reorderItems(appData.todo, fromIndex, toIndex);
      const updatedData = {
        ...appData,
        todo: reorderedTodos,
      };
      await Utils.saveData(updatedData);
      refreshData();
    } catch (error) {
      console.error('Error reordering todos:', error);
      Alert.alert('Error', 'Failed to reorder tasks');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index > 0) {
      await handleReorder(index, index - 1);
    }
  };

  const handleMoveDown = async (index: number) => {
    const todos = Object.values(appData.todo);
    if (index < todos.length - 1) {
      await handleReorder(index, index + 1);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderTodoItem = (todo: Todo) => (
    <View
      style={[
        styles.card,
        todo.done && { backgroundColor: '#f0f0f0' },
        { marginBottom: 0 }
      ]}
    >
      <TouchableOpacity
        onPress={() => handleToggleTodo(todo)}
        onLongPress={() => handleLongPress(todo)}
        delayLongPress={500}
        activeOpacity={0.7}
        style={{ flex: 1 }}
      >
        <Text
          style={[
            styles.title,
            todo.done && { textDecorationLine: 'line-through' }
          ]}
        >
          {todo.name}
        </Text>
        <Text style={styles.description}>{todo.description}</Text>
        <Text style={styles.dateText}>
          Due: {formatDate(todo.when_do)}
        </Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>{todo.points} pts</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (isLoading || isDeleting) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Tasks</Text>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{appData.points} pts</Text>
          </View>
        </View>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>{appData.points} pts</Text>
        </View>
      </View>
      <View style={styles.container}>
        {!appData?.todo || Object.keys(appData.todo).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Make your first task!</Text>
          </View>
        ) : (
          <ScrollView>
            <ReorderableList
              data={Object.values(appData.todo).sort((a, b) => a.order - b.order)}
              renderItem={renderTodoItem}
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
            params: { type: "todo" },
          })
        }
      />
      {selectedTodo && (
        <EditModalForm
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedTodo(null);
          }}
          onSave={(item) => handleSaveEdit(item as Todo)}
          onDelete={(item) => handleDelete(item as Todo)}
          item={selectedTodo}
          type="todo"
        />
      )}
    </SafeAreaView>
  );
};

export default TodoScreen;