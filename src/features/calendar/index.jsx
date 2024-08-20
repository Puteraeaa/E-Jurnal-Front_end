import { useEffect, useState } from "react";
import CalendarView from "../../components/CalendarView";
import moment from "moment";
import { CALENDAR_INITIAL_EVENTS } from "../../utils/dummyData";
import { useDispatch } from "react-redux";
import { openRightDrawer } from "../common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../../utils/globalConstantUtil";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import swal from "sweetalert2";




const INITIAL_EVENTS = CALENDAR_INITIAL_EVENTS;

function Calendar() {
    const dispatch = useDispatch();
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalInfo, setModalInfo] = useState(null);

    const companyOptions = [
        { value: 'Company A', label: 'Company A' },
        { value: 'Company B', label: 'Company B' },
        { value: 'Company C', label: 'Company C' }
        // Add more options or fetch from database
    ];

    const addNewEvent = () => {
        const modal = document.getElementById('my_modal_1');
        if (modal) {
            modal.showModal();
        }
    };

    const fixEvent = async () => {
        const eventDate = document.getElementById('eventDate').value;
        const eventType = document.getElementById('eventType').value;
    
        // Check if all required fields are filled
        if (eventDate && eventType && selectedCompany) {
            // Close the modal before showing SweetAlert2
            const modal = document.getElementById('my_modal_1');
            if (modal) {
                modal.close();
            }
    
            // Show the SweetAlert2 confirmation dialog
            const result = await swal.fire({
                title: "Absen",
                text: "Apakah Anda yakin ingin menambahkan jadwal?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya, absen!",
            });
    
            // If user confirms, add the new event
            if (result.isConfirmed) {
                const title = `${eventType} ke ${selectedCompany.label}`;
                const theme = eventType === 'kunjungan' ? 'ORANGE' : 'GREEN';
                const newEventObj = {
                    title,
                    theme,
                    startTime: moment(eventDate).startOf('day'),
                    endTime: moment(eventDate).endOf('day'),
                    company: selectedCompany.label,
                };
    
                // Add the new event to the events list
                setEvents([...events, newEventObj]);
                if(result.isConfirmed){
                    toast.success("New Event Added!");}
               
            }
        } else {
            // Show an error if required fields are missing
            toast.error("Please fill in all required fields");
        }
    };
    
    

    const onDateClick = (date) => {
        const filteredEvents = events.filter(event =>
            moment(date).isSame(moment(event.startTime), 'day')
        );

        const title = moment(date).format("D MMM YYYY");

        openDayDetail({ filteredEvents, title });
    };

    const openDayDetail = ({ filteredEvents, title }) => {
        dispatch(openRightDrawer({
            header: title,
            bodyType: RIGHT_DRAWER_TYPES.CALENDAR_EVENTS,
            extraObject: { filteredEvents }
        }));
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
                    <h3 className="font-bold text-lg">Tambah Jadwal </h3>
                    <form id="eventForm" className="py-4">
                        <label className="block mb-2">Tanggal:</label>
                        <input type="date" id="eventDate" className="input input-bordered w-full mb-4" required />

                        <label className="block mb-2">Tipe Event:</label>
                        <select id="eventType" className="select select-bordered w-full mb-4" required>
                            <option value="kunjungan">Kunjungan PKL</option>
                            <option value="keberangkatan">Keberangkatan PKL</option>
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
                        <button onClick={fixEvent } type="submit"  className="pl-4 btn btn-success btn-sm hover:btn-primary">Tambah</button>
                        <button onClick={() => document.getElementById('my_modal_1').close()} className="ml-4 btn btn-sm btn-error hover:btn-primary">Tutup</button>
                    </div>
                </div>
            </dialog>

            

            <ToastContainer />
        </>
    );
}

export default Calendar;
