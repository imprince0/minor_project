import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { useState } from "react";

const useSocialAuth = () => {
    const [loading, setLoading] = useState(false);
    const socialAuth = async (data) => {
        try {
            setLoading(true)
            const response = await axiosInstance.post('/socialAuth', data ,{
                withCredentials: true
            });
            if (!response.data?.success) {
                toast.error(response.data?.error);
                return [false, null];
            }

            return [response.data?.success || false, response.data?.user || null];
        }
        catch (error) {
            toast.error("Some Error Occured. Please refresh once")
            return [false, null];
        }
        finally {
            setLoading(false);
        }
    }
    return { loading, socialAuth };
}

export default useSocialAuth