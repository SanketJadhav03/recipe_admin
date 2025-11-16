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
import { toast } from 'react-toastify'
import AuthUser from '../../../auth/AuthUser'

function CustomerAdd({ visible, onClose, onCustomerAdded }) {
  const { http } = AuthUser()
  const [customer, setCustomer] = useState({
    customer_name: '',
    customer_email: '',
    customer_password: '',
    customer_phone: '',
    customer_address: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // ==========================
    // ⭐ FORM VALIDATION
    // ==========================
    if (!customer.customer_name?.trim()) {
      toast.error('Customer name is required!')
      return
    }

    if (!customer.customer_email?.trim()) {
      toast.error('Email is required!')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer.customer_email)) {
      toast.error('Invalid email address!')
      return
    }

    if (!customer.customer_phone?.trim()) {
      toast.error('Phone number is required!')
      return
    }

    if (customer.customer_phone.length < 10) {
      toast.error('Phone must be at least 10 digits!')
      return
    }

    if (!customer.customer_address?.trim()) {
      toast.error('Address is required!')
      return
    }

    setLoading(true)

    try {
      const res = await http.put(`/customer/update/${customer._id}`, customer)

      if (res.data?.status === 1) {
        toast.success('Customer updated successfully!')
        onCustomerAdded()
        onClose()
      } else {
        toast.error(res.data?.message || 'Failed to update!')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!')
      console.log(error)
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
        <CModalTitle>Add Customer</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Name</CFormLabel> 
            <CFormInput
              type="text"
              name="customer_name"
              value={customer.customer_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Email</CFormLabel>
            <CFormInput
              type="email"
              name="customer_email"
              value={customer.customer_email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Password</CFormLabel>
            <CFormInput
              type="password"
              name="customer_password"
              value={customer.customer_password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Phone</CFormLabel>
            <CFormInput
              type="text"
              name="customer_phone"
              value={customer.customer_phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel>Address</CFormLabel>
            <CFormTextarea
              name="customer_address"
              value={customer.customer_address}
              onChange={handleChange}
              required
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

export default CustomerAdd
