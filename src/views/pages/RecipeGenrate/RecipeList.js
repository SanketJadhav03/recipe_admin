import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import AuthUser from '../../../auth/AuthUser' // Check your path
import CIcon from '@coreui/icons-react'
import { 
  cilPencil, 
  cilPlus, 
  cilTrash, 
  cilClock, 
  cilBurn, 
  cilFastfood 
} from '@coreui/icons'

// Note: Import your Add/Update components here when you create them
// import RecipeAdd from './RecipeAdd'
// import RecipeUpdate from './RecipeUpdate'

const RecipeList = () => {
  const { http } = AuthUser()
  const [recipes, setRecipes] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  
  // Modal States (For future use)
  const [modalStates, setModalStates] = useState(false)
  const [editData, setEditData] = useState(null)

  // 1. Fetch Data
  const getRecipesList = async () => {
    setLoading(true)
    http
      .get('/recipes/list')
      .then((res) => {
        if (res.data.status === 1) {
          setRecipes(res.data.data)
        }
      })
      .catch((err) => {
        console.error('Error fetching recipes:', err)
        toast.error("Failed to fetch recipes")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 2. Initial Load
  useEffect(() => {
    getRecipesList()
  }, [count])

  // 3. Delete Logic
  const deleteData = (id) => {
    if(window.confirm("Are you sure you want to delete this recipe?")) {
        http
        .delete(`/recipes/delete/${id}`) // Assuming you have this route
        .then((res) => {
            setCount(count + 1)
            toast.success(res.data.message || "Recipe Deleted")
        })
        .catch((err) => {
            toast.error("Error deleting recipe")
        })
    }
  }

  return (
    <div className="card shadow-sm">
      {/* Header Section */}
      <div className="card-body border-bottom d-flex justify-content-between align-items-center">
        <div>
          <h4 className="card-title mb-0">Recipe Management</h4>
          <small className="text-muted">Total Recipes: {recipes.length}</small>
        </div>
        <button
          className="btn btn-primary btn-sm text-white"
          onClick={() => setModalStates(!modalStates)}
        >
          <CIcon icon={cilPlus} className="me-2" /> Add New Recipe
        </button>
      </div>

      {/* Table Section */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">#</th>
                <th>Image</th>
                <th>Recipe Details</th>
                <th>Cuisine / Type</th>
                <th>Author</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                    <td colSpan="7" className="text-center p-5">Loading Recipes...</td>
                </tr>
              ) : recipes.map((item, index) => (
                <tr key={item._id}>
                  <td className="ps-4 fw-bold">{index + 1}</td>
                  
                  {/* Image Column */}
                  <td>
                    <div 
                        style={{
                            width: '60px', 
                            height: '60px', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            border: '1px solid #dee2e6'
                        }}
                    >
                        <img 
                            src={item.recipe_image} 
                            alt={item.recipe_name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    </div>
                  </td>

                  {/* Name & Stats Column */}
                  <td style={{ maxWidth: '250px' }}>
                    <h6 className="mb-1 text-dark text-truncate" title={item.recipe_name}>
                        {item.recipe_name}
                    </h6>
                    <div className="d-flex gap-2">
                        <span className="badge bg-light text-dark border">
                            <CIcon icon={cilBurn} size="sm" className="me-1 text-danger"/>
                            {item.recipe_kcal}
                        </span>
                        <span className="badge bg-light text-dark border">
                            <CIcon icon={cilClock} size="sm" className="me-1 text-info"/>
                            {item.recipe_time}
                        </span>
                    </div>
                  </td>

                  {/* Cuisine Column */}
                  <td>
                    <div className="d-flex flex-column">
                        <span className="fw-semibold">{item.recipe_cuisine}</span>
                        <small className="text-muted">{item.recipe_meal_type}</small>
                    </div>
                  </td>

                  {/* Author Column */}
                  <td>
                    <div className="d-flex flex-column">
                        <span className="fw-semibold text-dark">
                            {item.customer_id?.customer_name || 'Unknown'}
                        </span>
                        <small className="text-muted" style={{fontSize: '0.75rem'}}>
                            {item.customer_id?.customer_email}
                        </small>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td>
                    {item.recipe_status === 1 ? (
                      <span className="badge bg-success-gradient text-white px-3 py-2 rounded-pill">
                        Active
                      </span>
                    ) : (
                      <span className="badge bg-secondary text-white px-3 py-2 rounded-pill">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      title="Edit"
                      onClick={() => setEditData(item)}
                    >
                      <CIcon icon={cilPencil} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Delete"
                      onClick={() => deleteData(item._id)}
                    >
                      <CIcon icon={cilTrash} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {!loading && recipes.length === 0 && (
                 <tr>
                    <td colSpan="7" className="text-center p-4 text-muted">
                        No recipes found.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logic for Modals (Uncomment when you have the components) */}
      {/* {modalStates && (
        <RecipeAdd
          modalStates={modalStates}
          setModalStates={() => {
            setModalStates(!modalStates)
            setCount(count + 1)
          }}
        />
      )}
      {editData != null && (
        <RecipeUpdate
          edit_data={editData}
          modalStates={editData != null}
          setModalStates={() => {
            setEditData(null)
            setCount(count + 1)
          }}
        />
      )} 
      */}
    </div>
  )
}

export default RecipeList