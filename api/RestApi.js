import axios from 'axios';

const baseUrl = 'http://54.254.164.127/api/v1/';

class ApiService {
    async login(userData) {
        console.log(userData)
        const url = `${baseUrl}auth/login`;
        try {
            const response = await axios.post(url,userData);
            return response;
        } catch (e) {
            throw `${e.message}`
        }
    }

    async register(userData) {
        const url = `${baseUrl}auth/register`;
        try {
            const response = await axios.post(url,userData);
            return response;
        } catch (e) {
            console.log(e)
            throw `${e.message}`
        }
    }

    async getUserData(bearerToken) {
        const url = `${baseUrl}users/me`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                }
            });
            return response.data
        } catch (e) {
            console.log(`Error ${e.message}`);
        }
    }

    async getUserTransactions(bearerToken) {
        const url = `${baseUrl}transactions`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                }
            });
            return response.data
        } catch (e) {
            console.log(`Error ${e.message}`);
        }
    }

    async createTransaction(bearerToken,data) {
        const url = `${baseUrl}transactions`;
        try {
            const response = await axios.post(url,data, {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                }
            });
            return response.data
        } catch (e) {
            console.log(`Error ${e.message}`);
        }
    }
}

export default ApiService;
