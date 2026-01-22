import { createRouter, createWebHistory } from "vue-router"
import Login from "../views/Login.vue"
import store from "../store"

const routes = [
	{
		path: "/",
		name: "Login",
		component: Login,
	},
	{
		path: "/home",
		name: "Home",
		component: () => import("../views/Home.vue"),
		meta: { requiresAuth: true, roles: ['regular', 'editor', 'admin'] }
	},
	{
		path: "/admin",
		name: "Admin",
		component: () => import("../views/AdminView.vue"),
		meta: { requiresAuth: true, roles: ['admin'] }
	},
	{
		path: "/editor",
		name: "Editor",
		component: () => import("../views/EditorView.vue"),
		meta: { requiresAuth: true, roles: ['editor', 'admin'] }
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
		next('/')
	} else if (to.meta.roles && !store.getters.hasAnyRole(to.meta.roles)) {
		next('/home')
	} else {
		next()
	}
})

export default router
