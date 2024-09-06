import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import Api from "../../../api/index";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

function ProfileSettings() {
    const token = Cookies.get("token");
    const user = JSON.parse(Cookies.get("user"));
    const [profile, setProfile] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    console.log("Profileee:", user);

    const dispatch = useDispatch();

    const getUser = async () => {
        try {
            const response = await Api.get(`/admin/users/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfile(response.data.data);
            console.log("Profile:", response.data.data);
        } catch (error) {
            console.error("Error fetching user:", error.message);
            dispatch(showNotification({ message: "Failed to load user data", status: 0 }));
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(URL.createObjectURL(file));
            uploadProfilePicture(file);
        }
    };

    const uploadProfilePicture = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            await Api.post(`/admin/UpdateStudentImage/${user.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            dispatch(showNotification({ message: "Profile picture updated successfully", status: 1 }));
            getUser(); // Refresh profile data to reflect the new picture
        } catch (error) {
            console.error("Error uploading profile picture:", error.message);
            dispatch(showNotification({ message: "Failed to update profile picture", status: 0 }));
        }
    };

    const updateProfile = () => {
        // You might want to add the actual update profile logic here
        dispatch(showNotification({ message: "Profile Updated", status: 1 }));
    };

    return (
        <TitleCard title="Profile Settings" topMargin="mt-2">
            <div className="absolute top-4 right-4 z-50">
                {/* Any additional UI components can go here */}
            </div>
            <div className="text-center mb-8">
                <img
                    src={selectedFile || (profile.student?.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')}
                    alt="Profile"
                    className="w-36 h-36 mx-auto rounded-full border-4 border-blue-500"
                />
                <form action="" className="mt-4">
                    <label
                        htmlFor="image"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded cursor-pointer"
                    >
                        Ubah Foto
                    </label>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </form>
                {profile.roles && (profile.roles[0] === 'guru' || profile.roles[0] === 'admin')  ? (
                <h3 className="text-2xl font-semibold mt-4 dark:text-white">{profile.teacher ? profile.teacher.name : 'No Name'}</h3>) : (
                    <h3 className="text-2xl font-semibold mt-4 dark:text-white">{profile.student ? profile.student.name : 'No Name'}</h3>
                )}
                <h3 className="text-gray-500 mt-1 text-xl dark:text-gray-300">{profile.roles ? profile.roles[0] : 'No Role'}</h3>
            </div>
            
            {/* Conditional rendering based on role */}
            {profile.roles && (profile.roles[0] === 'guru' || profile.roles[0] === 'admin')  ? (
                <div className="shadow rounded flex-1">
                    <h3 className="text-lg font-semibold mb-3 bg-blue-500 text-white p-2 rounded-t">Info Dasar</h3>
                    <table className="w-full">
                        <tbody className="text-sm font-medium text-gray-700">
                            <tr className="border-b">
                                <td className="py-2 px-4 font-medium">Nama</td>
                                <td className="py-2 px-4">{profile.teacher?.name || 'No Name'}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4 font-medium">No Telpon</td>
                                <td className="py-2 px-4">{profile.teacher?.no_hp || 'No NIP'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    {/* Flex container to make sections side by side */}
                    <div className="flex flex-col md:flex-row md:gap-6">
                        <div className="shadow rounded flex-1 dark:bg-gray-800">
                            <h3 className="text-lg font-semibold mb-3 bg-blue-500 text-white p-4 rounded-t dark:bg-gray-600  ">Info Dasar</h3>
                            <table className="w-full">
                                <tbody className="text-sm font-medium text-gray-700 dark:text-gray-200 dark:bg-gray-800">
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Nama</td>
                                        <td className="py-2 px-4">{profile.student ? profile.student.name : 'No Name'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">NIS</td>
                                        <td className="py-2 px-4">{profile.student ? profile.student.nis : 'No NIS'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Kelas</td>
                                        <td className="py-2 px-4">{profile.student ? profile.student.classes.name : 'No Class' }</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Tempat Lahir</td>
                                        <td className="py-2 px-4">{profile.student?.placeOfBirth || 'No Place of Birth'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Tanggal Lahir</td>
                                        <td className="py-2 px-4">{profile.student ? profile.student.dateOfBirth : 'No Date of Birth'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Gender</td>
                                        <td className="py-2 px-4">{profile.student?.gender || 'No Gender'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Alamat</td>
                                        <td className="py-2 px-4">{profile.student?.alamat || 'No Address'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded flex-1 md:mt-0 mt-6">
                            <h3 className="text-lg font-semibold mb-3 bg-blue-500 text-white p-4 dark:bg-gray-600 rounded-t">Data Orang Tua</h3>
                            <table className="w-full">
                                <tbody className="text-sm font-medium text-gray-700 dark:text-gray-200 dark:bg-gray-800">
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Nama</td>
                                        <td className="py-2 px-4">{profile.student?.parents?.nama || 'No Name'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Profesi</td>
                                        <td className="py-2 px-4">{profile.student?.parents?.occupation || 'No Occupation'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Alamat</td>
                                        <td className="py-2 px-4">{profile.student?.alamat || 'No Address'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Nomer Telpon</td>
                                        <td className="py-2 px-4">{profile.student?.parents?.phoneNumber || 'No Phone'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Flex container to make sections side by side */}
                    <div className="flex flex-col md:flex-row md:gap-6 mt-6">
                        <div className="bg-white dark:bg-gray-800 shadow rounded flex-1">
                            <h3 className="text-lg font-semibold mb-3 bg-blue-500 text-white p-4 rounded-t dark:bg-gray-600">Info Tempat PKL</h3>
                            <table className="w-full">
                                <tbody className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Nama Tempat PKL</td>
                                        <td className="py-2 px-4">{profile.student?.industries?.name || 'No Industry'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Bidang</td>
                                        <td className="py-2 px-4">{profile.student?.industries?.bidang || 'No Field'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Alamat Tempat PKL</td>
                                        <td className="py-2 px-4">{profile.student?.industries?.alamat || 'No Address'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Nama Pembimbing</td>
                                        <td className="py-2 px-4">{profile.student?.industries?.industryMentorName || 'No Mentor'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">No Telepon Pembimbing</td>
                                        <td className="py-2 px-4">{profile.student?.industries?.industryMentorNo || 'No Phone'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow rounded flex-1 md:mt-0 mt-6">
                            <h3 className=" dark:bg-gray-600 text-lg font-semibold mb-3 bg-blue-500 text-white p-4 rounded-t">Informasi Pembimbing Sekolah</h3>
                            <table className="w-full">
                                <tbody className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Nama Pembimbing Sekolah</td>
                                        <td className="py-2 px-4">{profile.student?.teachers?.name || 'No Name'}</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 px-4 font-medium">Nomor Telpon</td>
                                        <td className="py-2 px-4">{profile.student?.teachers?.no_hp || 'No Phone'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {/* Update button */}

            <div className="mt-8 text-right">
                <Link
                    to={"/app/edit-profile"}
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-200"
                >
                    Update Profile
                </Link>
            </div>
        </TitleCard>
    );
}

export default ProfileSettings;
