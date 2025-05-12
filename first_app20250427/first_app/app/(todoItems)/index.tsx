import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { isErrorResponse } from "@/utils/apiClient";
import { TodoItem } from "@/types/TodoItem";
import { useCallback, useState } from "react";
import { getTodoItems } from "@/utils/todoItems/apiClient";
import { useFocusEffect } from "expo-router";
import { styles } from "@/utils/categories/index.styles";

export default function TodoItemsScreen() {
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

    useFocusEffect(
      useCallback(() => {
        loadTodoItems();
      }, [])
    );

  return (
    <View style={{ padding: 20 }}>
      <Text>Todo Items Screen</Text>
      <FlatList
        data={todoItems}
        keyExtractor={(item) => item.guid.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );



  async function loadTodoItems() {
    console.log("Loading categories...");
    const response = await getTodoItems();
    if (isErrorResponse(response)) {
      console.error('Error fetching categories:', response.message);
      return;
    }
    setTodoItems(response);
  }
}