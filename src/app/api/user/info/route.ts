import {prisma} from "@/lib/db"
import {NextResponse} from "next/server";

export async function POST(req:Request) {
    const id = await req.json();
    console.log(id);
    // const {id} = body;
    // console.log(id);

    if(!id) {
        return NextResponse.json({error: "Missing data"}, {status:400});
    }

    const user = await prisma.user.findUnique({
        where:{id}
    })
    if(!user){
        return NextResponse.json({error: "User not Found!"}, {status:400});
    }
    return NextResponse.json({user}, {status:200});
}