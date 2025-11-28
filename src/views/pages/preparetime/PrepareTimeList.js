import { cilPencil, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import PrepareTimeAdd from './PrepareTimeAdd'
import PrepareTimeUpdate from './PrepareTimeUpdate'
import AuthUser from '../../../auth/AuthUser'
import { toast } from 'react-toastify'

function PrepareTimeList() {
  const [modalStates, setModalStates] = useState(false)
  const [updateModalStates, setUpdateModalStates] = useState(false)
  const [count, setCount] = useState(0)
  const { http } = AuthUser()
  const [edit_data, setEditData] = useState(null)
  const [preparetimes, setPrepareTimes] = useState([])
  const getPrepareTimesList = async () => {
    http
      .get('/preparetimes/list')
      .then((res) => {
        if (res.data.data.length > 0) {
          setPrepareTimes(res.data.data)
        }
      })
      .catch((err) => {
        console.log('====================================')
        console.log(err)
        console.log('====================================')
      })
  }
  useEffect(() => {
    getPrepareTimesList()
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
  const deleteData = (id) => {
    http
      .delete(`/preparetimes/delete/${id}`)
      .then((res) => {
        setCount(count + 1)
        toast.success(res.data.message)
      })
      .catch((err) => {
        console.log('====================================')
        console.log(err)
        console.log('====================================')
      })
  }

  return (
    <div className="card">
      <div className="card-body border-bottom">
        <div className="row">
          <div className="col-6">
            <h2>PrepareTime List</h2>
          </div>
          <div className="col-6 text-end">
            <div
              className="btn btn-primary"
              onClick={() => {
                setModalStates(!modalStates)
              }}
            >
              <CIcon icon={cilPlus} /> Add PrepareTimes
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
            <tbody>
              {preparetimes.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.preparetime_name}</td>
                  <td>
                    {item.preparetime_status == 1 ? (
                      <div className="badge bg-success">Active</div>
                    ) : (
                      <div className="badge bg-danger">Inactive</div>
                    )}
                  </td>
                  <td>
                    <div
                      className="btn btn-info shadow text-white btn-sm me-1"
                      onClick={() => {
                        setEditData(item)
                      }}
                    >
                      <CIcon icon={cilPencil} />
                    </div>
                    <div
                      className="btn btn-danger shadow text-white btn-sm"
                      onClick={() => {
                        deleteData(item._id)
                      }}
                    >
                      <CIcon icon={cilTrash} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalStates && (
        <PrepareTimeAdd
          modalStates={modalStates}
          setModalStates={() => {
            setModalStates(!modalStates)
            setCount(count + 1)
          }}
        />
      )}
      {edit_data != null && (
        <PrepareTimeUpdate
          edit_data={edit_data}
          modalStates={edit_data != null}
          setModalStates={() => {
            setEditData(null)
            setCount(count + 1)
          }}
        />
      )}
    </div>
  )
}

export default PrepareTimeList
