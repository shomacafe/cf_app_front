import applyCaseMiddleware from 'axios-case-converter'
import axios from 'axios'

const options = {
  ignoreHeaders: true
}

const baseURL = REACT_APP_API_BASE_URL || 'http://localhost:3001/api/v1';

const clientApi = applyCaseMiddleware(axios.create({
  baseURL,
}), options)

export default clientApi
