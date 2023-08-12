import applyCaseMiddleware from 'axios-case-converter'
import axios from 'axios'

const options = {
  ignoreHeaders: false
}

const clientApi = applyCaseMiddleware(axios.create({
  baseURL: 'http://localhost:3001/api/v1'
}), options)

export default clientApi
