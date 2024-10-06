import PageContent from "./PageContent";
import LeftSidebar from "./LeftSidebar";
import { useSelector, useDispatch } from 'react-redux';
import RightSidebar from './RightSidebar';
import { useEffect, useState } from "react";
import { removeNotificationMessage } from "../features/common/headerSlice";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ModalLayout from "./ModalLayout";
import Swal from 'sweetalert2';

function Layout() {
  const dispatch = useDispatch();
  const { newNotificationMessage, newNotificationStatus } = useSelector(state => state.header);

  // State to track previous connection status
  const [wasOnline, setWasOnline] = useState(navigator.onLine);

  // Function to handle connection change
  function handleConnectionChange() {
    if (navigator.onLine) {
      // Internet is connected
      if (!wasOnline) {
        // Notify user that they are now online
        Swal.fire({
          title: 'Terhubung ke Internet',
          text: 'Anda sekarang terhubung ke internet.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    } else {
      // No internet connection
      Swal.fire({
        title: 'Tidak Ada Koneksi Internet',
        text: 'Anda tidak terhubung ke internet. Harap sambungkan ke jaringan.',
        icon: 'warning',
        confirmButtonText: 'Segarkan Halaman',
        showCancelButton: true,
        cancelButtonText: 'Batal',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Refresh the page
          window.location.reload();
        }
      });
    }

    // Update the previous connection status
    setWasOnline(navigator.onLine);
  }

  // Check connection on page load
  useEffect(() => {
    handleConnectionChange(); // Check on initial load

    // Add event listeners for online and offline events
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (newNotificationMessage !== "") {
      if (newNotificationStatus === 1) NotificationManager.success(newNotificationMessage, 'Success');
      if (newNotificationStatus === 0) NotificationManager.error(newNotificationMessage, 'Error');
      dispatch(removeNotificationMessage());
    }
  }, [newNotificationMessage]);

  return (
    <>
      { /* Left drawer - containing page content and side bar (always open) */ }
      <div className="drawer lg:drawer-open">
        <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
        <PageContent />
        <LeftSidebar />
      </div>

      { /* Right drawer - containing secondary content like notifications list etc.. */ }
      <RightSidebar />

      {/** Notification layout container */}
      <NotificationContainer />

      {/* Modal layout container */}
      <ModalLayout />
    </>
  );
}

export default Layout;
