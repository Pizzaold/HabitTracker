// /app/(tabs)/reward.tsx
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { Reward } from "../interface";
import styles from "../style";
import { AddNewButton } from "@/components/AddNewButton";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppData } from "@/hooks/useAppData";
import React from "react";
import * as Utils from '@/app/utility';
import { ReorderableList } from '@/components/ReorderableList';

const RewardScreen = () => {
  const { appData, isLoading, deleteReward, claimReward, refreshData } = useAppData();
  const [isDeleting, setIsDeleting] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [])
  );

  const handleClaimReward = async (reward: Reward) => {
    try {
      const success = await claimReward(reward);
      if (success) {
        Alert.alert(
          'Reward Claimed!',
          `You have successfully claimed "${reward.name}". ${appData.points} points remaining.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Not enough points', 'You need more points to claim this reward.');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      Alert.alert('Error', 'Failed to claim reward');
    }
  };

  const handleLongPress = (reward: Reward) => {
    Alert.alert(
      "Delete Reward",
      `Are you sure you want to delete "${reward.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const success = await deleteReward(reward);
              if (!success) {
                Alert.alert('Error', 'Failed to delete reward');
              }
            } catch (error) {
              console.error('Error deleting reward:', error);
              Alert.alert('Error', 'Failed to delete reward');
            }
            setIsDeleting(false);
          }
        }
      ]
    );
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    try {
      const reorderedRewards = await Utils.reorderItems(appData.reward, fromIndex, toIndex);
      const updatedData = {
        ...appData,
        reward: reorderedRewards,
      };
      await Utils.saveData(updatedData);
      refreshData();
    } catch (error) {
      console.error('Error reordering rewards:', error);
      Alert.alert('Error', 'Failed to reorder rewards');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index > 0) {
      await handleReorder(index, index - 1);
    }
  };

  const handleMoveDown = async (index: number) => {
    const rewards = Object.values(appData.reward);
    if (index < rewards.length - 1) {
      await handleReorder(index, index + 1);
    }
  };

  const renderRewardItem = (reward: Reward) => (
    <View
      style={[
        styles.card,
        styles.rewardCard,
        { marginBottom: 0 }
      ]}
    >
      <TouchableOpacity
        onPress={() => handleClaimReward(reward)}
        onLongPress={() => handleLongPress(reward)}
        delayLongPress={500}
        activeOpacity={0.7}
        style={{ flex: 1 }}
      >
        <Text style={styles.title}>{reward.name}</Text>
        <Text style={[styles.pointsText, styles.rewardPoints]}>
          {reward.points} points needed
        </Text>
        {appData.points >= reward.points ? (
          <Text style={[styles.description, { color: 'green' }]}>Available to claim!</Text>
        ) : (
          <Text style={[styles.description, { color: 'red' }]}>
            Need {reward.points - appData.points} more points
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  if (isLoading || isDeleting) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Rewards</Text>
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
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>{appData.points} pts</Text>
        </View>
      </View>
      <View style={styles.container}>
        {!appData?.reward || Object.keys(appData.reward).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Add your first reward!</Text>
          </View>
        ) : (
          <ScrollView>
            <ReorderableList
              data={Object.values(appData.reward).sort((a, b) => a.order - b.order)}
              renderItem={renderRewardItem}
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
            params: { type: "reward" },
          })
        }
      />
    </SafeAreaView>
  );
};

export default RewardScreen;