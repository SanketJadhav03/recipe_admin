import { cilSave, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import AuthUser from '../../../auth/AuthUser'

function MealTypeUpdate(props) {
  const [mealType, setMealType] = useState(props.edit_data)

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
      !mealType.mealType_name ||
      !mealType.mealType_marathi_name ||
      !mealType.mealType_hindi_name
    ) {
      toast.error('All meal type names are required!')
      return
    }

    http
      .put('/mealTypes/update', mealType)
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

        setMealType((prev) => ({
          ...prev,
          mealType_marathi_name:
            mrData?.responseData?.translatedText ||
            prev.mealType_marathi_name,
          mealType_hindi_name:
            hiData?.responseData?.translatedText ||
            prev.mealType_hindi_name,
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
        Update Meal Type
      </ModalHeader>

      <ModalBody className="rounded">
        <div className="p-2">
          {/* ENGLISH */}
          <div className="mb-3">
            <div className="fw-bold mb-2">Meal Type (English)</div>
            <input
              className="form-control"
              placeholder="Meal Type Name"
              value={mealType.mealType_name || ''}
              onChange={(e) => {
                const value = e.target.value
                setMealType({ ...mealType, mealType_name: value })
                handleEnglishTranslate(value)
              }}
            />
          </div>

          {/* MARATHI */}
          <div className="mb-3">
            <div className="fw-bold mb-2">Meal Type (Marathi)</div>
            <input
              className="form-control"
              placeholder="उदा. नाश्ता"
              value={mealType.mealType_marathi_name || ''}
              onChange={(e) =>
                setMealType({
                  ...mealType,
                  mealType_marathi_name: e.target.value,
                })
              }
            />
          </div>

          {/* HINDI */}
          <div className="mb-3">
            <div className="fw-bold mb-2">Meal Type (Hindi)</div>
            <input
              className="form-control"
              placeholder="उदा. नाश्ता"
              value={mealType.mealType_hindi_name || ''}
              onChange={(e) =>
                setMealType({
                  ...mealType,
                  mealType_hindi_name: e.target.value,
                })
              }
            />
          </div>

          {/* BUTTONS */}
          <div className="text-end mt-4">
            <div
              ref={submitRef}
              className="btn btn-success text-light shadow"
              onClick={saveData}
            >
              <CIcon icon={cilSave} className="me-1 text-white" /> Update
            </div>

            <div
              className="ms-2 btn btn-danger text-light shadow"
              onClick={props.setModalStates}
            >
              <CIcon icon={cilX} className="me-1 text-white" /> Close
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default MealTypeUpdate
