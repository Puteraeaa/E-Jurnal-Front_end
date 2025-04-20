import React, { useEffect, useState } from "react";
import Api from "../../api";
import Cookies from "js-cookie";
import forum from "../../assets/forum.svg";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showNotification } from "../../features/common/headerSlice";
import {
  ChatBubbleLeftIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import hasAnyPermission from "../../utils/Permissions";
import { filterBadWords } from "../../utils/badword";

function Index() {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // sortType state untuk dropdown; defaultnya kosong (tidak ada sorting awal)
  const [sortType, setSortType] = useState("");
  const token = Cookies.get("token");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();
  const maxLength = 255;
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  // selectedFilter: true = forum penting, false = forum biasa
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [errorCensored, setErrorCensored] = useState(false);

  // Panggil fetchForums tanpa sort saat komponen pertama kali di-mount
  useEffect(() => {
    fetchForums();
  }, []);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Ubah parameter isImportant menjadi string "1" atau "0" agar backend dapat membedakannya
  const fetchForums = async (isImportant = null, sortParam = "") => {
    try {
      let url = "/admin/posts";
      const params = new URLSearchParams();

      if (isImportant !== null) {
        // konversi boolean ke string "1" atau "0"
        params.append("important", isImportant ? "1" : "0");
      }
      // Hanya append jika sortParam tidak kosong
      if (sortParam) {
        params.append("sort", sortParam);
      }

      const response = await Api.get(`${url}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data.posts);
      setForums(response.data.posts || []);
    } catch (error) {
      setError("Gagal memuat data forum");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchForums(selectedFilter, sortType);
    }, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [selectedFilter, sortType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { filteredText, hasBadWords } = await filterBadWords(content);

    if (hasBadWords) {
      setErrorCensored(true);
      setContent(filteredText);
      return;
    }

    try {
      const response = await Api.post(
        "/admin/posts",
        { content, category, important: isAnnouncement },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchForums();
      setContent("");
      setCategory("");
      setIsAnnouncement(false);
      document.getElementById("my_modal_4").close();
      setErrorCensored(false);
      toast.success("Success!", "Post has been added.", "success");
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Api.delete(`/admin/posts/${postId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setForums(forums.filter((forum) => forum.post.id !== postId));
          toast.success("Deleted!", "The post has been deleted.", "success");
        } catch (error) {
          toast.error("Error!", "Failed to delete the post.", "error");
        }
      }
    });
  };

  return (
    <div className="min-h-screen  lg:px-20">
      <header className="dark:bg-blue-900 bg-blue-500 text-white py-1 px-6 rounded-lg shadow-lg mb-12">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between p-2">
          <div className="text-center lg:text-left mb-8 lg:mb-0">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to SIMONIK Discus
            </h1>
            <p className="text-lg">
              Ask questions, share ideas, and connect with our community!
            </p>
          </div>
          <img
            src={forum}
            alt="Community Illustration"
            className="w-48 md:w-64 lg:w-64 rounded-lg hidden lg:block"
          />
        </div>
      </header>

      <main>
        <div className="flex flex-wrap items-center justify-center mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-gray-200 dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md">
            {/* Tombol Forum Biasa */}
            <button
              className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm rounded-lg transition-all ease-in-out duration-300 transform hover:scale-105 ${
                selectedFilter === null
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
              onClick={() => {
                // Panggil fetchForums tanpa parameter sort
                fetchForums(false);
                setSelectedFilter(null);
                setLoading(true);
              }}
            >
              🗨️ All Forum
            </button>

            {/* Tombol Forum Penting */}
            <button
              className={`px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm rounded-lg transition-all ease-in-out duration-300 transform hover:scale-105 ${
                selectedFilter === true
                  ? "bg-yellow-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-yellow-100"
              }`}
              onClick={() => {
                fetchForums(true);
                setSelectedFilter(true);
                setLoading(true);
              }}
            >
              ⭐ Forum Penting
            </button>

            {/* Dropdown Sorting */}
            <select
              className="w-full sm:w-auto select-bordered max-w-xs p-2 sm:p-3 rounded-md shadow-md text-gray-700 bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              value={sortType}
              onChange={(e) => {
                const value = e.target.value;
                setSortType(value);
                fetchForums(selectedFilter, value);
                setLoading(true);
                }}
              >
                <option value="">
                🔽 Tanpa Sort
                </option>
                <option value="most_comments">💬 Komentar Terbanyak</option>
                <option value="oldest">🕰️ Post Terlama</option>
              </select>

              {/* Tombol Tambah Forum */}
            <button
              className="px-4 sm:px-6 py-2 sm:py-3 font-semibold text-sm rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all ease-in-out duration-300 transform hover:scale-105"
              onClick={() => document.getElementById("my_modal_4").showModal()}
            >
              📝 Tambah Forum
            </button>
          </div>
        </div>

        <section>
          <div className="space-y-6">
            {loading
              ? [...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md animate-pulse"
                  >
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="flex items-center mt-4 space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))
              : forums.map((forum) => (
                  <div
                    key={forum.post.id}
                    className={`relative rounded-lg shadow-md hover:shadow-lg transition mt-6 ${
                      forum.post?.important
                        ? "bg-yellow-100 border-l-4 border-yellow-500"
                        : "bg-white"
                    }`}
                  >
                    {hasAnyPermission(["users.create", "guru.index"]) && (
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === forum.post.id
                                ? null
                                : forum.post.id
                            )
                          }
                          className="p-2 rounded-full hover:bg-gray-200 transition"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                        </button>
                        {openDropdown === forum.post.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                            <button
                              onClick={() => handleDeletePost(forum.post.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <TrashIcon className="h-5 w-5 mr-2" /> Delete Post
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <Link
                      key={forum.id}
                      to={`/app/forum/${forum.post?.id}`}
                      className="cursor-pointer"
                    >
                      <div className="dark:bg-[#374152] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h3 className="text-base md:text-lg lg:text-xl font-bold text-blue-600 dark:text-blue-400">
                          {forum.post?.content}
                        </h3>
                        <div className="mt-4 flex flex-wrap items-center space-x-3 text-gray-600 dark:text-gray-400">
                          <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            #{forum.post?.category}
                          </span>
                          <span className="text-sm">•</span>
                          <span className="text-sm">
                            {convertTime(forum.post?.created_at)}
                          </span>
                          <span className="text-sm">•</span>
                          <span className="text-sm">
                            {forum.post?.comments_count} comments
                          </span>
                        </div>
                        <div className="mt-4 flex items-center space-x-3 border-t pt-4">
                          <img
                            src={
                              forum.post?.user?.students?.image &&
                              forum.post?.user?.students?.image !==
                                "https://api.jurnal.pplgsmkn1ciomas.my.id/storage"
                                ? forum.post?.user?.students?.image
                                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            }
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                              {forum.post?.user?.students?.name ||
                                forum.post?.user?.teachers?.name ||
                                "Admin"}
                            </span>
                            <span className="block text-xs font-semibold text-gray-400 mt-1">
                              {forum.post?.user?.teachers
                                ? "Guru"
                                : forum.post?.user?.students
                                ? forum.post?.user?.students?.classes?.name
                                : "Admin"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
          </div>
        </section>

        <dialog id="my_modal_4" className="modal">
          <div className="modal-box w-11/12 max-w-2xl bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Create New Forum Post
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={handleContentChange}
                  rows="4"
                  className={`mt-1 block w-full border ${
                    content.length === maxLength
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm py-3 px-4 focus:outline-none ${
                    content.length === maxLength
                      ? "focus:ring-red-500 focus:border-red-500"
                      : "focus:ring-blue-500 focus:border-blue-500"
                  } sm:text-sm`}
                  required
                ></textarea>
                <div className="flex justify-between items-center mt-1 text-sm">
                  <span
                    className={`${
                      content.length >= 240 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    Characters: {content.length}/{maxLength}
                  </span>
                  {content.length === maxLength && (
                    <span className="text-red-500 font-medium">
                      Max limit reached
                    </span>
                  )}
                  {errorCensored && (
                    <div className="text-red-500 text-sm">
                      <p>
                        Content mengandung bahasa kasar, silahkah ubah atau teks akan di sensor
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="" selected disabled>
                    Select a category
                  </option>
                  <option value="umum">Umum</option>
                  <option value="Bertanya">Bertanya</option>
                  <option value="Diskusi">Diskusi</option>
                  <option value="Informasi">Informasi</option>
                </select>
              </div>
              {hasAnyPermission(["users.create", "guru.index"]) && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pesan Pengumuman
                </label>
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <input
                      type="checkbox"
                      checked={isAnnouncement}
                      onChange={(e) => setIsAnnouncement(e.target.checked)}
                      className="checkbox checkbox-accent"
                    />
                  </label>
                </div>
              </div>
              )}

              <div className="modal-action flex justify-between items-center mt-6">
                <button
                  type="submit"
                  className="btn bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  Submit
                </button>

                <form method="dialog">
                  <button className="btn bg-gray-200 text-gray-700 px-6 py-2 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200">
                    Close
                  </button>
                </form>
              </div>
            </form>
          </div>
        </dialog>

        <footer className="mt-12 py-6 border-t border-gray-200 text-center text-sm text-gray-600">
          © 2025 SIMONIK Discus. All rights reserved.
        </footer>
      </main>
    </div>
  );

  function convertTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / (3600 * 24));
    const weeks = Math.floor(diffInSeconds / (3600 * 24 * 7));
  
    if (diffInSeconds < 60) {
      return "Baru saja";
    } else if (minutes < 60) {
      return `${minutes} menit yang lalu`;
    } else if (hours < 24) {
      return `${hours} jam  yang lalu`;
    } else if (days < 7) {
      return `${days} hari yang lalu`;
    } else {
      return weeks === 1 ? "1 minggu yang lalu" : `${weeks} minggu yang lalu`;
    }
  }
  
}

export default Index;
