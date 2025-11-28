import { cilSave, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import AuthUser from '../../../auth/AuthUser'

function UnwantedProductAdd(props) {
  const [unwantedproduct, setUnwantedProduct] = useState({
    unwantedproduct_name: '',
    unwantedproduct_status: 1,
  })
  const submitRef = useRef(null)
  const inputRef = useRef(null)
  const { http } = AuthUser()
  useEffect(() => {
    
    const handleShortcut = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'x') {
        props.setModalStates()
      }
      if (e.altKey && e.key.toLowerCase() === 's') {
        submitRef.current.click()
        inputRef.current.focus()
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])
  const saveData = () => {
    if (unwantedproduct.unwantedproduct_name == '') {
      toast.error('UnwantedProducts Name Cannot be empty!')
    } else {
      http
        .post('/unwantedproducts/store', unwantedproduct)
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
          <div className="">Add UnwantedProducts</div>
        </div>
      </ModalHeader>
      <ModalBody className="rounded">
        <div className="  p-2 ">
          <div>
            <div className="fw-bold mb-2">UnwantedProduct Name</div>
            <input 
              className="form-control"
              placeholder="UnwantedProduct Name"
              ref={inputRef}
              value={unwantedproduct.unwantedproduct_name}
              onChange={(e) => {
                setUnwantedProduct({
                  ...unwantedproduct,
                  unwantedproduct_name: e.target.value,
                })
              }}
            />
          </div>
          

          <div className="text-end mt-4">
            <div ref={submitRef} className="btn btn-success text-light shadow" onClick={saveData}>
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

export default UnwantedProductAdd
