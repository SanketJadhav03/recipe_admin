import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import CuisineAdd from './CuisineAdd'
import CuisineUpdate from './CuisineUpdate'
import AuthUser from '../../../auth/AuthUser'

function CuisineList() {
  const [modalStates, setModalStates] = useState(false)
  const [updateModalStates, setUpdateModalStates] = useState(false)
  const [count, setCount] = useState(0)
  const { http } = AuthUser()
  const [cuisines, setCuisines] = useState([])
  const getCuisinesList = async () => {
    http
      .get('/cuisines/list')
      .then((res) => {
        if (res.data.length > 0) {
          setCuisines(res.data)
        }
      })
      .catch((err) => {
        console.log('====================================')
        console.log(err)
        console.log('====================================')
      })
  }
  useEffect(() => {
    getCuisinesList()
  }, [count])
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        setModalStates(true)
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <div className="card">
      <div className="card-body border-bottom">
        <div className="row">
          <div className="col-6">
            <h2>Cuisine List</h2>
          </div>
          <div className="col-6 text-end">
            <div
              className="btn btn-primary"
              onClick={() => {
                setModalStates(!modalStates)
              }}
            >
              <CIcon icon={cilPlus} /> Add Cuisines
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      {modalStates && (
        <CuisineAdd
          modalStates={modalStates}
          setModalStates={() => {
            setModalStates(!modalStates)
          }}
        />
      )}
      {updateModalStates && (
        <CuisineUpdate
          edit
          modalStates={updateModalStates}
          setModalStates={() => {
            setUpdateModalStates(!updateModalStates)
          }}
        />
      )}
    </div>
  )
}

export default CuisineList
