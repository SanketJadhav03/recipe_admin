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
import { cilEnvelopeLetter, cilMap, cilPencil, cilPhone, cilPlus, cilTrash, cilUser, cilUserPlus } from '@coreui/icons'
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
      <CCardHeader>
        <div className="d-flex justify-content-between align-items-center  ">
          <div>
            <div className="h3">Customer List</div>
          </div>
          <div >
            <CButton className='d-flex justify-content-between gap-1 align-items-center' color="primary" onClick={() => setModalVisible(true)}>
              <CIcon icon={cilUserPlus}  />
              Add Customer
            </CButton>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTable   hover responsive>
          <CTableHead color="light" >
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Phone</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
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
                    {customer.customer_name}
                  </CTableDataCell>
                  <CTableDataCell>
                    {customer.customer_email}
                  </CTableDataCell>
                  <CTableDataCell>
                    {customer.customer_phone}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className='d-flex justify-content-start gap-1 align-items-center'>
                      <div className='btn btn-sm'>
                                <CIcon icon={cilPencil} className='text-success'></CIcon>
                      </div>
                      <div className='btn btn-sm'>
                      <CIcon icon={cilTrash} className='text-danger  '></CIcon>
                      </div>
                    </div>
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
