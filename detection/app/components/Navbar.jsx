"use client";
import Link from "next/link";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
import CustomModal from "../utils/customModel";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HiOutlineUserCircle } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useLogout from "../hooks/auth/useLogout";
import useGetUser from "../hooks/auth/getUserDetails";
import { setLogin} from "../redux/features/authSlice";

const avatar = require("../../public/user1.png");

const Navbar = ({ open, setOpen, user, isAuth}) => {

    const [route, setRoute] = useState("Login");
    const [activationToken, setActivationToken] = useState("")

    const router = useRouter()
    const dispatch = useDispatch()

    const { getUser } = useGetUser();

    useEffect(() => {
        async function fetchData() {
            const res = await getUser();
            if (res[0] && res[1]?.user) {
                dispatch(setLogin(res[1].user));
            }
            else{
                router.push('/')
            }
        }
        !user && fetchData();
    }, [isAuth, user])


    const goToInnerPage = () => {
        if (!isAuth) {
            toast.error("Please Login to Proceed...")
            setOpen(true)
        } else {
            router.push('/prediction')
        }
    }

    const { logout } = useLogout();

    const logOutHandler = async (e) => {
        await logout()
    }

    return (
        <div className="relative w-full">
            <div className={`h-[80px] bg-white z-[1000] w-full shadow-[0_0_30px_0_rgba(156,51,83,.3)]`}>
                <div className="w-[98%] h-full py-2 m-auto 800px:w-[98%] box-border">
                    <div className="flex items-center justify-between w-full h-full 800px:justify-normal">
                        <Link href={'/'} className="self-center ml-3 500px:ml-5 700px:ml-10 ">
                            <Image priority className="w-[190px] m-0" alt='DermCure-Logo'
                                width={130} height={40}
                                src={require("../../public/logoo.png")}
                            />
                        </Link>
                        <div className="flex ml-auto mr-3 500px:mr-5 700px:mr-10">
                            <div onClick={goToInnerPage} className="hidden 700px:flex cursor-pointer justify-center items-center py-2
                                     mr-5 w-[200px] h-[40px] rounded-3xl text-[20px] font-[500] bg-[#9c3353] hover:bg-[#b8355c] text-white">
                                Upload Image
                            </div>
                            {
                                user ? (
                                    <div className="flex items-center">
                                        <Image
                                            width={30}
                                            height={30}
                                            src={user.avatar ? user.avatar : avatar}
                                            className={"hover:border-spacing-1 hover:border-2 hover:border-solid hover:border-[#9c3353] w-[40px] h-[40px] items-center text-center rounded-full 800px:mr-2 bg-[#f084a5] cursor-pointer block"}
                                            alt=""
                                        />
                                        <MdLogout
                                            className="m-2 text-[#9c3353] font-extrabold cursor-pointer"
                                            size={30}
                                            onClick={(e) => logOutHandler(e)}
                                        />
                                    </div>
                                ) : (
                                    <HiOutlineUserCircle
                                        size={45}
                                        className="800px:mr-2 text-[#9c3353] cursor-pointer block"
                                        onClick={() => setOpen(true)}
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            {route === "Login" && (
                <>
                    {open && (
                        <CustomModal
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            component={Login}
                        />
                    )}
                </>
            )}
            {route === "Sign-Up" && (
                <>
                    {open && (
                        <CustomModal
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            setActivationToken={setActivationToken}
                            component={SignUp}
                        />
                    )}
                </>
            )}
            {route === "Verification" && (
                <>
                    {open && (
                        <CustomModal
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            activationToken={activationToken}
                            component={Verification}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Navbar;
