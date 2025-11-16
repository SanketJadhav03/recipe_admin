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
import { cilPencil, cilTrash, cilUserPlus } from '@coreui/icons'
import CustomerAdd from './CustomerAdd'
import AuthUser from '../../../auth/AuthUser'
import CustomerUpdate from './CustomerUpdate'

function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [editData, setEditData] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const { http } = AuthUser()
  const fetchCustomers = async () => {
    try {
      http
        .get('/customer/list')
        .then((res) => {
          setCustomers(res.data)
        })
        .catch((err) => {
          console.log('====================================')
          console.log(err)
          console.log('====================================')
        })
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        setModalVisible(true)
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  // Fetch customer data from API
  useEffect(() => {
    fetchCustomers()
  }, [])

  return (
    <CCard>
      <CCardHeader>
        <div className="d-flex justify-content-between align-items-center  ">
          <div>
            <div className="h3">Customer List</div>
          </div>
          <div>
            <CButton
              className="d-flex justify-content-between gap-1 align-items-center"
              color="primary"
              onClick={() => setModalVisible(true)}
            >
              <CIcon icon={cilUserPlus} />
              Add Customer
            </CButton>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <thead>
            <tr className="bg-light">
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <CTableBody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer, index) => (
                <tr key={customer._id}>
                  <td>{index + 1}</td>
                  <td>{customer.customer_name}</td>
                  <td>{customer.customer_email}</td>
                  <td>{customer.customer_phone}</td>
                  <td>
                    <div className="d-flex justify-content-start gap-1 align-items-center">
                      <div
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          setEditData(customer)
                        }}
                      >
                        <CIcon icon={cilPencil} className="text-white"></CIcon>
                      </div>
                      <div className="btn btn-sm btn-danger text-white">
                        <CIcon icon={cilTrash}></CIcon>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </CTableBody>
        </CTable>
      </CCardBody>

      <CustomerAdd
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCustomerAdded={() => {
          fetchCustomers()
        }}
      />
      <CustomerUpdate
        visible={editData?.customer_name ? true : false}
        onClose={() => setEditData({})}
        editData={editData}
        onCustomerAdded={() => {
          fetchCustomers()
        }}
      />
    </CCard>
  )
}

export default CustomerList
