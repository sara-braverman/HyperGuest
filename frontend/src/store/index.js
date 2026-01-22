import { createStore } from "vuex"
import axios from "axios"

export default createStore({
	state: {
		isLoggedIn: false,
		user: null,
		loading: false,
		error: null
	},
	getters: {
		isAuthenticated: state => state.isLoggedIn,
		userRoles: state => state.user?.roles || [],
		hasRole: (state) => (role) => {
			return state.user?.roles?.includes(role) || false
		},
		hasAnyRole: (state) => (roles) => {
			return roles.some(role => state.user?.roles?.includes(role)) || false
		}
	},
	mutations: {
		SET_LOADING(state, loading) {
			state.loading = loading
		},
		SET_ERROR(state, error) {
			state.error = error
		},
		SET_LOGIN(state, user) {
			state.isLoggedIn = true
			state.user = user
			state.error = null
		},

		SET_LOGOUT(state) {
			state.isLoggedIn = false
			state.user = null
			state.error = null
		}
	},
	actions: {
		async login({ commit }, username) {
			commit('SET_LOADING', true)
			commit('SET_ERROR', null)
			
			try {
				const response = await axios.post(`/api/users/login/${username}`)
				commit('SET_LOGIN', response.data)
				return { success: true }
			} catch (error) {
				let errorMessage = 'Login failed'
				
				if (error.response?.status === 401) {
					errorMessage = 'Account deleted or is unauthorized'
				} else if (error.response?.data?.message) {
					errorMessage = error.response.data.message
				}
				
				commit('SET_ERROR', errorMessage)
				return { success: false, error: errorMessage }
			} finally {
				commit('SET_LOADING', false)
			}
		},
		logout({ commit }) {
			commit('SET_LOGOUT')
		}
	},
	modules: {
	},
})
