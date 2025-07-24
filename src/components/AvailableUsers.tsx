'use client';

import {useEffect, useState} from "react";

export default function AvailableUsers() {
    const handleConnect = (id:any) => {
        console.log("Connect", id);
    }

    const [users, setUsers] = useState([]);



    useEffect(() => {
        const fetchUsers=async()=>{
            const res = await fetch("api/user/get", {
                method: "POST",
            })
            const users = await res.json();
            console.log(users.users);
            setUsers(users.users);
        }

        fetchUsers();
    }, []);

    return(
        <div className="m-5">
            {users && users.map((user: any, index) => (
                <div key={index} className="flex space-x-10">
                    <div>{user.name}</div>
                    <button className="text-blue-500" onClick={()=>handleConnect(user.id)}>Connect</button>
                </div>
            ))}
        </div>
    )
}