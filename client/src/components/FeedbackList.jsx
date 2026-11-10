import React, { useState, useEffect } from 'react';
import api from '../api';

// FeedbackList component: displays and manages feedback comments for a single event
function FeedbackList({ eventId, currentUser }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch feedbacks for this event when the component mounts
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/feedbacks/${eventId}`);
        setFeedbacks(response.data);
      } catch (err) {
        console.error('Failed to load feedbacks:', err);
        setError('Could not load feedbacks');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [eventId]);

  // Handle adding new feedback
  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    try {
      setError('');
      // Send POST request with feedback text and eventId
      const response = await api.post('/feedbacks', {
        text: newText,
        eventId: eventId
      });

      // Append new feedback to the top of list
      setFeedbacks([response.data, ...feedbacks]);
      setNewText('');
    } catch (err) {
      console.error('Failed to post feedback:', err);
      setError(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  // Handle deleting feedback (allowed for author only)
  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await api.delete(`/feedbacks/${feedbackId}`);
      // Remove deleted feedback from state
      setFeedbacks(feedbacks.filter((item) => item._id !== feedbackId));
    } catch (err) {
      console.error('Failed to delete feedback:', err);
      alert(err.response?.data?.message || 'Failed to delete feedback');
    }
  };

  return (
    <div className="feedback-section">
      <h4 style={{ fontSize: '0.95rem', marginBottom: '8px', color: 'var(--text-main)' }}>
        Feedbacks ({feedbacks.length})
      </h4>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading feedbacks...</p>
      ) : feedbacks.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
          No feedback yet. Be the first to share your thoughts!
        </p>
      ) : (
        feedbacks.map((fb) => {
          // Check if current user is the author of this feedback
          const isAuthor = currentUser && (
            (typeof fb.author === 'object' && fb.author?._id === currentUser._id) ||
            fb.author === currentUser._id
          );

          return (
            <div key={fb._id} className="feedback-item">
              <div className="feedback-top">
                <span className="feedback-author">
                  {fb.author?.name || 'Anonymous Member'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                  {isAuthor && (
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleDeleteFeedback(fb._id)}
                      title="Delete your feedback"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="feedback-text">{fb.text}</p>
            </div>
          );
        })
      )}

      {/* Conditional rendering: Logged-in form vs Visitor notice */}
      {currentUser ? (
        <form onSubmit={handleAddFeedback} className="feedback-form">
          <input
            type="text"
            className="form-control"
            placeholder="Write constructive feedback for this event..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-small">
            Comment
          </button>
        </form>
      ) : (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          <em>Log in as a member to post feedback.</em>
        </p>
      )}
    </div>
  );
}

export default FeedbackList;

