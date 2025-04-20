import React, { useEffect, useState } from "react";
import Api from "../../api";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import forumm from "../../assets/forum.svg";
import { filterBadWords } from "../../utils/badword";
import { toast } from "react-hot-toast";
import {
  ChatBubbleLeftIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

function ForumDetail() {
  const [forum, setForum] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");
  const { forumId } = useParams();
  const [commentText, setCommentText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorCensored, setErrorCensored] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const user = JSON.parse(Cookies.get("user")); // atau dari context/state



  const handleDeletePost = async (commentsid) => {
    setDeletingId(commentsid);
    try {
      await Api.delete(`/admin/posts/${forumId}/comments/${commentsid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      toast.error("Failed to delete the post.");
      console.log(error);
    } finally {
      setDeletingId(null);
      fetchForumDetail();
    }
  };


  const canShowDropdown = (commentUser) => {
    if (user?.roles === "guru") return true;
    if (user?.roles === "admin") return true;
    if (user?.roles === "siswa" && commentUser === user?.id) {

      return true;
    }
    return false;
  };


  // Debugging line




  const fetchForumDetail = async () => {
    try {
      const response = await Api.get(`/admin/posts/${forumId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForum(response.data.post);
      setComments(response.data.comments);
      console.log("Forum ID:", response);
    } catch (error) {
      console.error(error.message);
      setError("Gagal memuat data forum");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let interval;

    const startPolling = () => {
      if (!isSending) {
        interval = setInterval(fetchForumDetail, 5000);
      }
    };

    const stopPolling = () => clearInterval(interval);

    // First load
    fetchForumDetail();
    startPolling();

    return () => {
      stopPolling();
    };
  }, [forumId, isSending]);



  const handlePostComment = async () => {
    if (!commentText) return;

    // Filter kata-kata yang dilarang
    const { filteredText, hasBadWords } = await filterBadWords(commentText);
    if (hasBadWords) {
      setErrorCensored(true);
      setCommentText(filteredText);
      return;
    }

    // Buat komentar sementara (pending) dengan user: null agar menampilkan "Loading..."
    const tempComment = {
      id: Date.now(), // ID sementara
      content: commentText,
      pending: true,
      user: null,
      created_at: new Date().toISOString(),
    };
    setComments((prevComments) => [...prevComments, tempComment]);
    setIsSending(true);

    try {
      await Api.post(
        `/admin/posts/${forumId}/comments`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Setelah sukses, ambil ulang data komentar
      fetchForumDetail();
      setCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  if (errorCensored === true) {
    toast.error("Komentar mengandung bahasa yang tidak pantas. Silakan ubah.", {
      position: "top-center",
      autoClose: 3000,
    });
    setErrorCensored(false); // Reset error state to ensure it shows only once
  }

  return (
    <div className="min-h-screen bg-muted/50 dark:bg-background px-4 sm:px-6 lg:px-20">
      {/* Header / Hero */}
      <header className="bg-blue-600 dark:bg-blue-900 text-white rounded-xl shadow-md px-6 py-10 mb-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-3">Waktunya Diskusi 💬</h1>
            <p className="text-lg text-white/90 max-w-xl">
              Ajukan pertanyaan, bagikan ide, dan terhubung dengan komunitas kami!
            </p>
          </div>
          <img
            src={forumm}
            alt="Ilustrasi Komunitas"
            className="w-44 md:w-60 lg:w-64 rounded-lg shadow-md hidden lg:block"
          />
        </div>
      </header>

      <main className=" mx-auto space-y-12">
        {/* Forum Post */}
        <section
          className={`rounded-xl border shadow-sm p-6 ${forum?.important
            ? "bg-yellow-50 border-yellow-300"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            }`}
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Kategori:</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
              #{forum?.category}
            </span>
          </div>

          <p className="text-base text-gray-800 dark:text-gray-300 leading-relaxed mb-6">
            {forum?.content}
          </p>

          {/* User Info */}
          <div className="flex items-center gap-4 pt-4 border-t dark:border-gray-700">
            <img
              src={
                forum.user?.students?.image &&
                  forum.user?.students?.image !==
                  "https://api.jurnal.pplgsmkn1ciomas.my.id/storage"
                  ? forum.user?.students?.image
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="Pengguna"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {forum?.user
                    ? forum.user.students?.name ||
                    forum.user.teachers?.name ||
                    "Admin"
                    : "Loading..."}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${forum?.user?.teachers
                    ? "bg-blue-600 text-white"
                    : forum?.user?.students
                      ? "bg-green-600 text-white"
                      : "bg-gray-500 text-white"
                    }`}
                >
                  {forum?.user?.teachers
                    ? "Guru"
                    : forum?.user?.students
                      ? "Siswa"
                      : "Admin"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {forum?.user?.students?.classes?.name || "Guru"}
              </span>
            </div>
          </div>
        </section>

        {/* Komentar */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Komentar ({comments.length})</h3>
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`relative rounded-xl border p-4 shadow-sm transition-colors duration-200 ${comment.deleted || deletingId === comment.id
                  ? "bg-gray-400 text-gray-400 dark:bg-gray-700 dark:text-gray-400 "
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  }`}
                onClick={() => setOpenDropdown(null)} // Close dropdown on click anywhere in the comment
              >
                <div className="flex items-start gap-3 mb-2 w-full">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        comment.user?.students?.image &&
                          comment.user?.students?.image !==
                          "https://api.jurnal.pplgsmkn1ciomas.my.id/storage"
                          ? comment.user?.students?.image
                          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="Pengguna"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>

                  {/* Content kiri */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      {/* Nama & Badge */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[140px] sm:max-w-xs">
                            {(!comment.user || comment.pending)
                              ? "Loading..."
                              : comment.user.teachers?.name ||
                              comment.user.students?.name ||
                              "Admin"}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${comment.user?.teachers
                                ? "bg-blue-500 text-white"
                                : comment.user?.students
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-500 text-white"
                              }`}
                          >
                            {(!comment.user || comment.pending)
                              ? "Loading..."
                              : comment.user?.teachers
                                ? "Guru"
                                : comment.user?.students
                                  ? "Siswa"
                                  : "Admin"}
                          </span>
                        </div>
                        {/* Kelas */}
                        {comment.user?.students?.classes?.name && (
                          <span className="text-xs text-muted-foreground">
                            {comment.user.students.classes.name}
                          </span>
                        )}
                      </div>

                      {/* Tombol titik tiga */}
                      {canShowDropdown(comment.user?.id) && (
                        <div className="relative ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(openDropdown === comment.id ? null : comment.id);
                            }}
                            className="p-1 rounded-full hover:bg-gray-100 transition"
                          >
                            <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                          </button>

                          {openDropdown === comment.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                              <button
                                onClick={() => handleDeletePost(comment.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <TrashIcon className="h-5 w-5 mr-2" /> Hapus Komentar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>


                <p className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</p>
                <p className="text-xs text-muted-foreground mt-2">{convertTime(comment.created_at)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Komentar Input */}
        {/* Floating comment bar */}
        <section className="fixed bottom-0 left-0 right-0 z-50 bg-[#ffffff] text-white px-4 py-3 border-t md:border-neutral-700 md:static md:mt-10 md:rounded-xl md:border-none ">
          <div className="max-w-4xl md:max-w-7xl mx-auto flex items-end gap-3">
            {/* Avatar */}
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover"
            />

           { /* Chat Input Bubble */}
                  <div className="flex flex-1 items-center bg-[#ffffff] rounded-2xl px-4 py-2 focus-within:ring-2 ring-blue-500 border">
                    <textarea
                    value={commentText}
                    onChange={(e) => {
                      if (errorCensored) setErrorCensored(false); // Reset error state
                      setCommentText(e.target.value);
                    }}
                    rows={1}
                    placeholder="Tulis komentar Anda..."
                    className="flex-1 bg-transparent resize-none text-sm text-black placeholder:text-gray-400 border-0 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handlePostComment();
                      }
                    }}
                    />
                  </div>

                  {/* Send Button */}
            <button
              onClick={handlePostComment}
              disabled={isSending || !commentText.trim()}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>

          {errorCensored && (
            <p className="text-red-500 text-sm mt-2">
              Komentar mengandung bahasa yang tidak pantas. Silakan ubah.
            </p>
          )}
        </section>


      </main>

      <footer className="mt-5 py-6 border-t text-center text-sm text-muted-foreground">
        © 2025 SIMONIK Discus. All rights reserved.
      </footer>
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
      return `${hours} jam yang lalu`;
    } else if (days < 7) {
      return `${days} hari yang lalu `;
    } else {
      return weeks === 1 ? "1 minggu yang lalu" : `${weeks} minggu yang lalu`;
    }
  }
}

export default ForumDetail;
