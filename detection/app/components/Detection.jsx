import { useState } from "react";
import { FaCloudUploadAlt, FaFile } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import Image from "next/image";
import usePrediction from "../hooks/auth/usePrediction";
import CustomModal from "../utils/customModel";
import ResultTab from "./ReusltTab";

const Detection = () => {
    const [selectedImage, setSelectedImage] = useState(null)
    const [route, setRoute] = useState("Login")
    const [result, setResult] = useState(null)
    const [open, setOpen] = useState(false)
    const { loading, predict } = usePrediction()

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        console.log(file)
    }

    const getPrediction = async () => {
        setOpen(true);
        const formData = new FormData()
        formData.set('image', selectedImage)
        const gotResponse = await predict(formData)
        if (!gotResponse[0]) {
            setOpen(false);
            return
        }
        setResult(gotResponse[1])
    }

    return (
        <div className="relative w-full mt-5">
            <h1 className="font-bold [text-shadow:_0_2px_0_#9c3] text-center text-[40px] text-[#9c3353]">
                Find Your Skin Disease
            </h1>
            <div className="relative flex flex-col items-center justify-center mt-10 " >
                {!selectedImage && (
                    <label htmlFor="actual-btn" className="300px:w-[350px] 400px:w-[390px] 500px:w-[480px] 600px:w-[500px] 700px:w-[600px] flex items-center justify-between p-4 rounded-lg opacity-100 cursor-pointer bg-slate-200">
                        <div className="flex items-center">
                            <FaCloudUploadAlt size={50} className="text-[#9c3353]" />
                            <div className="ml-2 font-semibold text-black 600px:ml-3 700px:ml-5 text-wrap">
                                Limit 50mb per file. JPG, JPEG, PNG
                            </div>
                        </div>
                        <div className="w-[130px] min-w-[130px] mr-0">
                            <input onChange={handleImageChange} type="file" name="" id="actual-btn" hidden />
                            <label className="bg-[#9c3353] hover:bg-[#b83553] cursor-pointer text-white py-[10px] px-4 rounded-lg" htmlFor="actual-btn">Browse Files</label>
                        </div>
                    </label>
                )}


                {selectedImage && (
                    <div className="700px:w-[580px] flex items-center justify-between mt-5">
                        <div className="flex items-center">
                            <FaFile size={20} className="mr-4" />
                            {selectedImage?.name}
                        </div>
                        <IoMdClose className="cursor-pointer" onClick={() => setSelectedImage(null)} size={20} />
                    </div>
                )}

                <div className="flex flex-col items-center justify-center mt-5">
                    {selectedImage && (
                        <Image
                            src={URL.createObjectURL(selectedImage)}
                            alt=""
                            width={250}
                            height={250}
                            className="w-[250px] h-[250px] text-black cursor-pointer border-[3px] border-[#9c3353]"
                        />
                    )}
                    {selectedImage && (
                        <button onClick={() => getPrediction()} className="bg-[#9c3353] w-[200px] tracking-widest mt-2 hover:bg-[#b83553] text-[20px] cursor-pointer text-white py-3 rounded-lg" htmlFor="actual-btn">
                            Predict
                        </button>
                    )}
                </div>
            </div>

            <div className="">
                {open && (
                    <CustomModal
                        open={open}
                        setOpen={setOpen}
                        loading={loading}
                        result={result}
                        setRoute = {setRoute}
                        component={ResultTab}
                    />
                )}
            </div>

        </div>
    )
}

export default Detection