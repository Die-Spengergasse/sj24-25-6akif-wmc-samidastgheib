import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="(categories)" 
        options={{ 
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="about" 
        options={{ 
          title: 'About',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" color={color} size={size} />
          ),
        }} 
      />
    </Tabs>
  );

  <Tabs.Screen
  name="(todoItems)"
  options={{
    title: "Todo Items",
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="list-outline" size={size} color={color} />
    ),
  }}
/>
}
