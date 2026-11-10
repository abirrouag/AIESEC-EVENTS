import React, { useState } from 'react';
import api from '../api';

// EventForm component: controlled form to create a new AIESEC event
function EventForm({ onEventCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !date) {
      setError('Please fill in all event fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Send POST request with token automatically added by api interceptor
      const response = await api.post('/events', {
        title,
        description,
        date
      });

      setSuccess('Event published successfully!');
      // Notify parent component to update events state
      onEventCreated(response.data);

      // Reset form fields
      setTitle('');
      setDescription('');
      setDate('');
    } catch (err) {
      console.error('Failed to create event:', err);
      setError(err.response?.data?.message || 'Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>
        ➕ Add New AIESEC Event
      </h3>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-info">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Global Village 2026, Leadership Workshop..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Event Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Describe the purpose, location, agenda, and expectations..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Publishing...' : 'Publish Event'}
        </button>
      </form>
    </div>
  );
}

export default EventForm;

