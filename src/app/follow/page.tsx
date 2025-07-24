import {Suspense} from "react";
import UserFollowPage from "@/components/Admin/UserFollowPage";

export default function FollowPage(){
    return(
        <Suspense>
            <UserFollowPage/>
        </Suspense>)
}