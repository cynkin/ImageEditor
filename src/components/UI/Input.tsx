'use client'
import React from "react";
import {useRouter} from "next/navigation";

const style = "w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"
export default function Input() {
    const router = useRouter();
    const [videoUrl, setVideoUrl] = React.useState<string | null>(null);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const code = formData.get("code");


        // if (!file || !file.type.startsWith('video/')) {
        //     alert('Please select a valid video file');
        //     return;
        // }
        //
        // const url = URL.createObjectURL(file);
        // setVideoUrl(url);


        // const res = await fetch("/api/upload", {
        //     method: "POST",
        //     body: formData
        // })
        //
        // if(!res.ok){
        //     console.log("ERROR");
        //     return;
        // }


        // // router.push("/room?code=" + code);
        router.push("/board?code=" + code);
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className="w-full mt-10" method="post" >
                <input type="text" autoComplete="off" name="code" placeholder="" className="placeholder:text-[#222] focus:outline-none focus:ring-2 focus:ring-[#1568e3] w-full border py-3.5 px-4 text-lg tracking-wide border-gray-400 rounded-lg"/>
                <button
                    type="submit"
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Upload
                </button>
            </form>

        </div>
    )
}