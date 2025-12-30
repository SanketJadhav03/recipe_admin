import { cilScreenSmartphone, cilSend } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function SendPush() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    // 1. Validation
    if (!title || !message) {
      toast.error("Please enter title and message")
      return
    }

    setLoading(true)

    // 2. Data Preparation
    const payload = {
      title: title,
      message: message,
      imageUrl: imageUrl // Optional Image
    }

    // 3. Connect to YOUR Node.js Backend
    // तुमच्या server.js मध्ये PORT 8080 आहे, म्हणून 8080 वापरा
    const BACKEND_URL = "http://localhost:8080/api/send-notification";

    try {
      const response = await axios.post(BACKEND_URL, payload);
      
      if(response.data.success) {
        toast.success("Notification Sent Successfully! 🚀")
        // Reset Form
        setTitle('')
        setMessage('')
        setImageUrl('')
      } else {
        toast.error("Failed to send notification.")
      }

    } catch (error) {
      console.log('Error:', error)
      toast.error("Error: Could not connect to Backend (Check if Node Server is running on 8080)")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-body border-bottom">
        <div className="row">
          <div className="col-12">
            <h2>Send App Notification</h2>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Title Input */}
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label">Notification Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="New Recipe Alert!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Message Input */}
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Check out this new spicy recipe..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Image URL Input */}
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label">Image URL (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://example.com/image.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <div className="form-text">Paste a direct image link to show a big picture in the App.</div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-12 mt-2">
            <button
              className="btn btn-success text-white"
              onClick={handleSend}
              disabled={loading}
            >
              <CIcon icon={cilScreenSmartphone} className="me-2" />
              {loading ? "Sending..." : "Send to All Devices"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendPush