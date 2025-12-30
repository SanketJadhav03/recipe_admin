import { cilScreenSmartphone, cilSend } from '@coreui/icons' // Updated Icon
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
    if (!title || !message) {
      toast.error("Please enter title and message")
      return
    }

    setLoading(true)

    // --- OneSignal Configuration ---
    const ONESIGNAL_APP_ID = "1124f496-e550-46bb-bdef-a45bff90c82d"
    const REST_API_KEY = "os_v2_app_cespjfxfkbdlxpppurn77egifwaxfsm673ieoceyt2chgrzwrarpq77s5pv6jmorloyya3iyh5gl32ifnnz2skukcc652zssjsyerca"

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Basic ${REST_API_KEY}`
    }


    const data = {
      app_id: ONESIGNAL_APP_ID,
      included_segments: ["Total Subscriptions"], // Sends to All (App + Web)
      headings: { "en": title },
      contents: { "en": message },
      ...(imageUrl && {
        big_picture: imageUrl,    
        large_icon: imageUrl,     
        chrome_web_image: imageUrl, 
        ios_attachments: { "id1": imageUrl } 
      })
    }

    try {
      await axios.post("https://onesignal.com/api/v1/notifications", data, { headers: headers })
      toast.success("App Notification Sent Successfully!")
      setTitle('')
      setMessage('')
      setImageUrl('')
    } catch (error) {
      console.log('====================================')
      console.log(error)
      console.log('====================================')
      toast.error("Failed to send notification")
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

          {/* New Image URL Input */}
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

          {/* Send Button with App Icon */}
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