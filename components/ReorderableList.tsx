// /components/ReorderableList.tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from '@/app/style';

interface ReorderableListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export function ReorderableList<T>({ 
  data, 
  renderItem, 
  onMoveUp, 
  onMoveDown 
}: ReorderableListProps<T>) {
  return (
    <View style={styles.listContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.reorderableItem}>
          <View style={styles.reorderControls}>
            <TouchableOpacity
              onPress={() => onMoveUp(index)}
              disabled={index === 0}
              style={[
                styles.reorderButton,
                index === 0 && styles.reorderButtonDisabled
              ]}
            >
              <Feather 
                name="chevron-up" 
                size={24} 
                color={index === 0 ? '#ccc' : '#666'} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onMoveDown(index)}
              disabled={index === data.length - 1}
              style={[
                styles.reorderButton,
                index === data.length - 1 && styles.reorderButtonDisabled
              ]}
            >
              <Feather 
                name="chevron-down" 
                size={24} 
                color={index === data.length - 1 ? '#ccc' : '#666'} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.reorderableItemContent}>
            {renderItem(item)}
          </View>
        </View>
      ))}
    </View>
  );
}