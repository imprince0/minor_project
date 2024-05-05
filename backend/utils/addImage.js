import cloudinary from 'cloudinary'
export const addImage = async (image) => {
    try {
        const myCloud = await cloudinary.v2.uploader.upload(image, {
            folder: "Predictions",
            width: 150,
        });
        let ans = {
            success:true,
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
        return ans;
    } catch (error) {
        console.log("Error in addImage: " + error);
        return {
            success: false,
            public_id: "",
            url: "",
        }
    }
}

export const deleteImage = async (public_id) => {
    try {
        await cloudinary.v2.uploader.destroy(public_id);
        return true
    } catch (error) {
        return false
    }
}
