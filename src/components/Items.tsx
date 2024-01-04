"use client"
import { useState } from 'react';
import { getToken } from './loginCookies';

const Items = () => {
    const [tasks, setTasks] = useState([]);
    const token = getToken();
    console.log(token);
    const loadList = async () => {
        try {
          const response = await fetch('https://192.168.100.13:7270/api/users/items?'
              + new URLSearchParams({
                  userId: token
              }));
    
          console.log(response);
    
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setTasks(data);
          } else {
              console.error('Cannot load tasks');
          }
        } catch (error) {
            console.error('An error occurred while loading tasks', error);
        }
      }

    loadList();

    return (
        <ul>
            {tasks.map((task) => (
            <li key={task["id"]}>{task["name"]}</li>
            ))}
        </ul>
    );
}

export default Items;