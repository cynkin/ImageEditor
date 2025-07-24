'use client'
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {Ban, Plus, UserRound, UserRoundX} from "lucide-react";

export default function Users() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(true);


    useEffect(() => {
        const fetchUsers = async() =>{
            const res = await fetch('/api/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const users = await res.json();
            console.log(users);
            setUsers(users);
        }

        fetchUsers();
        setFetching(false);
    },[fetching])

    return (
        <div className="">
            <div className="bg-white rounded-2xl ml-10 p-5 mt-10 w-full mb-5 h-screen">
                <div className="text-gray-500 font-medium px-5 pt-3">Accounts</div>
                <div className="text-3xl font-medium ml-6 pb-5">Users</div>
                <div className="flex flex-col border-2 border-gray-700">
                    <div className="flex bg-gray-200 items-center  text-gray-700 font-semibold text-center">
                        <div className="w-3/12 py-2 border-r border-gray-800">Customer</div>
                        <div className="w-1/12 py-2 border-r border-gray-800">Role</div>
                        <div className="w-1/12 py-2 border-r border-gray-800">Balance</div>
                        <div className="w-1/12 py-2 border-r border-gray-800">Weeks</div>
                        <div className="w-4/12 py-2 border-r border-gray-800">USER ID</div>
                        <div className="w-2/12 py-2">Follow</div>
                    </div>

                    {users && users.map((user: any, index) => (
                        <div key={index} className={`flex text-sm ${user.id === id && 'bg-yellow-50'} text-gray-800 border-t border-gray-800 items-center text-center`}>
                            <div className="w-3/12 flex flex-col py-2 ">
                                <div className="font-bold">{user.name}</div>
                                <div className="text-gray-700">{user.email}</div>
                            </div>
                            <div className="w-1/12 py-2 px-2 flex items-center justify-center">
                                <div className={`bg-blue-700"  w-4 h-4 rounded-full mr-2`}></div>
                                <div>User</div>
                            </div>

                            <div className="w-1/12 py-2 ">&#8377; {0}</div>
                            <div className="w-1/12 py-2 ">{2}</div>
                            <Link href={"#"} className="w-4/12 hover:bg-black hover:text-white transition-all duration-300 py-2">{user.id}</Link>
                            <div className="w-2/12 flex px-15 flex-row justify-between transition-all duration-300  truncate">
                                <Link href={`/follow?user_id=${user.id}`} className="hover:bg-black hover:text-white transition-all duration-300">
                                    <Plus className=""/>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}