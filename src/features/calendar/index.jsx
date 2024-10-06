import { useEffect, useState } from "react";
import CalendarView from "../../components/CalendarView";
import moment from "moment";
import { useDispatch } from "react-redux";
import { openRightDrawer } from "../common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../../utils/globalConstantUtil";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import swal from "sweetalert2";
import Api from "../../api";
import Cookies from "js-cookie";
import momentTZ from "moment-timezone";

const INITIAL_EVENTS = []; // Initialize as empty or with some default data if needed

function Calendar() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalInfo, setModalInfo] = useState(null);
  const [industri, setIndustri] = useState([]); // Ensure it's initialized as an empty array
  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("user"));

  // Properly create companyOptions
  const companyOptions = industri.map((company) => ({
    value: company.id,
    label: company.name
  }));

  const fetchEvents = async () => {
    try {
      const response = await Api.get("/admin/jadwal", {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const data = response.data.data;
      const formattedEvents = Object.keys(data).flatMap((date) => {
        const groupDateMoment = momentTZ(date).tz("Asia/Jakarta");
  
        return data[date].map((event) => {
          const startDate = groupDateMoment.startOf("day").format("YYYY-MM-DD");
          const endDate = groupDateMoment.endOf("day").format("YYYY-MM-DD");
  
          const theme = event.status === "kunjungan"
            ? "PURPLE"
            : event.status === "penjemputan"
            ? "ORANGE"
            : event.status === "keberangkatan"
            ? "BLUE"
            : "DEFAULT_COLOR"; // Warna default
  
          return {
            title: `${event.status} PKL ke ${event.industri_name}`,
            start: startDate,
            end: endDate,
            company: event.user_name,
            theme, // Menambahkan theme yang sesuai dengan status
            industri_name: event.industri_name
          };
        });
      });
  
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };


  const fetchData = async () => {
    try {
      const response = await Api.get("admin/industri", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIndustri(response.data.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchEvents();
    fetchData();
  }, []);

  const addNewEvent = () => {
    const modal = document.getElementById("my_modal_1");
    if (modal) {
      modal.showModal();
    }
  };

  const fixEvent = async () => {
  const eventDate = document.getElementById("eventDate").value;
  const eventType = document.getElementById("eventType").value;

  if (eventDate && eventType && selectedCompany) {
    const modal = document.getElementById("my_modal_1");
    if (modal) {
      modal.close();
    }

    const result = await swal.fire({
      title: "Absen",
      text: "Apakah Anda yakin ingin menambahkan jadwal?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, absen!"
    });

    if (result.isConfirmed) {
      const theme = eventType === "kunjungan"
        ? "PURPLE"
        : eventType === "penjemputan"
        ? "ORANGE"
        : eventType === "keberangkatan"
        ? "BLUE"
        : "DEFAULT_COLOR";

      const eventDateMoment = moment(eventDate).startOf("day");
      const newEventObj = {
        status: eventType,
        date: eventDateMoment.format("YYYY-MM-DD"),
        user_id: user.id,
        industri_id: selectedCompany.value
      };

      try {
        await Api.post("/admin/jadwal", newEventObj, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const localStart = eventDateMoment.format("YYYY-MM-DD");
        const localEnd = eventDateMoment.endOf("day").format("YYYY-MM-DD");

        setEvents((prevEvents) => [
          ...prevEvents,
          {
            ...newEventObj,
            start: localStart,
            end: localEnd,
            title: `${eventType} ke ${selectedCompany.label}`,
            theme
          }
        ]);
        toast.success("New Event Added!");
      } catch (error) {
        toast.error("Error adding event. Please try again.");
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  } else {
    toast.error("Please fill in all required fields");
  }
};

  const onDateClick = (date) => {
    const filteredEvents = events.filter((event) =>
      moment(date).isSame(moment(event.start), "day")
    );

    const title = moment(date).format("D MMM YYYY");

    openDayDetail({ filteredEvents, title });
  };

  const openDayDetail = ({ filteredEvents, title }) => {
    dispatch(
      openRightDrawer({
        header: title,
        bodyType: RIGHT_DRAWER_TYPES.CALENDAR_EVENTS,
        extraObject: { filteredEvents }
      })
    );
  };

  return (
    <>
      <CalendarView
        calendarEvents={events}
        addNewEvent={addNewEvent}
        openDayDetail={openDayDetail}
        onDateClick={onDateClick}
      />

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Tambah Jadwal</h3>
          <form id="eventForm" className="py-4">
            <label className="block mb-2">Tanggal:</label>
            <input
              type="date"
              id="eventDate"
              className="input input-bordered w-full mb-4"
              required
            />

            <label className="block mb-2">Tipe Event:</label>
            <select
              id="eventType"
              className="select select-bordered w-full mb-4"
              required
            >
              <option value="keberangkatan">Keberangkatan PKL</option>
              <option value="kunjungan">Kunjungan PKL</option>
              <option value="penjemputan">Penjemputan PKL</option>
            </select>

            <label className="block mb-2">Perusahaan:</label>
            <Select
              options={companyOptions}
              value={selectedCompany}
              onChange={setSelectedCompany}
              placeholder="Select a company"
              className="mb-4"
              required
            />
          </form>
          <div className="modal-action">
            <button
              onClick={fixEvent}
              type="button"
              className="pl-4 btn btn-success btn-sm hover:btn-primary"
            >
              Tambah
            </button>
            <button
              onClick={() => document.getElementById("my_modal_1").close()}
              type="button"
              className="ml-4 btn btn-sm btn-error hover:btn-primary"
            >
              Tutup
            </button>
          </div>
        </div>
      </dialog>

      <ToastContainer />
    </>
  );
}

export default Calendar;
