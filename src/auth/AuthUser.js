import { useNavigate } from "react-router-dom"
import { API_URL } from "../helper/url_helper"

 

export default function AuthUser() {
  const navigate = useNavigate()
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token')
    const userToken = JSON.parse(tokenString)
    return userToken
  }

  const getUser = () => {
    const userString = JSON.parse(sessionStorage.getItem('authUser'))
    return userString
  }

  const [token, setToken] = useState(getToken())
  const [user, setUser] = useState(getUser())

  const saveToken = (user, token) => {
    sessionStorage.setItem('token', JSON.stringify(token))
    sessionStorage.setItem('authUser', JSON.stringify(user))
    setUser(user);
  }

  const http = axios.create({
    baseURL: `${API_URL}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const https = axios.create({
    baseURL: `${API_URL}`,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })

  const logout = async () => {
    const userString = JSON.parse(sessionStorage.getItem('authUser'))
    await axios.get(API_URL + '/user/logout/' + userString.user.user_id)
    sessionStorage.clear()
    setToken(null)
    setUser(null)
    navigate('/login')
  }
 
  return {
    setToken: saveToken,
    token,
    user,
    http,
    https,
    logout,
    checkPermission,
    permission,
    checkSubscription,
  }
}
