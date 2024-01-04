"use client"
import { useState, useEffect } from "react";
import { getToken } from "@/components/loginCookies";
import API_URL from "../../../config";
import { redirect } from 'next/navigation';
import Link from "next/link";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [checkedTasks, setCheckedTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskDeadline, setNewTaskDeadline] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadList = async () => {
            const cookie = await getToken();
            try {
                const response = await fetch(API_URL + '/items?'
                    + new URLSearchParams({
                        userId: cookie,
                        isDone: "false"
                    }));
          
                if (response.ok) {
                  const data = await response.json();
                  setTasks(data);
                } else {
                    setError("Cannot load tasks");
                }
            } catch (error) {
                console.error('An error occurred while loading tasks', error);
                setError("Error while loading tasks");
            }
        };

        const loadChecked = async () => {
            const cookie = await getToken();
            try {
                const response = await fetch(API_URL + '/items?'
                    + new URLSearchParams({
                        userId: cookie,
                        isDone: "true"
                    }));
          
                if (response.ok) {
                  const data = await response.json();
                  setCheckedTasks(data);
                } else {
                    setError("Cannot load tasks");
                }
            } catch (error) {
                console.error('An error occurred while loading tasks', error);
                setError("Error while loading tasks");
            }
        }
        loadList();
        loadChecked();
    }, []);

    const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const cookie = await getToken();
        var deadline = null;
        if (newTaskDeadline) {
            deadline = newTaskDeadline
        }
        try {
            const newItem = {
                userId: cookie,
                name: newTaskName,
                createdDate: new Date(),
                deadline: deadline,
                checked: false
            };
            console.log(newItem);
            const response = await fetch(API_URL + '/items', {
               method: "POST",
               headers: {
                'Content-Type': 'application/json',
               },
               body: JSON.stringify(newItem),
            });

            if (response.ok) {
                const newTask = await response.json();
                setTasks([...tasks, newTask]);
                setNewTaskName("");
                setNewTaskDeadline("");
            } else {
                setError("Cannot add task");
            }
        } catch (error) {
            console.error("An error occurred while adding task", error);
            setError("Error while adding task");
        }
    };

    const handleEdit = async (taskId: number, newName: string, newDeadline: string, createdDate: string) => {
        const cookie = await getToken();
        try {
            const newItem = {
                id: taskId,
                userId: cookie,
                name: newName,
                createdDate: createdDate,
                deadline: newDeadline ?? null,
            };
            const response = await fetch(API_URL + '/items', {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (response.ok) {
                const updatedTasks = tasks.map((task) => 
                    task["id"] === taskId 
                    ? {
                        ...task,
                        name: newName,
                        deadline: newDeadline,
                    }
                    : task
                );
                setTasks(updatedTasks);
            } else {
                setError("Cannot edit task");
            }
        } catch (error) {
            console.error("An error occurred while updating task", error);
            setError("Error whole updating task");
        }
    };

    const handleDelete = async (taskId: number) => {
        try {
            const response = await fetch(API_URL + '/items/'
                + taskId.toString(), { method: 'DELETE' });

            if (response.ok) {
                setTasks(tasks.filter((task) => task["id"] !== taskId));
            } else {
                setError("Cannot delete task");
            }
        } catch (error) {
            console.error('An error occurred while loading tasks', error);
            setError("Error while deleting task");
        }
    };

    const handleCheck = async (taskId: number) => {
        try {
            const response = await fetch(API_URL + '/items/'
                + taskId.toString(), { method: 'PUT' });

            if (response.ok) {
                const checkedTask = tasks.find((task) => task["id"] === taskId);
                setCheckedTasks([...checkedTasks, checkedTask]);
                setTasks(tasks.filter((task) => task["id"] !== taskId));
            } else {
                setError("Cannot check task");
            }
        } catch (error) {
            console.error('An error occurred while checking task', error);
            setError("Error while checking task");
        }
    };

    const handleUncheck = async (taskId: number, newName: string, newDeadline: string, createdDate: string) => {
        const cookie = await getToken();
        try {
            const newItem = {
                id: taskId,
                userId: cookie,
                name: newName,
                createdDate: createdDate,
                deadline: newDeadline ?? null,
                checked: false
            };
            const response = await fetch(API_URL + '/items', {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (response.ok) {
                const uncheckedTask = checkedTasks.find((task) => task["id"] === taskId);
                setTasks([...tasks, uncheckedTask]);
                setCheckedTasks(checkedTasks.filter((task) => task["id"] !== taskId));
            } else {
                setError("Cannot uncheck task");
            }
        } catch (error) {
            console.error('An error occurred while unchecking task', error);
            setError("Error while unchecking task");
        }
    };

    const handleAlertClose = () => {
        setError("");
      };

    const handleShowJson = () => {
        redirect("/Json");
    }


    return (
        <main className="col-12">
            <div className='flex flex-col items-center justify-between'>
                <div className="col-12">

                    <h2 className="mb-3">Create a new task</h2>
                    <form onSubmit={handleAdd} className="mb-5">
                        <div className="row">
                            <div className="col-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    id="taskName"
                                    value={newTaskName}
                                    onChange={(e) => setNewTaskName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-3">
                                <label htmlFor="deadline" className="form-label">Deadline</label>
                                <input 
                                    type="date" 
                                    className="form-control"
                                    id="deadline"
                                    value={newTaskDeadline}
                                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                                />
                            </div>
                            <div className="col-2 mt-4">
                                <button type="submit" className="btn btn-primary mt-2">Add Task</button>
                            </div>
                        </div>
                    </form>

                    <h2 className="mb-2">Your Tasks</h2>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                            <button type="button" className="btn-close"></button>
                        </div>
                    )}
                    <div className="mt-2 mb-2">
                        <Link href="/Json">Show Tasks in JSON</Link>
                    </div>
                    <table className="table col-10">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Deadline</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task["id"]}>
                                    <td>{task["name"]}</td>
                                    <td>{task["deadline"] ? new Date(task["deadline"]).toLocaleDateString() : ""}</td>
                                    <td>
                                        <button 
                                            className="btn btn-warning mr-2"
                                            onClick={() => 
                                                handleEdit(
                                                    task["id"],
                                                    prompt("Enter task name", task["name"]),
                                                    prompt("Enter deadline", task["deadline"]),
                                                    task["createdDate"]
                                                )
                                            }
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button 
                                            className="btn btn-danger mr-2"
                                            onClick={() => 
                                                handleDelete(task["id"])
                                            }   
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                        <button 
                                            className="btn btn-success"
                                            onClick={() =>
                                                handleCheck(task["id"])
                                            }       
                                        >
                                            <i className="bi bi-check"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2 className="mb-2">Done Tasks</h2>
                    <table className="table col-10">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkedTasks.map((task) => (
                                <tr key={task["id"]}>
                                    <td>{task["name"]}</td>
                                    <td>
                                        <button 
                                            className="btn btn-info mr-2"
                                            onClick={() => 
                                                handleUncheck(
                                                    task["id"],
                                                    task["name"],
                                                    task["deadline"],
                                                    task["createdDate"]
                                                )
                                            }
                                        >
                                            <i className="bi bi-arrow-up"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

export default TaskList

// const Items = () => {
//     const [tasks, setTasks] = useState([]);
//     const token = getToken();
//     console.log(token);
//     const loadList = async () => {
//         try {
//           const response = await fetch('https://192.168.100.13:7270/api/users/items?'
//               + new URLSearchParams({
//                   userId: token
//               }));
    
//           console.log(response);
    
//           if (response.ok) {
//             const data = await response.json();
//             console.log(data);
//             setTasks(data);
//           } else {
//               console.error('Cannot load tasks');
//           }
//         } catch (error) {
//             console.error('An error occurred while loading tasks', error);
//         }
//       }

//     loadList();

//     return (
//         <ul>
//             {tasks.map((task) => (
//             <li key={task["id"]}>{task["name"]}</li>
//             ))}
//         </ul>
//     );
// }