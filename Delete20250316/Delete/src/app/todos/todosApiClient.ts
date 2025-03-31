"use server";

import { revalidatePath } from "next/cache";
import { axiosInstance, createErrorResponse, ErrorResponse } from "../utils/apiClient";

export async function deleteTodoItem(guid: string, deleteTasks: boolean): Promise<ErrorResponse | undefined> {
    try {
        await axiosInstance.delete(`TodoItems/${guid}?deleteTasks=${deleteTasks}`);
        revalidatePath("/todos");
    } catch (e) {
        return createErrorResponse(e);
    }
}