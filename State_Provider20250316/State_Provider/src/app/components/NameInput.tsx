// Plan to implement the required NameInput dialog logic:
// 
// - [x] Create `NameInput.tsx` in components folder using `ModalDialog`
// - [ ] Display the dialog when `activeUser === null`
// - [ ] Add NameInput component to `layout.tsx`
// - [ ] Update `TodoAppContext.tsx` to allow `activeUser: string | null`
// - [ ] Allow setting `activeUser` to `null` (unsubscribe)
// - [ ] Update Navbar in `layout.tsx` to show name or "Guest" and unsubscribe button
// - [ ] Hide Edit/Delete in `CategoryList.tsx` if no active user

// ✅ Step 1: Create `NameInput.tsx`

"use client";

import { useEffect, useRef, useState } from "react";
import ModalDialog from "@/app/components/ModalDialog";
import { useTodoAppState } from "@/app/context/TodoAppContext";
import styles from "../categories/CategoryAdd.module.css"; // Reuse form styles

export default function NameInput() {
  const { actions } = useTodoAppState();
  const [show, setShow] = useState(true);
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleOk = () => {
    const trimmedName = name.trim();
    if (trimmedName !== "") {
      actions.setActiveUser(trimmedName);
      setShow(false);
    } else {
      actions.setActiveUser("Guest");
      setShow(false);
    }
  };

  const handleCancel = () => {
    actions.setActiveUser("Guest");
    setShow(false);
  };

  if (!show) return null;

  return (
    <ModalDialog title="Welcome! Please enter your name:" onOk={handleOk} onCancel={handleCancel}>
      <div className={styles.categoryAdd}>
        <div>
          <div>Your Name</div>
          <div>
            <input
              type="text"
              name="name"
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
