import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, deleteEvent } from '../redux/eventsSlice';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';

// Home page: lists all events connected to Redux Toolkit store
function Home({ currentUser, onNavigate }) {
  const dispatch = useDispatch();
  const { items: events, loading, error } = useSelector((state) => state.events);

  // Fetch all events on initial mount via Redux thunk
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Handle delete via Redux thunk
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    dispatch(deleteEvent(eventId));
  };

  return (
    <div>
      {/* Banner introduction */}
      <section className="hero">
        <h1>Welcome to AIESEC Hub</h1>
        <p>
          Discover upcoming committee events, exchange opportunities, leadership
          workshops, and share your feedback.
        </p>
      </section>

      {/* Conditional rendering for Members: Event creation form */}
      {currentUser ? (
        <EventForm />
      ) : (
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>Are you an AIESEC member?</strong>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Log in to publish new events and leave feedback.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('login')}>
            Sign In / Register
          </button>
        </div>
      )}

      {/* Events section title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem' }}>Upcoming Events ({events.length})</h2>
        <button
          className="btn btn-outline btn-small"
          onClick={() => dispatch(fetchEvents())}
          title="Refresh list"
        >
          🔄 Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading state */}
      {loading && (
        <div className="empty-state">
          <p>Loading events...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && events.length === 0 && (
        <div className="card empty-state">
          <h3>No events found</h3>
          <p>There are no events scheduled yet. Be the first to create one!</p>
        </div>
      )}

      {/* List of events */}
      {!loading && events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          currentUser={currentUser}
          onDeleteEvent={handleDeleteEvent}
        />
      ))}
    </div>
  );
}

export default Home;
