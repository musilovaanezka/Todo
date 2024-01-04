"use client"
import { useState, useEffect } from "react";
import { getToken } from "@/components/loginCookies";
import API_URL from "../../../config";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const loadList = async () => {
            const cookie = await getToken();
            try {
                const response = await fetch(API_URL + '/items?'
                    + new URLSearchParams({
                        userId: cookie
                    }));
          
                if (response.ok) {
                  const data = await response.json();
                  console.log(data);
                  setTasks(data);
                } else {
                    console.error('vannot load tasks');
                }
            } catch (error) {
                console.error('An error occurred while loading tasks', error);
            }
        };
        loadList();
    }, []);

    return (
        <main>
            {tasks.map((task) => (
                <div key={task["task"]}>
                    {JSON.stringify(task)}
                </div>
            ))}
        </main>
    );
}

export default TaskList