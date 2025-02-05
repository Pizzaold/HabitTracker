// /app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="habit"
        options={{
          title: "Habits",
          tabBarIcon: ({ color }) => (
            <Feather size={28} name="check" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => (
            <Feather size={28} name="clipboard" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reward"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color }) => (
            <Feather size={28} name="gift" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}