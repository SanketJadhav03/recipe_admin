import { cilScreenSmartphone, cilSend, cilTrash, cilHistory } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useState, useEffect } from 'react'
import AuthUser from '../../../auth/AuthUser' // ✅ Correctly Imported AuthUser
import { toast } from 'react-toastify'

function SendPush() {
  const { http } = AuthUser() 
  
 
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

 
  const [notifications, setNotifications] = useState([])
  const [count, setCount] = useState(0) 


  const getNotificationList = async () => {
    http.get('/notification/list')
      .then((res) => {
        if (res.data.status === 1) {
          setNotifications(res.data.data)
        }
      })
      .catch((err) => {
        console.error("Error fetching list:", err)
      })
  }


  useEffect(() => {
    getNotificationList()
  }, [count])


  const handleSend = async () => {

    if (!title || !message) {
      toast.error("Please enter title and message")
      return
    }

    setLoading(true)

    const payload = {
      title: title,
      message: message,
      imageUrl: imageUrl 
    }

    http.post('/notification/send', payload)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success("Notification Sent Successfully! 🚀")

          setTitle('')
          setMessage('')
          setImageUrl('')

          setCount(count + 1)
        } else {
          toast.error("Failed to send notification.")
        }
      })
      .catch((err) => {
        console.error('Error:', err)
        toast.error("Error connecting to server")
      })
      .finally(() => {
        setLoading(false)
      })
  }


  const deleteData = (id) => {
    if(!window.confirm("Are you sure you want to delete this history record?")) return;

    http.delete(`/notification/delete/${id}`)
      .then((res) => {
        if(res.data.status === 1){
            toast.success(res.data.message)
            setCount(count + 1) 
        } else {
            toast.error("Failed to delete")
        }
      })
      .catch((err) => {
        console.error(err)
        toast.error("Error deleting record")
      })
  }

  return (
    <div className="row">
      <div className="col-md-5">
        <div className="card h-100">
          <div className="card-header bg-white">
            <h4 className="mb-0 mt-2">
               <CIcon icon={cilScreenSmartphone} className="me-2" /> Send Notification
            </h4>
          </div>
          <div className="card-body">
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

            <div className="mb-3">
              <label className="form-label">Image URL (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://example.com/image.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <button
              className="btn btn-success text-white w-100"
              onClick={handleSend}
              disabled={loading}
            >
              <CIcon icon={cilSend} className="me-2" />
              {loading ? "Sending..." : "Send Now"}
            </button>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: HISTORY LIST --- */}
      <div className="col-md-7">
        <div className="card h-100">
           <div className="card-header bg-white">
            <h4 className="mb-0 mt-2">
               <CIcon icon={cilHistory} className="me-2" /> History
            </h4>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.length === 0 ? (
                      <tr>
                          <td colSpan="5" className="text-center p-4">No notifications sent yet.</td>
                      </tr>
                  ) : (
                      notifications.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="fw-bold">{item.notification_title}</td>
                          <td>
                              {/* Truncate long messages for cleaner table */}
                              <small className="text-muted" style={{display:'block', maxWidth:'200px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                                  {item.notification_message}
                              </small>
                          </td>
                          <td>
                              <small>{new Date(item.created_at).toLocaleDateString()}</small>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-danger btn-sm text-white shadow-sm"
                              onClick={() => deleteData(item._id)}
                              title="Delete History"
                            >
                              <CIcon icon={cilTrash} />
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendPush