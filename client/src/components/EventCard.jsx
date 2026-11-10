import React, { useState } from 'react';
import FeedbackList from './FeedbackList';

// EventCard component: displays single event details with action buttons and feedbacks
function EventCard({ event, currentUser, onDeleteEvent }) {
  const [showFeedbacks, setShowFeedbacks] = useState(false);

  // Check if current user is the author of this event
  const isAuthor = currentUser && (
    (typeof event.author === 'object' && event.author?._id === currentUser._id) ||
    event.author === currentUser._id
  );

  // Format event date nicely
  const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="card">
      <div className="event-header">
        <h3 className="event-title">{event.title}</h3>
        {/* Only author can see and use the Delete button */}
        {isAuthor && (
          <button
            className="btn btn-danger"
            onClick={() => onDeleteEvent(event._id)}
            title="Delete this event"
          >
            Delete Event
          </button>
        )}
      </div>

      <div className="event-meta">
        <span className="event-meta-item">
          📅 <strong>Date:</strong> {formattedDate}
        </span>
        <span className="event-meta-item">
          👤 <strong>Organizer:</strong> {event.author?.name || 'AIESEC Member'}
        </span>
      </div>

      <p className="event-description">{event.description}</p>

      {/* Button to toggle feedback list */}
      <button
        className="feedback-toggle-btn"
        onClick={() => setShowFeedbacks(!showFeedbacks)}
      >
        💬 {showFeedbacks ? 'Hide Feedbacks' : 'View / Add Feedbacks'}
      </button>

      {/* Conditionally rendered Feedback section */}
      {showFeedbacks && (
        <FeedbackList eventId={event._id} currentUser={currentUser} />
      )}
    </div>
  );
}

export default EventCard;

