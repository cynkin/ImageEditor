'use client'
import React from "react";

export default function Add(){

    const addUser = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;

        if(!name) return;
        await fetch('/api/user/add', {
            method: 'POST',
            body: JSON.stringify({name}),
        });
    }

    return(
        <div>
            <form onSubmit={addUser}>
            <input type="text" name="name" id="name" placeholder="Name"/>
            <button type="submit">Add</button>
            </form>
        </div>
    )
}