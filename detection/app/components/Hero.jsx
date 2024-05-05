'use client'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


const Hero = ({setOpen}) => {
    const isAuth = useSelector((state) => state.auth.isAuth)
    const router = useRouter()

    const goToInnerPage = () => {
        if (!isAuth) {
            toast.error("Please Login to Proceed...")
            setOpen(true)
        } else {
            router.push('/prediction')
        }
    }

    return (
        <>
            <div className="flex flex-col-reverse overflow-hidden 1000px:flex-row">
                <div className="pt-[10px] 1000px:w-[50%] 1000px:pt-[0] z-10 overflow-hidden">
                    <div className='text-center 1000px:text-left 1500px:w-[65%] 1100px:w-[85%] w-[90%] mx-auto 1100px:mr-[-75px] 1200px:mr-[-100px] mt-0 1000px:mt-[100px]'>
                        <div>
                            <Link href={'/'}>
                                <Image priority className="w-[300px] mx-auto 1000px:m-0" alt='DermCure-Logo'
                                    width={130} height={40}
                                    src={require("../../public/logoo.png")} />
                            </Link>
                            <p className='text-[#5d5d5d] font-[500] text-md 1000px:ml-[90px]'>Your Skin's Solution Starts Here!.</p>
                        </div>
                        <div>
                            <h3 className='mt-12 text-[22px] text-[#414040]'>Free Skin Disorder Detection</h3>
                        </div>
                        <div className='text-[#5d5d5d] font-[400] text-[16px] mt-2'>Upload your skin image and get instant results</div>
                        <div onClick={goToInnerPage} className='mx-auto 1000px:mr-0 cursor-pointer 1000px:ml-0 flex justify-center items-center my-6 w-[313px] h-[50px] rounded-3xl text-[20px] p-4 font-[500] bg-[#9c3353] hover:bg-[#b8355c] text-white'>
                            Get Started
                        </div>
                    </div>
                </div>
                <div className="w-[90%] overflow-hidden mx-auto z-[-10] 1000px:w-[50%] flex justify-center 1000px:mt-[-100px] mt-[10px]">
                    <div className="items-center">
                        <Image
                            src={require("../../public/bgImage.png")}
                            alt="Logo"
                            className="z-0 scale-[1.15] mt-4 h-[600px] w-auto mr-10"
                            priority
                        />
                    </div>
                </div>
            </div >
        </>
    );
};

export default Hero;
