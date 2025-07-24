import {Suspense} from "react";
import WhiteBoard from "@/components/Canvas/WhiteBoard";


export default function RoomPage() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
           <WhiteBoard/>
        </Suspense>
    )
}