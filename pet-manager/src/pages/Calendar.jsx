import React, { useEffect, useState } from 'react';
import useEventsStore from '../store/useEventsStore';
import { useAuth } from '../store/AuthContext';

import AddEventModal from '../components/AddEventModal';
import ConfirmationModal from '../components/ConfirmationModal';

import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../App.css';

const localizer = dayjsLocalizer(dayjs);

const MyCalendar = () => {
  const { events, loading, fetchEvents, removeEvent } = useEventsStore();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const components = {
    event: (props) => (
      <div style={{ color: "black", fontSize: "12px", position: "relative" }}>
        <span>{props.title} {props.event.pet && `with ${props.event.pet}`}</span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents clicking on the calendar event itself
            handleDeleteClick(props.event);
          }}
          className="absolute right-0 top-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
        >
          X
        </button>
      </div>
    ),
    toolbar: (props) => {
      return (
        <div className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
          {/* Left Side - Navigation */}
          <div className="flex gap-2">
            <button onClick={() => props.onNavigate("TODAY")} className="btn">
              Today
            </button>
            <button onClick={() => props.onNavigate("PREV")} className="btn">
              Back
            </button>
            <button onClick={() => props.onNavigate("NEXT")} className="btn">
              Next
            </button>
            <button onClick={openModal} className="btn bg-blue-500 text-white px-3 py-1 rounded-md">
              Add Event
            </button>
          </div>

          {/* Center - Month Label */}
          <span className="text-lg font-bold">{props.label}</span>

          {/* Right Side - View Selection */}
          <div className="flex gap-2">
            <button onClick={() => props.onView("month")} className="btn">
              Month
            </button>
            <button onClick={() => props.onView("week")} className="btn">
              Week
            </button>
            <button onClick={() => props.onView("day")} className="btn">
              Day
            </button>
            <button onClick={() => props.onView("agenda")} className="btn">
              Agenda
            </button>
          </div>
        </div>
      );
    },
  };

  const openModal = () => {
    setShowModal(true);
    console.log(events)
  }

  const closeModal = () => {
    setShowModal(false);
  }

  // Fetch events
  useEffect(() => {
    if (user) {
      fetchEvents(user.$id);
    }
  }, [user]);

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setIsConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await removeEvent(eventToDelete.id);
      fetchEvents(user.$id); // Fetch the updated events list
      setEventToDelete(null);
      setIsConfirmVisible(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }

  const cancelDelete = () => {
    setEventToDelete(null);
    setIsConfirmVisible(false);
  };

  return (
    
    <div className='max-w-11/12 justify-center mx-auto max-h-screen mt-6'>

      {showModal && <AddEventModal closeModal={closeModal} />}

      {loading && <p>Loading events...</p>}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        components={components}
      />

      <ConfirmationModal
        show={isConfirmVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message={`Are you sure you want to delete "${eventToDelete?.title}"?`}
      />

    </div>
  );
};

export default MyCalendar;
