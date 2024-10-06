import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import Api from "../../../api/index";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Swal from "sweetalert2";

// Fix for marker icons not appearing
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const LocationMap = ({ lat, lon, name }) => (
  <MapContainer
    center={[lat, lon]}
    zoom={13}
    style={{ height: "100%", width: "100%" }}
    markerZoomAnimation={true}
    
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <Marker position={[lat, lon]}>
      <Popup>
        <div>
          <p>{name || "No Name"}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Buka di Google Maps
          </a>
        </div>
      </Popup>
    </Marker>
  </MapContainer>
);

function ProfileSettings() {
  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("user"));
  const [profile, setProfile] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const lat = encodeURIComponent(
    profile.industries?.latitude || profile.student?.industries?.latitude
  );
  const lon = encodeURIComponent(
    profile.industries?.longitude || profile.student?.industries?.longitude
  );


  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const response = await Api.get(`/admin/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(response.data.data);
    } catch (error) {
      console.error("Error fetching user:", error.message);
      dispatch(
        showNotification({ message: "Failed to load user data", status: 0 })
      );
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

    Swal.fire({
      title: "Uploading Profile Picture",
      text: "Please wait...",
      icon: "info",
      showCancelButton: false,
      showConfirmButton: false
    });

    try {
      await Api.post(`/admin/UpdateStudentImage/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      dispatch(
        showNotification({
          message: "Profile picture updated successfully",
          status: 1
        })
      );
      getUser(); // Refresh profile data to reflect the new picture
    } catch (error) {
      console.error("Error uploading profile picture:", error.message);
      dispatch(
        showNotification({
          message: "Failed to update profile picture",
          status: 0
        })
      );
    } finally {
      Swal.close();
      window.location.reload();
     
     
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
         src={ profile?.student?.image && profile?.student?.image !== "https://api.jurnal.pplgsmkn1ciomas.my.id/storage" 
          ? profile.student.image 
          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }
          
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
        {profile && profile.roles ? (
          profile.roles.includes("guru") || profile.roles.includes("admin") ? (
            <h3 className="text-2xl font-semibold mt-4 dark:text-white">
              {profile.teacher ? profile.teacher.name : "No Name"}
            </h3>
          ) : profile.roles.includes("siswa") ? (
            <h3 className="text-2xl font-semibold mt-4 dark:text-white">
              {profile.student ? profile.student.name : "No Name"}
            </h3>
          ) : profile.roles.includes("industri") ? (
            <h3 className="text-2xl font-semibold mt-4 dark:text-white">
              {profile.industries?.name || "No Name"}
            </h3>
          ) : null
        ) : null}

        <h3 className="text-gray-500 mt-1 text-xl dark:text-gray-300">
          {profile.roles ? profile.roles[0] : "No Role"}
        </h3>
      </div>

      {/* Conditional rendering based on role */}
      {profile.roles && (
        <>
          {profile.roles.includes("guru") || profile.roles.includes("admin") ? (
            <div className="shadow rounded flex-1">
              <h3 className="text-lg font-semibold mb-3 bg-blue-500 text-white p-2 rounded-t">
                Info Dasar
              </h3>
              <table className="w-full">
                <tbody className="text-sm font-medium text-gray-700">
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium">Nama</td>
                    <td className="py-2 px-4">
                      {profile.teacher?.name || "No Name"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium">No Telpon</td>
                    <td className="py-2 px-4">
                      {profile.teacher?.no_hp || "No NIP"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : profile.roles.includes("industri") ? (
            <>
              <div className="flex flex-col md:flex-row md:gap-6 mb-24 ">
                <div className="rounded  flex-1 dark:bg-gray-800 h-64">
                  <h3 className="text-lg font-semibold mb-3 bg-blue-500 text-white p-4 rounded-t dark:bg-gray-600">
                    Info Dasar
                  </h3>
                  <table className="w-full h-[100%]">
                    <tbody className="text-sm font-medium text-gray-700 dark:text-gray-200 dark:bg-gray-800 ">
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Nama</td>
                        <td className="py-2 px-4">
                          {profile.industries?.name || "No Name"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">NIS</td>
                        <td className="py-2 px-4">
                          {profile.industries?.bidang || "No NIS"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">
                          Nama Pembimbing
                        </td>
                        <td className="py-2 px-4">
                          {profile.industries?.industryMentorName || "No Class"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">
                          Nomer Pembimbing
                        </td>
                        <td className="py-2 px-4">
                          {profile.industries?.industryMentorNo || "No Class"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded flex-1 md:mt-0 mt-6 h-64 z-[1]">
                  <h3 className="text-lg font-semibold  bg-blue-500 text-white p-4 dark:bg-gray-600 rounded-t">
                    Lokasi Industri
                  </h3>
                  <LocationMap
                    lat={lat}
                    lon={lon}
                    name={
                      profile.industries?.name ||
                      profile.student?.industries?.name
                    }
                  />
                </div>
              </div>
              <div className="mt-10 text-right">
                <Link
                  to={"/app/edit-profileindustri"}
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-200"
                >
                  Update Profile
                </Link>
              </div>
            </>
          ) : (
            <div>
              {/* Flex container to make sections side by side */}
              <div className="flex flex-col md:flex-row md:gap-6">
                <div className="shadow rounded flex-1 dark:bg-gray-800">
                  <h3 className="text-lg font-semibold mb-3 bg-blue-500 text-white p-4 rounded-t dark:bg-gray-600">
                    Info Dasar
                  </h3>
                  <table className="w-full">
                    <tbody className="text-sm font-medium text-gray-700 dark:text-gray-200 dark:bg-gray-800">
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Nama</td>
                        <td className="py-2 px-4">
                          {profile.student ? profile.student.name : "No Name"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">NIS</td>
                        <td className="py-2 px-4">
                          {profile.student ? profile.student.nis : "No NIS"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Kelas</td>
                        <td className="py-2 px-4">
                          {profile.student
                            ? profile.student.classes.name
                            : "No Class"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Tempat Lahir</td>
                        <td className="py-2 px-4">
                          {profile.student?.placeOfBirth || "No Place of Birth"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Tanggal Lahir</td>
                        <td className="py-2 px-4">
                          {profile.student
                            ? profile.student.dateOfBirth
                            : "No Date of Birth"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Gender</td>
                        <td className="py-2 px-4">
                          {profile.student?.gender || "No Gender"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Alamat</td>
                        <td className="py-2 px-4">
                          {profile.student?.alamat || "No Address"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded flex-1 md:mt-0 mt-6">
                  <h3 className="text-lg font-semibold mb-3 bg-blue-500 text-white p-4 dark:bg-gray-600 rounded-t">
                    Data Orang Tua
                  </h3>
                  <table className="w-full">
                    <tbody className="text-sm font-medium text-gray-700 dark:text-gray-200 dark:bg-gray-800">
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Nama</td>
                        <td className="py-2 px-4">
                          {profile.student?.parents?.nama || "No Name"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Profesi</td>
                        <td className="py-2 px-4">
                          {profile.student?.parents?.occupation ||
                            "No Occupation"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Alamat</td>
                        <td className="py-2 px-4">
                          {profile.student?.alamat || "No Address"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Nomer Telpon</td>
                        <td className="py-2 px-4">
                          {profile.student?.parents?.phoneNumber || "No Phone"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Flex container to make sections side by side */}
              <div className="flex flex-col md:flex-row md:gap-6 mt-6">
                <div className="bg-white dark:bg-gray-800 shadow rounded flex-1">
                  <h3 className="text-lg font-semibold mb-3 bg-blue-500 text-white p-4 rounded-t dark:bg-gray-600">
                    Info Tempat PKL
                  </h3>
                  <table className="w-full">
                    <tbody className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">
                          Nama Tempat PKL
                        </td>
                        <td className="py-2 px-4">
                          {profile.student?.industries?.name || "No Industry"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Bidang</td>
                        <td className="py-2 px-4">
                          {profile.student?.industries?.bidang || "No Field"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">
                          Alamat Tempat PKL
                        </td>
                        <td className="py-2 px-4">
                          {profile.student?.industries?.alamat || "No Address"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">
                          Nama Pembimbing
                        </td>
                        <td className="py-2 px-4">
                          {profile.student?.industries?.industryMentorName ||
                            "No Mentor"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">
                          No Telepon Pembimbing
                        </td>
                        <td className="py-2 px-4">
                          {profile.student?.industries?.industryMentorNo ||
                            "No Phone"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded flex-1 md:mt-0 mt-6">
                  <h3 className=" dark:bg-gray-600 text-lg font-semibold mb-3 bg-blue-500 text-white p-4 rounded-t">
                    Informasi Pembimbing Sekolah
                  </h3>
                  <table className="w-full">
                    <tbody className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">
                          Nama Pembimbing Sekolah
                        </td>
                        <td className="py-2 px-4">
                          {profile.student?.teachers?.name || "No Name"}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Nomor Telpon</td>
                        <td className="py-2 px-4">
                          {profile.student?.teachers?.no_hp || "No Phone"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Flex container to make sections side by side */}

              <div className="bg-white dark:bg-gray-800 shadow rounded flex-1 md:mt-6 mt-6 h-64 md:w-[734px] mb-28 z-[1]">
                <h3 className="text-lg font-semibold  bg-blue-500 text-white p-4 dark:bg-gray-600 rounded-t">
                  Lokasi Industri
                </h3>
                <LocationMap
                  lat={lat}
                  lon={lon}
                  name={
                    profile.industries?.name ||
                    profile.student?.industries?.name
                  }
                />
              </div>

              <div className="mt-8 text-right">
                <Link
                  to={"/app/edit-profile"}
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-200"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {/* Update button */}
    </TitleCard>
  );
}

export default ProfileSettings;
