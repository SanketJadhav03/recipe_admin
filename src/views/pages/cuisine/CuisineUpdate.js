import { cilSave, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import AuthUser from '../../../auth/AuthUser'

function CuisineUpdate(props) {
  const [cuisine, setCuisine] = useState(props.edit_data)
  const submitRef = useRef(null)
  const { http } = AuthUser()
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'x') {
        props.setModalStates()
      }
      if (e.altKey && e.key.toLowerCase() === 's') {
        submitRef.current.click()
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])
  const saveData = () => {
    if (cuisine.cuisine_name == '') {
      toast.error('Cuisines Name Cannot be empty!')
    } else {
      http
        .put('/cuisines/update', cuisine)
        .then((res) => {
          if (res.data.status == 0) {
            toast.error(res.data.message)
        } else {
            toast.success(res.data.message)
            props.setModalStates()
          }
        })
        .catch((err) => {
          console.log('====================================')
          console.log(err)
          console.log('====================================')
        })
    }
  }
  return (
    <Modal size="md" isOpen={props.modalStates} toggle={props.setModalStates} centered>
      <ModalHeader toggle={props.setModalStates}>
        <div className="d-flex justify-content-between">
          <div className="">Update Cuisines</div>
        </div>
      </ModalHeader>
      <ModalBody className="rounded">
        <div className="  p-2 ">
          <div>
            <div className="fw-bold mb-2">Cuisine Name</div>
            <input
              className="form-control"
              placeholder="Cuisine Name"
              value={cuisine.cuisine_name}
              onChange={(e) => {
                setCuisine({
                  ...cuisine,
                  cuisine_name: e.target.value,
                })
              }}
            />
          </div>

          <div className="text-end mt-4">
            <div className="btn btn-success text-light shadow" ref={submitRef} onClick={saveData}>
              <CIcon icon={cilSave} className="me-1 text-white" /> Save
            </div>
            <div className="ms-2 btn btn-danger text-light shadow" onClick={props.setModalStates}>
              <CIcon icon={cilX} className="me-1 text-white" /> Close
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default CuisineUpdate
