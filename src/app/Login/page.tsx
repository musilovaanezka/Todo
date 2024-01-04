"use client"

import { Login } from "@/components/loginCookies";
import { useRouter } from "next/navigation";
import React, {useState} from "react";

const LoginPage = () =>  {
    const [username, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [error, setError] = useState("");

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch('https://192.168.100.13:7270/api/users/login?'
                + new URLSearchParams({
                    login: username, password: password
                }));
    
            if (response.ok) {
                const user = await response.json();
                Login(user["id"]);
                router.push("/");
            } else {
                setError("Login failed");
            }
        } catch (error) {
            console.error('An error occurred while login', error);
            setError("An error occurred while login");
        }
    }

    return (
        <main>
            <div className='flex flex-col items-center justify-between'>
                <h1>Login</h1>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <div>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name='username'
                                id="username"  
                                value={username}
                                onChange={(e) => setLogin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                name='password'
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Log In
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default LoginPage;