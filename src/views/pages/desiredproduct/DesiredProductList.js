import { cilPencil, cilPlus, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import DesiredProductAdd from './DesiredProductAdd'
import DesiredProductUpdate from './DesiredProductUpdate'
import AuthUser from '../../../auth/AuthUser'
import { toast } from 'react-toastify'

function DesiredProductList() {
  const [modalStates, setModalStates] = useState(false)
  const [updateModalStates, setUpdateModalStates] = useState(false)
  const [count, setCount] = useState(0)
  const { http } = AuthUser()
  const [edit_data, setEditData] = useState(null)
  const [desiredproducts, setDesiredProducts] = useState([])
  const getDesiredProductsList = async () => {
    http
      .get('/desiredproducts/list')
      .then((res) => {
        if (res.data.data.length > 0) {
          setDesiredProducts(res.data.data)
        }
      })
      .catch((err) => {
        console.log('====================================')
        console.log(err)
        console.log('====================================')
      })
  }
  useEffect(() => {
    getDesiredProductsList()
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
      .delete(`/desiredproducts/delete/${id}`)
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
            <h2>DesiredProduct List</h2>
          </div>
          <div className="col-6 text-end">
            <div
              className="btn btn-primary"
              onClick={() => {
                setModalStates(!modalStates)
              }}
            >
              <CIcon icon={cilPlus} /> Add DesiredProducts
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
              {desiredproducts.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.desiredproduct_name}</td>
                  <td>
                    {item.desiredproduct_status == 1 ? (
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
        <DesiredProductAdd
          modalStates={modalStates}
          setModalStates={() => {
            setModalStates(!modalStates)
            setCount(count + 1)
          }}
        />
      )}
      {edit_data != null && (
        <DesiredProductUpdate
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

export default DesiredProductList
