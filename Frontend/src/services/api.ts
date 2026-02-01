import axios from 'axios'

const api = axios.create({
  baseURL: 'http:// localhost5000api
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
