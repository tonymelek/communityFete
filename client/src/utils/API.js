import axios from 'axios'


export default {
    getUsers(token) {
        return axios({
            method: 'get',
            url: '/api/users',
            headers: {
                authorization: `bearer ${token}`
            }
        })
    },
    login(email, password) {
        return axios({
            method: 'post',
            url: '/api/login',
            data: {
                email: email.current.value, password: password.current.value
            }
        })
    },
    signup(email, password) {
        return axios({
            method: 'post',
            url: '/api/signup',
            data: {
                email: email.current.value, password: password.current.value
            }
        })
    },
    updateBalanceRole(updateObj, token) {
        return axios({
            method: 'put',
            url: '/api/updateBalanceRole',
            headers: {
                authorization: `bearer ${token}`
            },
            data: updateObj
        })
    },
    getShops() {
        return axios({
            method: 'get',
            url: '/api/allshops'

        })
    },
    getMenu(token) {
        return axios({
            method: 'get',
            url: '/api/allmenu',
            headers: {
                authorization: `bearer ${token}`
            }
        })
    },
    getMenu_user() {
        return axios({
            method: 'get',
            url: '/api/allmenu-users',
        })
    },
    createNewShop(updateObj, token) {
        return axios({
            method: 'post',
            url: '/api/create-shop',
            headers: {
                authorization: `bearer ${token}`
            },
            data: updateObj
        })
    },
    createMenuItem(updateObj, token) {
        return axios({
            method: 'post',
            url: '/api/create-menu-item',
            headers: {
                authorization: `bearer ${token}`
            },
            data: updateObj
        })
    },

    deleteMenuItem(updateObj, token) {
        return axios({
            method: 'delete',
            url: '/api/delete-menu-item',
            headers: {
                authorization: `bearer ${token}`
            },
            data: updateObj
        })
    },


    getThisUser(token) {
        return axios({
            method: 'get',
            url: '/api/get-this',
            headers: {
                authorization: `bearer ${token}`
            }
        })
    },
    processPayment(updateObj, token) {
        return axios({
            method: 'post',
            url: '/api/processpayment',
            headers: {
                authorization: `bearer ${token}`
            },
            data: updateObj
        })
    },
    getActiveOrders(token) {
        return axios({
            method: 'get',
            url: '/api/activeorders',
            headers: {
                authorization: `bearer ${token}`
            }
        })
    },
    getUserActiveOrders(token) {
        return axios({
            method: 'get',
            url: '/api/myactiveorders',
            headers: {
                authorization: `bearer ${token}`
            }
        })
    },
    getMerchantsPerShop(email) {
        return axios({
            method: 'get',
            url: `/api/merchants/${email}`
        })
    },
    getAdminStats(token) {
        return axios({
            method: 'get',
            url: '/api/admin-stats',
            headers: {
                authorization: `bearer ${token}`
            }
        })
    },
    getAdminFooter(token) {
        return axios({
            method: 'get',
            url: '/api/admin-footer',
            headers: {
                authorization: `bearer ${token}`
            }
        })
    }


}