import React, { useEffect, useState, useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from '@coreui/react'
import { cilPlus, cilTrash, cilPencil, cilCheck } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toastify'
import AuthUser from '../../../auth/AuthUser'

const APIConfiguration = () => {
  const { http } = AuthUser()

  const [apiList, setApiList] = useState([])
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({
    api_name: '',
    base_url: '',
    api_key: '',
    status: 1, // number
  })

  const submitRef = useRef(null)

  /* ================= FETCH API LIST ================= */
  const fetchApiList = () => {
    http
      .get('/appconfig/list')
      .then((res) => {
        if (res.data.status === 1) {
          setApiList(res.data.data)
        } else {
          setApiList([])
        }
      })
      .catch(() => toast.error('Failed to fetch API list'))
  }

  useEffect(() => {
    fetchApiList()
  }, [])

  /* ================= HANDLE INPUT CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  /* ================= ADD / UPDATE API ================= */
  const handleAddOrUpdate = () => {
    if (!formData.api_name || !formData.base_url) {
      toast.error('API Name and Base URL are required')
      return
    }

    // ADD API
    if (!editId) {
      http
        .post('/appconfig/store', {
          api_name: formData.api_name,
          base_url: formData.base_url,
          api_key: formData.api_key,
          status: Number(formData.status),
        })
        .then((res) => {
          if (res.data.status === 1) {
            toast.success(res.data.message)
            fetchApiList()
            resetForm()
          } else {
            toast.error(res.data.message)
          }
        })
        .catch(() => toast.error('Server error'))
    }

    // UPDATE API
    else {
      http
        .put(`/appconfig/update/${editId}`, {
          api_name: formData.api_name,
          base_url: formData.base_url,
          api_key: formData.api_key,
          status: Number(formData.status),
        })
        .then((res) => {
          if (res.data.status === 1) {
            toast.success(res.data.message)
            fetchApiList()
            resetForm()
          } else {
            toast.error(res.data.message)
          }
        })
        .catch(() => toast.error('Server error'))
    }
  }

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setFormData({
      api_name: '',
      base_url: '',
      api_key: '',
      status: 1,
    })
    setEditId(null)
  }

  /* ================= EDIT API ================= */
  const handleEdit = (item) => {
    setFormData({
      api_name: item.api_name,
      base_url: item.base_url,
      api_key: item.api_key || '',
      status: item.status,
    })
    setEditId(item._id) // ✅ FIX
  }

  /* ================= DELETE API ================= */
  const handleDelete = (id) => {
    if (!id) {
      toast.error('Invalid API ID')
      return
    }

    if (!window.confirm('Are you sure you want to delete this API?')) return

    http
      .delete(`/appconfig/delete/${id}`)
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.message)
          fetchApiList()
        } else {
          toast.error(res.data.message)
        }
      })
      .catch(() => toast.error('Server error'))
  }

  return (
    <CCard className="shadow-sm border-0">
      <CCardHeader className="fw-semibold">API Configuration</CCardHeader>

      <CCardBody>
        {/* FORM */}
        <CForm className="mb-4">
          <CRow className="g-3">
            <CCol md={3}>
              <CFormLabel>API Name</CFormLabel>
              <CFormInput
                name="api_name"
                value={formData.api_name}
                onChange={handleChange}
                placeholder="Google Maps"
              />
            </CCol>

            <CCol md={3}>
              <CFormLabel>Base URL</CFormLabel>
              <CFormInput
                name="base_url"
                value={formData.base_url}
                onChange={handleChange}
                placeholder="https://api.example.com"
              />
            </CCol>

            <CCol md={3}>
              <CFormLabel>API Key</CFormLabel>
              <CFormInput
                name="api_key"
                value={formData.api_key}
                onChange={handleChange}
                placeholder="Stored securely"
              />
            </CCol>

            <CCol md={2}>
              <CFormLabel>Status</CFormLabel>
              <CFormSelect
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </CFormSelect>
            </CCol>

            <CCol md={1} className="d-flex align-items-end">
              <CButton
                color={editId ? 'success' : 'primary'}
                onClick={handleAddOrUpdate}
                ref={submitRef}
              >
                <CIcon icon={editId ? cilCheck : cilPlus} />
              </CButton>
            </CCol>
          </CRow>
        </CForm>

        {/* TABLE */}
        <CTable hover responsive bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>API Name</CTableHeaderCell>
              <CTableHeaderCell>Base URL</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {apiList.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan={5} className="text-center text-muted">
                  No APIs configured
                </CTableDataCell>
              </CTableRow>
            ) : (
              apiList.map((item, index) => (
                <CTableRow key={item._id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.api_name}</CTableDataCell>
                  <CTableDataCell>{item.base_url}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge
                      color={item.status === 1 ? 'success' : 'secondary'}
                    >
                      {item.status === 1 ? 'Active' : 'Inactive'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(item)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default APIConfiguration
