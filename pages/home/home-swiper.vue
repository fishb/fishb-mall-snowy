<template>
	<uv-swiper :list="data" keyName="image" indicator indicatorMode="line" circular></uv-swiper>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance, computed } from "vue"
	import store from '@/store'
	import { prefixUrl } from "@/utils/apiAdaptive"
	const data = reactive([{
		image: `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/mobile/')}swiper/swiper1.jpg`
	}, {
		image: `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/mobile/')}swiper/swiper2.jpg`
	}, ])
</script>
<style>
</style>