import Axios from "axios";

class AxiosService {
    
    constructor() {
        // const Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcxMTU4NTYwMCwiZXhwIjoxNzIxNTg1NjAwfQ.KB3hD6v9n9oGR6Qf6gV6XOr6eRHbPdFNGnNHlhB0F5s';
        // localStorage.setItem('Authorization',Authorization)
        const instance = Axios.create();
        instance.interceptors.response.use(this.handleSucess, this.handleError)
        this.instance = instance;
    }

    handleSucess(res) {
        return res;
    }

    handleError(e) {
        return Promise.reject(e);
    }

    get(url) {
        return this.instance.get(url, { 'headers': { 'Authorization': localStorage.getItem("Authorization") } });
    }
    post(url) {
        return this.instance.post(url, { 'headers': { 'Authorization': localStorage.getItem("Authorization") } })
    }
    post(url, body) {
        return this.instance.post(url, body, { 'headers': { 'Authorization': localStorage.getItem("Authorization") } })
    }

    put(url, body) {
        return this.instance.put(url, body, { 'headers': { 'Authorization': localStorage.getItem("Authorization") } })
    }

    delete(url) {
        return this.instance.delete(url, { 'headers': { 'Authorization': localStorage.getItem("Authorization") } })
    }
}

export default new AxiosService();