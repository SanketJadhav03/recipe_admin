import { cilSave, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import AuthUser from '../../../auth/AuthUser'

function CuisineAdd(props) {
  const [cuisine, setCuisine] = useState({
    cuisine_name: '',
    cuisine_marathi_name: '',
    cuisine_hindi_name: '',
    cuisine_status: 1,
  })

  const submitRef = useRef(null)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  const { http } = AuthUser()

  /* ================= SHORTCUT KEYS ================= */
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'x') props.setModalStates()
      if (e.altKey && e.key.toLowerCase() === 's') {
        submitRef.current.click()
        inputRef.current.focus()
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  /* ================= SAVE DATA ================= */
  const saveData = () => {
    if (!cuisine.cuisine_name || !cuisine.cuisine_marathi_name || !cuisine.cuisine_hindi_name) {
      toast.error('All cuisine names are required!')
      return
    }

    http
      .post('/cuisines/store', cuisine)
      .then((res) => {
        if (res.data.status === 0) toast.error(res.data.message)
        else {
          toast.success(res.data.message)
          props.setModalStates()
        }
      })
      .catch(() => toast.error('Server error'))
  }

  /* ================= FAST ENGLISH → MR + HI ================= */
  const handleEnglishTranslate = (value) => {
    if (value.length < 3) return

    // clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const [mrRes, hiRes] = await Promise.all([
          fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
              value,
            )}&langpair=en|mr`,
          ),
          fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
              value,
            )}&langpair=en|hi`,
          ),
        ])

        const mrData = await mrRes.json()
        const hiData = await hiRes.json()

        setCuisine((prev) => ({
          ...prev,
          cuisine_marathi_name:
            mrData?.responseData?.translatedText || prev.cuisine_marathi_name,
          cuisine_hindi_name:
            hiData?.responseData?.translatedText || prev.cuisine_hindi_name,
        }))
      } catch (error) {
        console.error('Translation error:', error)
      }
    }, 600) // 🔥 smooth & fast
  }

  /* ================= UI ================= */
  return (
    <Modal size="md" isOpen={props.modalStates} toggle={props.setModalStates} centered>
      <ModalHeader toggle={props.setModalStates}>Add Cuisines</ModalHeader>

      <ModalBody>
        <div className="p-2">
          {/* ENGLISH */}
          <div className="mb-3">
            <label className="fw-bold mb-1">Cuisine Name (English)</label>
            <input
              ref={inputRef}
              className="form-control"
              placeholder="Cuisine Name"
              value={cuisine.cuisine_name}
              onChange={(e) => {
                const value = e.target.value
                setCuisine({ ...cuisine, cuisine_name: value })
                handleEnglishTranslate(value)
              }}
            />
          </div>

          {/* MARATHI */}
          <div className="mb-3">
            <label className="fw-bold mb-1">Cuisine Name (Marathi)</label>
            <input
              className="form-control"
              placeholder="उदा. महाराष्ट्रीयन"
              value={cuisine.cuisine_marathi_name}
              onChange={(e) =>
                setCuisine({ ...cuisine, cuisine_marathi_name: e.target.value })
              }
            />
          </div>

          {/* HINDI */}
          <div className="mb-3">
            <label className="fw-bold mb-1">Cuisine Name (Hindi)</label>
            <input
              className="form-control"
              placeholder="उदा. महाराष्ट्रीय"
              value={cuisine.cuisine_hindi_name}
              onChange={(e) =>
                setCuisine({ ...cuisine, cuisine_hindi_name: e.target.value })
              }
            />
          </div>

          {/* BUTTONS */}
          <div className="text-end mt-4">
            <button
              ref={submitRef}
              className="btn btn-success shadow me-2"
              onClick={saveData}
            >
              <CIcon icon={cilSave} className="me-1" /> Save
            </button>

            <button
              className="btn btn-danger shadow"
              onClick={props.setModalStates}
            >
              <CIcon icon={cilX} className="me-1" /> Close
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default CuisineAdd
