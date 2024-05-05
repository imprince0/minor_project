import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";

const { useState } = require("react");

const usePrediction = () => {
    const [loading, setLoading] = useState(false)
    async function predict(formData) {
        try {
            setLoading(true); // Set loading to true when signup process starts
            const response = await axiosInstance.post('/prediction', formData, {
                withCredentials: true
            }, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            console.log(response)

            if (!response?.data?.success) {
                toast.error("Can not process your request at this moment. Please try again later");
                return [false, null];
            }

            return [true,response.data];

        } catch (e) {
            console.log(e)
            toast.error("Some Error Occured. Please refresh once")
            return [false, null];
        } finally {
            setLoading(false);
        }
    }
    return { loading, predict }
}

export default usePrediction