import { cilSave, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import AuthUser from '../../../auth/AuthUser'

function PrepareTimeUpdate(props) {
  const [preparetime, setPrepareTime] = useState(props.edit_data)

  const submitRef = useRef(null)
  const debounceRef = useRef(null)
  const { http } = AuthUser()

  /* ================= SHORTCUT KEYS ================= */
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'x') props.setModalStates()
      if (e.altKey && e.key.toLowerCase() === 's') submitRef.current.click()
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  /* ================= SAVE DATA ================= */
  const saveData = () => {
    if (
      !preparetime.preparetime_name ||
      !preparetime.preparetime_marathi_name ||
      !preparetime.preparetime_hindi_name
    ) {
      toast.error('All prepare time names are required!')
      return
    }

    http
      .put('/preparetimes/update', preparetime) // ✅ BODY-BASED UPDATE
      .then((res) => {
        if (res.data.status === 0) toast.error(res.data.message)
        else {
          toast.success(res.data.message)
          props.setModalStates()
        }
      })
      .catch(() => toast.error('Server error'))
  }

  /* ================= ENGLISH → MR + HI ================= */
  const handleEnglishTranslate = (value) => {
    if (value.length < 1) return

    if (debounceRef.current) clearTimeout(debounceRef.current)

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

        setPrepareTime((prev) => ({
          ...prev,
          preparetime_marathi_name:
            mrData?.responseData?.translatedText ||
            prev.preparetime_marathi_name,
          preparetime_hindi_name:
            hiData?.responseData?.translatedText ||
            prev.preparetime_hindi_name,
        }))
      } catch (error) {
        console.error('Translation error:', error)
      }
    }, 600)
  }

  /* ================= UI ================= */
  return (
    <Modal size="md" isOpen={props.modalStates} toggle={props.setModalStates} centered>
      <ModalHeader toggle={props.setModalStates}>
        Update Prepare Time
      </ModalHeader>

      <ModalBody className="rounded">
        <div className="p-2">
          {/* ENGLISH */}
          <div className="mb-3">
            <label className="fw-bold mb-1">Prepare Time (English)</label>
            <input
              className="form-control"
              placeholder="e.g. 45 Minutes"
              value={preparetime.preparetime_name || ''}
              onChange={(e) => {
                const value = e.target.value
                setPrepareTime({
                  ...preparetime,
                  preparetime_name: value,
                })
                handleEnglishTranslate(value)
              }}
            />
          </div>

          {/* MARATHI */}
          <div className="mb-3">
            <label className="fw-bold mb-1">Prepare Time (Marathi)</label>
            <input
              className="form-control"
              placeholder="उदा. ४५ मिनिटे"
              value={preparetime.preparetime_marathi_name || ''}
              onChange={(e) =>
                setPrepareTime({
                  ...preparetime,
                  preparetime_marathi_name: e.target.value,
                })
              }
            />
          </div>

          {/* HINDI */}
          <div className="mb-3">
            <label className="fw-bold mb-1">Prepare Time (Hindi)</label>
            <input
              className="form-control"
              placeholder="उदा. ४५ मिनट"
              value={preparetime.preparetime_hindi_name || ''}
              onChange={(e) =>
                setPrepareTime({
                  ...preparetime,
                  preparetime_hindi_name: e.target.value,
                })
              }
            />
          </div>

          {/* BUTTONS */}
          <div className="text-end mt-4">
            <button
              ref={submitRef}
              className="btn btn-success text-light shadow me-2"
              onClick={saveData}
            >
              <CIcon icon={cilSave} className="me-1" /> Update
            </button>

            <button
              className="btn btn-danger text-light shadow"
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

export default PrepareTimeUpdate
