'use client'
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

export default function UserFollowPage() {

    const searchParams = useSearchParams();
    const userId = searchParams.get('user_id');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async() =>{
            const res = await fetch('/api/user/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userId),
            })
            const user = await res.json();
            setUser(user.user);
        }

        fetchUser();

    },[userId])

    return(
        <div>
            <div>{userId}</div>
            {user &&
                <div>
                    <div>{user.name}</div>
                    <div>{user.email}</div>
                </div>
            }

        </div>
    )
}