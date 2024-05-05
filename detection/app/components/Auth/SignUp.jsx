"use client";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub, AiOutlineCamera } from "react-icons/ai";
import useSignUp from "../../hooks/auth/useSignup";
import avatarIcon from "../../../public/user1.png"
import Image from "next/image";
import toast from "react-hot-toast";



const SignUp = ({ setRoute, setActivationToken }) => {
    const [show, setShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { loading, signUp } = useSignUp();

    // to set the selected image and to present its preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
    };
    

    // submission of details
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('avatar', selectedImage);
        formData.append('email', email);
        formData.append('password', password);

        if (formData.get("email").length === 0 || formData.get("password").length === 0) {
            toast.error("Please fill in all the fields")
            return;
        }
        if (formData.get("password").length < 8) {
            toast.error("Password must be at least 8 characters")
            return;
        }
        if (selectedImage === null) {
            toast.error("Please input an avatar")
            return;
        }

        // Send formData to the server for further processing
        let activationToken = await signUp(formData);
        if (activationToken === "") return;
        setActivationToken(activationToken)
        setRoute("Verification")
    };


    
    return (
        <div className="w-full">
            <h1 className={"text-[25px] text-[#9c3353] font-[700] font-Poppins text-center py-2"}>SignUp with DermCure</h1>
            <br />
            <form onSubmit={(e)=>handleSubmit(e)}>
                <div className="flex justify-center w-full ">
                    <div className="relative mb-2">
                        <Image
                            src={selectedImage ? URL.createObjectURL(selectedImage) : avatarIcon}
                            alt=""
                            width={100}
                            height={100}
                            className="w-[100px] h-[100px] text-black cursor-pointer border-[3px] border-[#9c3353] rounded-full"
                        />
                        <input
                            type="file"
                            name=""
                            id="avatar"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/png,image/jpg,image/jpeg,image/webp"
                        />
                        <label htmlFor="avatar">
                            <div className="w-[30px] text-white h-[30px] bg-[#9c3353] rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                                <AiOutlineCamera size={20} className="z-1" />
                            </div>
                        </label>
                    </div>
                </div>
                <div className="mb-3">
                    <label className={`text-[16px] font-Poppins text-black`} htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        name=""
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        id="email"
                        placeholder="loginmail@gmail.com"
                        className={`w-full text-black bg-transparent border rounded h-[40px] px-2 outline-none mt-[4px] font-Poppins`}
                    />
                </div>
                <div className="relative w-full mb-3">
                    <label className={`text-[16px] font-Poppins text-black`} htmlFor="email">
                        Password
                    </label>
                    <input
                        type={!show ? "password" : "text"}
                        name="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        id="password"
                        placeholder="password!@%"
                        className={`w-full text-black bg-transparent border rounded h-[40px] px-2 outline-none mt-[4px] font-Poppins`}
                    />
                    {!show ? (
                        <AiOutlineEyeInvisible
                            className="absolute cursor-pointer bottom-3 right-2 z-1"
                            size={20}
                            onClick={() => setShow(true)}
                        />
                    ) : (
                        <AiOutlineEye
                            className="absolute cursor-pointer bottom-3 right-2 z-1"
                            size={20}
                            onClick={() => setShow(false)}
                        />
                    )}
                </div>
                <div className="w-full mt-5">
                    <button disabled={loading} type="submit" className={`flex flex-row justify-center items-center py-3 px-6 rounded-full cursor-pointer bg-[#9c3353] transition duration-300 text-white hover:shadow-[0_0_30px_0_rgba(156,51,83,.2)] hover:bg-[#f1547c] min-h-[45px] w-full text-[16px] font-Poppins font-semibold`}>
                        {loading ? "Processing..." : "Sign Up" }
                    </button>
                </div>
                <h5 className="text-center pt-1 font-Poppins text-[14px]">
                    Already have an account?{" "}
                    <span
                        className="text-[#2190ff] pl-1 cursor-pointer"
                        onClick={() => setRoute("Login")}
                    >
                        {"Sign in"}
                    </span>
                </h5>
            </form>
        </div>
    );
};

export default SignUp;
