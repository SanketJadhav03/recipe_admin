import React, { useState } from 'react'
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

function CustomerAdd({ visible, onClose, onCustomerAdded }) {
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
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      })
      const data = await response.json()
      if (data.status == 1) {
        onCustomerAdded(data)
        onClose() // Close modal after adding
      } else {
        alert('Error adding customer')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error adding customer')
    }
    setLoading(false)
  }

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
