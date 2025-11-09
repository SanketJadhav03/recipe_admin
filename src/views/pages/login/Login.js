import React, { useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import AuthUser from '../../../auth/AuthUser'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const {http }= AuthUser();
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await http.post('/admin/login', {
        username,
        password,
      })

      if (response.data) { 
        sessionStorage.setItem('token', response.data.token)
        sessionStorage.setItem('authUSer', response.data.admin) 
        navigate('/dashboard')
      } else {
        setError('Invalid credentials. Please try again.')
      }
    } catch (err) {
      console.error('Login Error:', err)
      setError('Something went wrong. Please try again later.')
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} lg={4}>
            <CCardGroup>
              <CCard className="p-4 shadow-lg border-0 rounded-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <div className="text-center mb-4">
                      <h2 className="fw-bold text-primary">Admin Login</h2>
                      <p className="text-muted small mb-0">
                        Please sign in to access the dashboard
                      </p>
                    </div>

                    {error && <CAlert color="danger">{error}</CAlert>}

                    <CInputGroup className="mb-3">
                      <CInputGroupText className="bg-primary text-white border-0">
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText className="bg-primary text-white border-0">
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={12} className="text-center">
                        <CButton type="submit" color="primary" className="px-5 py-2 shadow-sm">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
