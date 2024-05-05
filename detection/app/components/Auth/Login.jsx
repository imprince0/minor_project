"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { setLogin } from "../../redux/features/authSlice";
import useLogin from "../../hooks/auth/useLogin";

const schema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email!")
        .required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!").min(8),
});

const Login = ({ setRoute, setOpen }) => {
    const [show, setShow] = useState(false);
    const { loading, login } = useLogin()
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            let result = await login({ email, password });
            if (result[0]) {
                dispatch(setLogin(result[1]));
                setOpen(false)
            }
        },
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className="w-full">
            <h1 className={"text-[25px] text-[#9c3353] font-[700] font-Poppins text-center py-2"}>Login with DermCure</h1>
            <br />
            <form onSubmit={handleSubmit}>
                <label className={`text-[16px] font-Poppins text-black`} htmlFor="email">
                    Enter your Email
                </label>
                <input
                    type="email"
                    name=""
                    value={values.email}
                    onChange={handleChange}
                    id="email"
                    placeholder="loginmail@gmail.com"
                    className={`${errors.email && touched.email && "border-red-500"} w-full text-black bg-transparent border rounded h-[40px] px-2 outline-none mt-[10px] font-Poppins`}
                />
                {errors.email && touched.email && (
                    <span className="block pt-2 text-red-500">{errors.email}</span>
                )}
                <div className="relative w-full mt-5 mb-1">
                    <label className={`text-[16px] font-Poppins text-black`} htmlFor="email">
                        Enter your password
                    </label>
                    <input
                        type={!show ? "password" : "text"}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        id="password"
                        placeholder="password!@%"
                        className={`${errors.password && touched.password && "border-red-500"} 
                        w-full text-black bg-transparent border rounded h-[40px] px-2 outline-none mt-[10px] font-Poppins`}
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
                    {errors.password && touched.password && (
                        <span className="block pt-2 text-red-500">{errors.password}</span>
                    )}
                </div>
                <div className="w-full mt-5">
                    <button disabled={loading} type="submit"
                        className={`flex flex-row justify-center items-center py-3 px-6 rounded-full cursor-pointer bg-[#9c3353] transition duration-300 text-white hover:shadow-[0_0_30px_0_rgba(156,51,83,.2)] hover:bg-[#f1547c] min-h-[45px] w-full text-[16px] font-Poppins font-semibold`}>
                            {loading ? "Processing..." : "Login"}
                    </button>
                </div>
                <br />
                <h5 className="text-center pt-4 font-Poppins text-[14px]">
                    Don't have an account?{" "}
                    <span
                        className="text-[#2190ff] pl-1 cursor-pointer"
                        onClick={() => setRoute("Sign-Up")}
                    >
                        Sign up
                    </span>
                </h5>
            </form>
            <br />
        </div>
    );
};

export default Login;