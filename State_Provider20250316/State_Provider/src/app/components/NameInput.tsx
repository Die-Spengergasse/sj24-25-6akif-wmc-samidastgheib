"use client";

import { useState } from "react";
import ModalDialog from "./ModalDialog";
import { useTodoAppState } from "@/app/context/TodoAppContext";

export default function NameInput() {
    const { activeUser, actions } = useTodoAppState();
    const [name, setName] = useState("");

    if (activeUser !== null) return null;

    return (
        <ModalDialog
            title="Wie ist dein Name?"
            onOk={() => actions.setActiveUser(name.trim() === "" ? "Guest" : name.trim())}
            onCancel={() => actions.setActiveUser("Guest")}
        >
            <input
                type="text"
                placeholder="Dein Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "1rem",
                    borderRadius: "5px",
                    border: "1px solid #ccc"
                }}
            />
        </ModalDialog>
    );
}
