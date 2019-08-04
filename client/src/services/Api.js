import axios from 'axios'
import config from '@/config/config'
import store from '@/store/store'
import router from '@/router/'

export default () => {
  const instance = axios.create({
    baseURL: config.baseURL,
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  })

  function notAuthenticated(error) {
    router.push(
      { 
        name: 'login', 
        //query: { error: 'You must log in to access this resource' },
        params: { 
          error: "You must log in to access this page",
          url: error.response.config.url
        }
      }
    )
    return Promise.reject({error: "Not Authenticated"}) //deal with error
  }

  //Add interceptor to forward logout
  instance.interceptors.response.use(
    function (response) {
      return response;
    }, 
    function (error) {
      const method = error.config.method.toUpperCase() + ' /' + error.config.url.replace(error.config.baseURL, '')
      switch (error.response.status) {
        case 401:
            return notAuthenticated(error)
        case 404:
          alert("Server action not found. Error Status: " + error.response.status + " | \n" + method)
          break
        case 500:
            alert("The server encountered an error processing your request. Error Status: " + error.response.status + " | " + JSON.stringify(error.response.data.error))
            break
        case 403:
            alert("You are not authorized to access this page.")
            break
        default: //including 400
            return Promise.reject(error)
      }
      return Promise.reject(error);
      
  });
  return instance
}
