import { cilSave, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import AuthUser from '../../../auth/AuthUser'

function UnwantedProductAdd(props) {
  const [unwantedproduct, setUnwantedProduct] = useState({
    unwantedproduct_name: '',
    unwantedproduct_marathi_name: '',
    unwantedproduct_hindi_name: '',
    unwantedproduct_status: 1,
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
    if (
      !unwantedproduct.unwantedproduct_name ||
      !unwantedproduct.unwantedproduct_marathi_name ||
      !unwantedproduct.unwantedproduct_hindi_name
    ) {
      toast.error('All unwanted product names are required!')
      return
    }

    http
      .post('/unwantedproducts/store', unwantedproduct)
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

        setUnwantedProduct((prev) => ({
          ...prev,
          unwantedproduct_marathi_name:
            mrData?.responseData?.translatedText ||
            prev.unwantedproduct_marathi_name,
          unwantedproduct_hindi_name:
            hiData?.responseData?.translatedText ||
            prev.unwantedproduct_hindi_name,
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
        Add Unwanted Product
      </ModalHeader>

      <ModalBody className="rounded">
        <div className="p-2">
          {/* ENGLISH */}
          <div className="mb-3">
            <label className="fw-bold mb-1">Unwanted Product (English)</label>
            <input
              ref={inputRef}
              className="form-control"
              placeholder="e.g. Garlic"
              value={unwantedproduct.unwantedproduct_name}
              onChange={(e) => {
                const value = e.target.value
                setUnwantedProduct({
                  ...unwantedproduct,
                  unwantedproduct_name: value,
                })
                handleEnglishTranslate(value)
              }}
            />
          </div>

          {/* MARATHI */}
          <div className="mb-3">
            <label className="fw-bold mb-1">Unwanted Product (Marathi)</label>
            <input
              className="form-control"
              placeholder="उदा. लसूण"
              value={unwantedproduct.unwantedproduct_marathi_name}
              onChange={(e) =>
                setUnwantedProduct({
                  ...unwantedproduct,
                  unwantedproduct_marathi_name: e.target.value,
                })
              }
            />
          </div>

          {/* HINDI */}
          <div className="mb-3">
            <label className="fw-bold mb-1">Unwanted Product (Hindi)</label>
            <input
              className="form-control"
              placeholder="उदा. लहसुन"
              value={unwantedproduct.unwantedproduct_hindi_name}
              onChange={(e) =>
                setUnwantedProduct({
                  ...unwantedproduct,
                  unwantedproduct_hindi_name: e.target.value,
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
              <CIcon icon={cilSave} className="me-1" /> Save
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

export default UnwantedProductAdd
