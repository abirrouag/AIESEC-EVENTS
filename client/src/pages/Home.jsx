import React, { useState, useEffect } from 'react';
import api from '../api';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';

// Home page: lists all events and allows members to publish new ones
function Home({ currentUser, onNavigate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all events on initial load using useEffect
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Unable to load events from the server.');
    } finally {
      setLoading(false);
    }
  };

  // Callback passed to EventForm when a new event is created
  const handleEventCreated = (newEvent) => {
    // Add new event to the list
    setEvents([newEvent, ...events]);
  };

  // Callback to delete an event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/events/${eventId}`);
      // Remove deleted event from state
      setEvents(events.filter((item) => item._id !== eventId));
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert(err.response?.data?.message || 'Failed to delete event');
    }
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
        <EventForm onEventCreated={handleEventCreated} />
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
          onClick={fetchEvents}
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

