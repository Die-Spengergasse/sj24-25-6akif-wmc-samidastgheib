"use client"
import { useEffect } from 'react';
import { useTodoAppState } from '@/app/context/TodoAppContext';


export default function Home() {
    
    const { activeUser, actions } = useTodoAppState();
        useEffect(() => {
        actions.setActiveUser('Max Mustermann');
    }, [actions]);

    return (
        <div className="home">
            <h1>Welcome to todo-app</h1>
            <p>
                Dies ist die Datei page.tsx. Sie wird geladen, wenn keine Route angegeben wird.
                Klicke auf einen Punkt im Menü.
            </p>
            <p>Aktiver Benutzer: {activeUser}</p>
            </div>
    );
}

