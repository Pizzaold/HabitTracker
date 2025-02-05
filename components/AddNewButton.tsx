// /components/AddNewButton.tsx
import React from "react";
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from '@/app/style';

interface AddNewButtonProps {
    onPress: () => void
}

export const AddNewButton = ({ onPress }: AddNewButtonProps) => {
    return (
        <TouchableOpacity 
            style={styles.addButton}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Feather name='plus' size={24} color="#fff" />
        </TouchableOpacity>
    )
}