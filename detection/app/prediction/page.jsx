"use client"
import Heading from "../utils/Heading";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Detection from "../components/Detection";

export default function Prediction() {
    const [open, setOpen] = useState(false);

    // redux states
    const isAuth = useSelector((state) => state.auth.isAuth)
    const user = useSelector((state) => state.auth.user)


    return (
        <>
            <Heading
                title={"App"}
                description={"App"}
                keywords={"App"}
            />
            <Navbar
                open={open}
                setOpen={setOpen}
                user={user}
                isAuth={isAuth}
            />
            <Detection/>
        </>
    );
}
