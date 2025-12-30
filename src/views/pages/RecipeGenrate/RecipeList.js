import { cilDescription, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import AuthUser from '../../../auth/AuthUser'
import RecipeView from './RecipeView' // Import the View Component

function RecipeList() {
  const [count, setCount] = useState(0)
  const { http } = AuthUser()
  
  // Using viewData instead of edit_data for clarity, but logic is same
  const [viewData, setViewData] = useState(null) 
  const [recipes, setRecipes] = useState([])

  // FETCH DATA
  const getRecipesList = async () => {
    http
      .get('/recipes/list')
      .then((res) => {
        if (res.data.status === 1) {
          setRecipes(res.data.data)
        }
      })
      .catch((err) => {
        console.log('Error:', err)
      })
  }

  useEffect(() => {
    getRecipesList()
  }, [count])

  // DELETE DATA
  const deleteData = (id) => {
    if(window.confirm("Are you sure you want to delete this?")) {
        http
        .delete(`/recipes/delete/${id}`)
        .then((res) => {
            setCount(count + 1)
            toast.success(res.data.message)
        })
        .catch((err) => {
            toast.error("Server Error")
        })
    }
  }

  return (
    <div className="card">
      <div className="card-body border-bottom">
        <div className="row">
          <div className="col-6">
            <h2>Recipe List</h2>
          </div>
          {/* No Add Button as requested, just List */}
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table text-center align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Cuisine</th>
                <th>Time/Kcal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  
                  {/* Image Thumbnail */}
                  <td>
                    <img 
                        src={item.recipe_image} 
                        style={{width:'50px', height:'50px', borderRadius:'5px', objectFit:'cover'}}
                        alt="thumb"
                    />
                  </td>

                  <td>{item.recipe_name}</td>
                  <td><span className="badge bg-secondary">{item.recipe_cuisine}</span></td>
                  
                  <td>
                     <small className="d-block text-muted">{item.recipe_time}</small>
                     <small className="d-block text-danger">{item.recipe_kcal}</small>
                  </td>

                  <td>
                    {/* VIEW BUTTON */}
                    <div
                      className="btn btn-info shadow text-white btn-sm me-1"
                      onClick={() => {
                        setViewData(item) // Opens the Modal
                      }}
                    >
                      <CIcon icon={cilDescription} />
                    </div>

                    {/* DELETE BUTTON */}
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

      {/* --- VIEW MODAL LOGIC (Same as Update Logic) --- */}
      {viewData != null && (
        <RecipeView
          viewData={viewData}
          modalStates={viewData != null}
          setModalStates={() => {
            setViewData(null) // Closes modal
          }}
        />
      )}
    </div>
  )
}

export default RecipeList