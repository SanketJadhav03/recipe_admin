import React, { useEffect, useState } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
} from '@coreui/react'
import AuthUser from '../../../auth/AuthUser'
import { toast } from 'react-toastify'

function CustomerUpdate({ visible, onClose, editData, onCustomerAdded }) {
  const { http } = AuthUser()

  const [customer, setCustomer] = useState(editData)
  const [loading, setLoading] = useState(false)

  // Sync edit data when modal opens
  useEffect(() => {
    setCustomer(editData)
  }, [editData])

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await http.put(`/customer/update/${customer._id}`, customer)

      if (res.data.status === 1) {
        toast.success('Customer Updated Successfully!')
        onCustomerAdded()
        onClose()
      } else {
        toast.error('Update failed')
      }
    } catch (error) {
      console.error('Update Error:', error)
    }

    setLoading(false)
  }

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'c') {
        onClose()
      }
      if (e.altKey && e.key.toLowerCase() === 's') {
        handleSubmit(e)
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Update Customer</CModalTitle>
      </CModalHeader>

      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Name</CFormLabel> 
            <CFormInput
              name="customer_name"
              value={customer.customer_name || ''}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <CFormLabel>Email</CFormLabel>
            <CFormInput
              type="email"
              name="customer_email"
              value={customer.customer_email || ''}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <CFormLabel>Phone</CFormLabel>
            <CFormInput
              name="customer_phone"
              value={customer.customer_phone || ''}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <CFormLabel>Address</CFormLabel>
            <CFormTextarea
              name="customer_address"
              value={customer.customer_address || ''}
              onChange={handleChange}
            />
          </div>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Cancel
          </CButton>
          <CButton color="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default CustomerUpdate
