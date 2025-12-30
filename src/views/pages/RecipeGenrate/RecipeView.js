import { 
  cilClock, 
  cilBurn, 
  cilArrowLeft, 
  cilFastfood, 
  cilUser, 
  cilStar,
  cilRoom,
  cilHappy
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect } from 'react'
import { Modal, ModalBody } from 'reactstrap'

function RecipeView(props) {
  const { viewData } = props

  /* ================= SHORTCUT KEYS ================= */
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'x') {
        props.setModalStates()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  if (!viewData) return null

  /* ================= TEXT FORMATTER HELPER ================= */
  // This turns your JSON "**text**" into bold headers and handles new lines
  const renderFormattedText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      // If line has **bold**, render it as a heading or strong text
      if (line.includes('**')) {
        const cleanLine = line.replace(/\*\*/g, ''); 
        return <h5 key={index} className="mt-4 mb-2 text-dark fw-bold">{cleanLine}</h5>;
      }
      // Empty lines for spacing
      if (line.trim() === '') {
        return <br key={index} />;
      }
      // Regular list items or paragraphs
      return <p key={index} className="mb-2 text-secondary" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>{line}</p>;
    });
  };

  return (
    <>
      {/* CSS Animation Injection */}
      <style>
        {`
          .fade-in-up {
            animation: fadeInUp 0.5s ease-out;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .glass-btn {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: none;
            transition: all 0.3s ease;
          }
          .glass-btn:hover {
            background: #fff;
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }
          .ingredient-chip {
            transition: all 0.2s;
            cursor: default;
          }
          .ingredient-chip:hover {
            transform: translateY(-2px);
          }
        `}
      </style>

      {/* Use size="xl" for full immersive experience */}
      <Modal 
        isOpen={props.modalStates} 
        toggle={props.setModalStates} 
        centered 
        size="lg" 
        contentClassName="border-0 shadow-lg overflow-hidden"
      >
        <ModalBody className="p-0 fade-in-up bg-white">
          
          {/* ================= HERO SECTION ================= */}
          <div style={{ position: 'relative', height: '400px', width: '100%' }}>
            
            {/* Background Image */}
            <img 
              src={viewData.recipe_image} 
              alt={viewData.recipe_name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Dark Gradient Overlay */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)'
            }}></div>

            {/* Custom "Back" Button (Top Left) */}
            <button 
              className="position-absolute top-0 start-0 m-4 rounded-pill px-4 py-2 glass-btn text-dark fw-bold d-flex align-items-center gap-2"
              onClick={props.setModalStates}
              style={{ zIndex: 10 }}
            >
              <CIcon icon={cilArrowLeft} className="fw-bold"/> Back
            </button>

            {/* Title Content (Bottom Left) */}
            <div className="position-absolute bottom-0 start-0 p-5 text-white w-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                 <span className="badge bg-warning text-dark border border-light">
                    <CIcon icon={cilStar} className="me-1"/> {viewData.recipe_rating} Rating
                 </span>
                 <span className="badge bg-success-gradient border border-light">
                    {viewData.recipe_meal_type}
                 </span>
              </div>
              
              <h1 className="display-4 fw-bold mb-2 text-shadow">{viewData.recipe_name}</h1>
              
              <div className="d-flex align-items-center opacity-75">
                <CIcon icon={cilUser} className="me-2"/>
                <span className="me-3">Created by <strong>{viewData.customer_id?.customer_name}</strong></span>
                <span>• {new Date(viewData.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* ================= CONTENT BODY ================= */}
          <div className="row g-0">
            
            {/* LEFT COLUMN: Main Description */}
            <div className="col-lg-8 p-5 border-end">
              
              {/* Stats Grid */}
              <div className="row mb-5 text-center g-3">
                  <div className="col-3">
                      <div className="p-3 bg-light rounded-3 border h-100">
                          <CIcon icon={cilClock} height={24} className="text-primary mb-2"/>
                          <div className="small text-muted text-uppercase fw-bold">Time</div>
                          <div className="h5 mb-0 text-dark">{viewData.recipe_time}</div>
                      </div>
                  </div>
                  <div className="col-3">
                      <div className="p-3 bg-light rounded-3 border h-100">
                          <CIcon icon={cilBurn} height={24} className="text-danger mb-2"/>
                          <div className="small text-muted text-uppercase fw-bold">Calories</div>
                          <div className="h5 mb-0 text-dark">{viewData.recipe_kcal}</div>
                      </div>
                  </div>
                  <div className="col-3">
                      <div className="p-3 bg-light rounded-3 border h-100">
                          <CIcon icon={cilHappy} height={24} className="text-success mb-2"/>
                          <div className="small text-muted text-uppercase fw-bold">Difficulty</div>
                          <div className="h5 mb-0 text-dark">{viewData.recipe_difficulty}</div>
                      </div>
                  </div>
                  <div className="col-3">
                      <div className="p-3 bg-light rounded-3 border h-100">
                          <CIcon icon={cilRoom} height={24} className="text-warning mb-2"/>
                          <div className="small text-muted text-uppercase fw-bold">Cuisine</div>
                          <div className="h5 mb-0 text-dark">{viewData.recipe_cuisine}</div>
                      </div>
                  </div>
              </div>

              {/* Formatted Description */}
              <div className="content-area">
                 {renderFormattedText(viewData.recipe_description)}
              </div>
            </div>

            {/* RIGHT COLUMN: Ingredients & Extras */}
            <div className="col-lg-4 bg-light p-5">
               
               {/* Ingredients Card */}
               <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                     <h5 className="fw-bold text-primary mb-0">
                       <CIcon icon={cilFastfood} className="me-2"/>
                       Ingredients Needed
                     </h5>
                  </div>
                  <div className="card-body px-4 pb-4">
                      <div className="d-flex flex-wrap gap-2">
                          {viewData.recipe_desired.split(',').map((ing, i) => (
                              <span 
                                key={i} 
                                className="ingredient-chip badge bg-white text-dark border py-2 px-3 shadow-sm rounded-pill"
                                style={{ fontSize: '0.9rem' }}
                              >
                                  ✅ {ing.trim()}
                              </span>
                          ))}
                      </div>
                  </div>
               </div>

               {/* Quick Info / User Info */}
               <div className="card border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                      <div 
                        className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3 shadow"
                        style={{ width: '60px', height: '60px', fontSize: '24px'}}
                      >
                         {viewData.customer_id?.customer_name?.charAt(0) || 'A'}
                      </div>
                      <h5 className="mb-1">{viewData.customer_id?.customer_name}</h5>
                      <p className="text-muted small mb-0">{viewData.customer_id?.customer_email}</p>
                      <hr className="my-3"/>
                      <div className="d-grid">
                        <button className="btn btn-outline-dark btn-sm" onClick={props.setModalStates}>
                            Close View
                        </button>
                      </div>
                  </div>
               </div>

            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default RecipeView