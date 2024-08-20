import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import Api from "../../../api/index";
import Cookies from "js-cookie";


function ProfileSettings() {
    const token = Cookies.get("token");
    const user = JSON.parse(Cookies.get("user"));
    const [profile, setProfile] = useState({});

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

    const updateProfile = () => {
        // You might want to add the actual update profile logic here
        dispatch(showNotification({ message: "Profile Updated", status: 1 }));
    };

    const handleClose = () => {
        console.log("Modal closed");
        // Add modal close logic here if a modal is used
    };

    return (
        <TitleCard title="Profile Settings" topMargin="mt-2">
            <div className="absolute top-4 right-4 z-50">
                {/* Any additional UI components can go here */}
            </div>
            <div className="text-center mb-6">
                <img
                    src={profile?.image || '/default-profile.png'}
                    alt="Profile"
                    className="w-36 h-36 mx-auto rounded-full border-4 border-blue-500"
                />
                <h3 className="text-2xl font-semibold mt-4">{profile?.name || 'No Name'}</h3>
                <h5 className="text-gray-500 mt-2">{profile.roles ? profile.roles[0] : 'No Role'}</h5>
            </div>
            <div className="bg-white p-4 mb-4 shadow rounded">
                <h3 className="text-lg font-semibold mb-3">Info Dasar</h3>
                <table className="w-full">
                    <tbody className="text-sm font-medium text-gray-700">
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">Nama</td>
                            <td className="py-2 px-4">{profile?.name || 'No Name'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">NIS</td>
                            <td className="py-2 px-4">{profile.student ? profile.student.nis : 'No NIS'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">Kelas</td>
                            <td className="py-2 px-4">{profile.class_id }</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">Tempat Lahir</td>
                            <td className="py-2 px-4">{profile?.placeOfBirth || 'No Place of Birth'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">Tanggal Lahir</td>
                            <td className="py-2 px-4">{moment(profile?.dateOfBirth).format('DD-MM-YYYY')}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">Gender</td>
                            <td className="py-2 px-4">{profile?.gender || 'No Gender'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-4 shadow rounded mt-6">
                <h3 className="text-lg font-semibold mb-3">Info Lainnya</h3>
                <table className="w-full">
                    <tbody className="text-sm font-medium text-gray-700">
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">Alamat</td>
                            <td className="py-2 px-4">{profile?.alamat || 'No Address'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-4 shadow rounded mt-6">
                <h3 className="text-lg font-semibold mb-3">Info Tempat PKL</h3>
                <table className="w-full">
                    <tbody className="text-sm font-medium text-gray-700">
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">Nama Tempat PKL</td>
                            <td className="py-2 px-4">{profile?.industries?.name || 'No Industry'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">Bidang</td>
                            <td className="py-2 px-4">{profile?.industries?.bidang || 'No Industry'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">Alamat Tempat PKL</td>
                            <td className="py-2 px-4">{profile?.industries?.alamat || 'No Industry'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">Nama Pembimbing</td>
                            <td className="py-2 px-4">{profile?.industries?.industryMentorName || 'No Mentor'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">No Telepon Pembimbing</td>
                            <td className="py-2 px-4">{profile?.industries?.industryMentorNo || 'No Phone'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-4 shadow rounded mt-6">
                <h3 className="text-lg font-semibold mb-3">Info Guru Pembimbing</h3>
                <table className="w-full">
                    <tbody className="text-sm font-medium text-gray-700">
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">Nama</td>
                            <td className="py-2 px-4">{profile?.teachers?.name || 'No Teacher'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 px-4 font-medium">No. Telepon</td>
                            <td className="py-2 px-4">{profile?.teachers?.no_hp || 'No Phone'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="modal-action flex justify-center mt-6">
                <button
                    className="btn btn-sm sm:btn-md border-black w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={updateProfile}
                >
                    Update
                </button>
            </div>
        </TitleCard>
    );
}

export default ProfileSettings;
