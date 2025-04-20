import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import Api from "../../api";
import Cookies from "js-cookie";
import { CloudUpload, CheckCircle } from "lucide-react"; // Import icon dari lucide-react
import swal from "sweetalert2";
import toast from "react-hot-toast";

const Index = () => {
    const { register, handleSubmit, setValue } = useForm();
    const [logo, setLogo] = useState(null);
    const [background, setBackground] = useState(null);
    const [prevSettings, setPrevSettings] = useState({ logo: "", background: "", text: "" });
    const token = Cookies.get("token");
    const baseUrl = process.env.REACT_APP_BASE_CMS_URL;

    const link = `${baseUrl}storage/${prevSettings?.logo}`;
    const link2 = `${baseUrl}storage/${prevSettings?.background}`;

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await Api.get("/settings", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPrevSettings(response.data);
                setValue("text", response.data.text);
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
    }, [token, setValue]);

    const onDrop = useCallback((acceptedFiles, type) => {
        const file = acceptedFiles[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            if (type === "logo") {
                setLogo({ file, preview });
            } else {
                setBackground({ file, preview });
            }
        }
    }, []);

    const { getRootProps: getLogoProps, getInputProps: getLogoInputProps } = useDropzone({
        accept: "image/*",
        onDrop: (files) => onDrop(files, "logo"),
    });

    const { getRootProps: getBgProps, getInputProps: getBgInputProps } = useDropzone({
        accept: "image/*",
        onDrop: (files) => onDrop(files, "background"),
    });

    const onSubmit = async (data) => {
        swal.fire({
            title: "Are you sure?",
            text: "Do you want to update the settings?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append("text", data.text);
                if (logo?.file) {
                    formData.append("logo", logo.file);
                }
                if (background?.file) {
                    formData.append("background", background.file);
                }
    
                try {
                    await Api.post("/admin/settings", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    toast.success("Settings updated successfully!");
                } catch (error) {
                    console.error("Error updating settings:", error);
                    toast.error("Failed to update settings!");
                }
            }
        });
    };
    

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-lg border border-gray-200">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">CMS Editor</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Upload Logo */}
                <div className="text-center">
                    <label className="block text-md font-medium text-gray-700 mb-2">Upload Logo</label>
                    <div
                        {...getLogoProps()}
                        className="border-2 border-dashed rounded-lg p-6 cursor-pointer bg-gray-100 hover:bg-gray-200 transition flex flex-col items-center"
                    >
                        <input {...getLogoInputProps()} />
                        {logo ? (
                            <img src={logo.preview} alt="Logo Preview" className=" object-cover rounded-md shadow-lg" />
                        ) : prevSettings.logo ? (
                            <img src={link} alt="Current Logo" className=" object-cover rounded-md shadow-lg" />
                        ) : (
                            <CloudUpload className="text-gray-500 h-12 w-12" />
                        )}
                        <p className="text-gray-600 mt-2 text-sm">Drag & drop or click to upload</p>
                    </div>
                </div>

                {/* Upload Background */}
                <div className="text-center">
                    <label className="block text-md font-medium text-gray-700 mb-2">Upload Background (16:9)</label>
                    <div
                        {...getBgProps()}
                        className="border-2 border-dashed rounded-lg p-6 cursor-pointer bg-gray-100 hover:bg-gray-200 transition flex flex-col items-center"
                    >
                        <input {...getBgInputProps()} />
                        {background ? (
                            <img src={background.preview} alt="Background Preview" className="w-full object-cover rounded-md shadow-lg" />
                        ) : prevSettings.background ? (
                            <img src={link2} alt="Current Background" className="w-full  object-cover rounded-md shadow-lg" />
                        ) : (
                            <CloudUpload className="text-gray-500 h-12 w-12" />
                        )}
                        <p className="text-gray-600 mt-2 text-sm">Drag & drop or click to upload</p>
                    </div>
                </div>

                {/* Text Update */}
                <div>
                    <label className="block text-md font-medium text-gray-700">Update Text</label>
                    <textarea
                        {...register("text")}
                        className="mt-2 p-3 border rounded-lg w-full h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                        placeholder="Enter new text..."
                    />
                    <p className="text-gray-500 mt-2 text-sm">Current Text: <span className="font-semibold">{prevSettings.text}</span></p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full font-semibold text-lg shadow-md"
                >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default Index;
