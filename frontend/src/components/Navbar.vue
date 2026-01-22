<template>
	<nav class="navbar">
		<div class="nav-brand">HyperGuest</div>
		<div class="nav-links">
			<router-link v-if="!isLoggedIn" to="/" class="nav-btn">Login
			</router-link>
			<template v-if="isLoggedIn">
				<router-link to="/home" class="nav-btn">
					Home
				</router-link>
				<router-link 
					v-if="hasAnyRole(['editor', 'admin'])" 
					to="/editor" 
					class="nav-btn"
				>
					Editor
				</router-link>
				<span 
					v-else 
					class="nav-btn disabled"
				>
					Editor
				</span>
				<router-link 
					v-if="hasAnyRole(['admin'])" 
					to="/admin" 
					class="nav-btn"
				>
					Admin
				</router-link>
				<span 
					v-else 
					class="nav-btn disabled"
				>
					Admin
				</span>
			</template>
			<button v-if="isLoggedIn" @click="handleLogout" class="logout-btn">
				Logout
			</button>
		</div>
	</nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	computed: {
		...mapGetters(['isAuthenticated', 'hasAnyRole']),
		isLoggedIn() {
			return this.isAuthenticated
		}
	},
	methods: {
		...mapActions(['logout']),
		handleLogout() {
			this.logout()
			this.$router.push('/')
		}
	}
}
</script>

<style scoped>
.navbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 2rem;
	background: white;
	border-bottom: 1px solid #e5e7eb;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	width: 100%;
}

.nav-brand {
	font-size: 1.25rem;
	font-weight: 600;
	color: #1f2937;
}

.nav-links {
	display: flex;
	gap: 0.5rem;
	align-items: center;
}

.nav-btn {
	color: #6b7280;
	text-decoration: none;
	padding: 0.5rem 1rem;
	border-radius: 8px;
	transition: all 0.2s;
	font-weight: 500;
	font-size: 0.9rem;
}

.nav-btn:hover {
	background: #f3f4f6;
	color: #374151;
}

.nav-btn.router-link-active {
	background: #10b981;
	color: white;
}

.nav-btn.disabled {
	color: #9ca3af;
	cursor: not-allowed;
	pointer-events: none;
}

.nav-btn.disabled:hover {
	background: transparent;
	color: #9ca3af;
}

.logout-btn {
	background: #6b7280;
	color: white;
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 500;
	font-size: 0.9rem;
	transition: background 0.2s;
	margin-top: 0rem;
}

.logout-btn:hover {
	background: #4b5563;
}
</style>
