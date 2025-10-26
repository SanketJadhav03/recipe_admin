import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import {
    CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { cilEnvelopeLetter, cilMap, cilPhone, cilUser } from '@coreui/icons'
import CustomerAdd from './CustomerAdd'

function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

 
  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/customer/list') // replace with your API
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  // Fetch customer data from API
  useEffect(() => {
    fetchCustomers()
  }, [])
 const handleCustomerAdded = (newCustomer) => {
     fetchCustomers()
  }
  return (
    <CCard>
      <CCardHeader>Customer List</CCardHeader>
      <CButton color="primary" onClick={() => setModalVisible(true)}>
        Add Customer
      </CButton>
      <CCardBody>
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Phone</CTableHeaderCell>
              <CTableHeaderCell>Address</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {customers.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={5} className="text-center">
                  No customers found
                </CTableDataCell>
              </CTableRow>
            ) : (
              customers.map((customer, index) => (
                <CTableRow key={customer._id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilUser} className="me-2" />
                    {customer.customer_name}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilEnvelopeLetter} className="me-2" />
                    {customer.customer_email}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilPhone} className="me-2" />
                    {customer.customer_phone}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilMap} className="me-2" />
                    {customer.customer_address}
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </CCardBody>

      <CustomerAdd
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCustomerAdded={handleCustomerAdded}
      />
    </CCard>
  )
}

export default CustomerList
