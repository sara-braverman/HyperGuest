<template>
	<div class="page">
		<div class="content">
			<h1>Editor Dashboard</h1>
			<p>Welcome back, <strong>{{ username }}</strong>!</p>
			<p class="description">You have editor access to manage content and resources.</p>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue"
import { useStore } from "vuex"

const store = useStore()
const username = computed(() => store.state.user?.username || 'Guest')
</script>

<style scoped>
.page {
	padding: 2rem;
	min-height: 80vh;
	display: flex;
	align-items: center;
	justify-content: center;
}

.content {
	text-align: center;
	max-width: 500px;
}

.content h1 {
	color: #1f2937;
	margin-bottom: 1rem;
	font-size: 2rem;
}

.content p {
	color: #6b7280;
	margin-bottom: 0.5rem;
	font-size: 1.1rem;
}

.description {
	font-size: 1rem;
	margin-top: 1rem;
}
</style>
