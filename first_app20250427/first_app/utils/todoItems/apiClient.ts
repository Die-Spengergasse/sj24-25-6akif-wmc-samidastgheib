import { TodoItem, isTodoItem } from "@/types/TodoItem";
import { axiosInstance, createErrorResponse, ErrorResponse } from "@/utils/apiClient";

export async function getTodoItems(): Promise<TodoItem[] | ErrorResponse> {
    try {
        const categoriesResponse = await axiosInstance.get<TodoItem[]>("https://localhost:5443/api/TodoItems?category=Work");
        console.log("getCategories");
        console.log(categoriesResponse);
        return categoriesResponse.data.filter(isTodoItem);
    }
    catch (e) {
        return createErrorResponse(e);
    }
}