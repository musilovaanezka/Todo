"use server"

import { cookies } from 'next/headers';

export const Login = (userId : number) => {
    console.log(userId);
    cookies().set('token', userId.toString());
}

export const getToken = async () => {
    var token = cookies().get('token');
    if (token) {
        return token["value"];
    } else {
        return "";
    }
}