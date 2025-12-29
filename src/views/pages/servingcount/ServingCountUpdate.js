import { cilSave, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import AuthUser from '../../../auth/AuthUser'

function ServingCountUpdate(props) {
  const [servingcount, setServingCount] = useState(props.edit_data)

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
      !servingcount.servingcount_name ||
      !servingcount.servingcount_marathi_name ||
      !servingcount.servingcount_hindi_name
    ) {
      toast.error('All serving count names are required!')
      return
    }

    http
      .put('/servingcounts/update', servingcount)
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

        setServingCount((prev) => ({
          ...prev,
          servingcount_marathi_name:
            mrData?.responseData?.translatedText ||
            prev.servingcount_marathi_name,
          servingcount_hindi_name:
            hiData?.responseData?.translatedText ||
            prev.servingcount_hindi_name,
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
        Update Serving Count
      </ModalHeader>

      <ModalBody className="rounded">
        <div className="p-2">
          {/* ENGLISH */}
          <div className="mb-3">
            <div className="fw-bold mb-2">Serving Count (English)</div>
            <input
              className="form-control"
              placeholder="e.g. 2 Persons"
              value={servingcount.servingcount_name || ''}
              onChange={(e) => {
                const value = e.target.value
                setServingCount({
                  ...servingcount,
                  servingcount_name: value,
                })
                handleEnglishTranslate(value)
              }}
            />
          </div>

          {/* MARATHI */}
          <div className="mb-3">
            <div className="fw-bold mb-2">Serving Count (Marathi)</div>
            <input
              className="form-control"
              placeholder="उदा. २ जण"
              value={servingcount.servingcount_marathi_name || ''}
              onChange={(e) =>
                setServingCount({
                  ...servingcount,
                  servingcount_marathi_name: e.target.value,
                })
              }
            />
          </div>

          {/* HINDI */}
          <div className="mb-3">
            <div className="fw-bold mb-2">Serving Count (Hindi)</div>
            <input
              className="form-control"
              placeholder="उदा. 2 लोग"
              value={servingcount.servingcount_hindi_name || ''}
              onChange={(e) =>
                setServingCount({
                  ...servingcount,
                  servingcount_hindi_name: e.target.value,
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

export default ServingCountUpdate
