import { cilPencil, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import MealTypeAdd from './MealTypeAdd'
import MealTypeUpdate from './MealTypeUpdate'
import AuthUser from '../../../auth/AuthUser'
import { toast } from 'react-toastify'

function MealTypeList() {
  const [modalStates, setModalStates] = useState(false)
  const [updateModalStates, setUpdateModalStates] = useState(false)
  const [count, setCount] = useState(0)
  const { http } = AuthUser()
  const [edit_data, setEditData] = useState(null)
  const [mealTypes, setMealTypes] = useState([])
  const getMealTypesList = async () => {
    http
      .get('/mealTypes/list')
      .then((res) => {
        if (res.data.data.length > 0) {
          setMealTypes(res.data.data)
        }
      })
      .catch((err) => {
        console.log('====================================')
        console.log(err)
        console.log('====================================')
      })
  }
  useEffect(() => {
    getMealTypesList()
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
      .delete(`/mealTypes/delete/${id}`)
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
            <h2>MealType List</h2>
          </div>
          <div className="col-6 text-end">
            <div
              className="btn btn-primary"
              onClick={() => {
                setModalStates(!modalStates)
              }}
            >
              <CIcon icon={cilPlus} /> Add MealTypes
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table text">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                    <th>Marathi</th>
                <th>Hindi</th>
                <th>Status</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {mealTypes.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.mealType_name}</td>
                  <td>{item.mealType_marathi_name}</td>
                  <td>{item.mealType_hindi_name}</td>
                  <td>
                    {item.mealType_status == 1 ? (
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
        <MealTypeAdd
          modalStates={modalStates}
          setModalStates={() => {
            setModalStates(!modalStates)
            setCount(count + 1)
          }}
        />
      )}
      {edit_data != null && (
        <MealTypeUpdate
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

export default MealTypeList
