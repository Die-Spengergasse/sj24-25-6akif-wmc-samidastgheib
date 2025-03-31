'use client';

import { act, useReducer, useState } from "react";
import { TodoItem } from "../types/TodoItem";
import { Category } from "../types/Category";
import styles from "./style.module.css";
import TodosDelete from "./TodosDelete";

type Props = {
    todoItems: TodoItem[];
    categories: Category[];
};

type TodosClientState =
    | { action: "" }
    | { action: "error"; error: string }
    | { action: "delete"; todoItem: TodoItem };

export type ReducerAction =
    | { intent: "" }
    | { intent: "delete"; todoItem: TodoItem }
    | { intent: "error"; error: string };

function reducer(state: TodosClientState, action: ReducerAction): TodosClientState {
    if (action.intent == "delete")
        return { action: "delete", todoItem: action.todoItem }
    if (action.intent == "error")
        return { action: "error", error: action.error }
    return { action: "" };
}
export default function TodosClient({ todoItems, categories }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [state, dispatcher] = useReducer(reducer, { action: "" });

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const filteredTodoItems = selectedCategory
        ? todoItems.filter(item => item.categoryName === selectedCategory)
        : todoItems;

    return (
        <div className={styles.categories}>
            <h1>Todo Liste</h1>
            {state.action == "error" &&
                <div className={styles.error}>
                    <p>Error: {state.error}</p>
                    <p onClick={() => dispatcher({ intent: "" })}>Gelesen</p>
                </div>}

            <select onChange={handleCategoryChange}>
                <option value="">Alle Kategorien</option>
                {categories.map(category => (
                    <option key={category.guid} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>

            <ul>
                {filteredTodoItems.map(item => (
                    <li
                        key={item.guid}
                        className={
                            new Date(item.dueDate) < new Date() ? styles.overdue : styles.onTime
                        }
                    >
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <p>Kategorie: {item.categoryName} (GUID {item.categoryGuid})</p>
                        <p>Fällig am: {new Date(item.dueDate).toLocaleDateString()}</p>
                        <p>Status: {item.isCompleted ? "Abgeschlossen" : "Ausstehend"}</p>
                        <span
                            onClick={() => dispatcher({ intent: "delete", todoItem: item })}
                            title="Delete"
                        >
                            🗑️
                        </span>
                    </li>
                ))}
            </ul>
            {state.action == "delete" && <TodosDelete todoItem={state.todoItem} dispatcher={dispatcher}></TodosDelete>}
        </div>
    );
}