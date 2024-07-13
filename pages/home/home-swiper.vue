<template>
	<uni-swiper-dot :info="data" :current="current" field="content">
		<swiper :current="swiperDotIndex" :autoplay="true" :interval="3000" :duration="1000" @change="changeSwiper">
			<swiper-item v-for="(item, index) in data" :key="index">
				<!-- style="padding: 15upx;" -->
				<view @click="clickBannerItem(item)">
					<image style="width:100%; border-radius: 5upx;" :src="item.image" mode="widthFix" :draggable="false" />
				</view>
			</swiper-item>
		</swiper>
	</uni-swiper-dot>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance, computed } from "vue"
	import store from '@/store'
	import { prefixUrl } from "@/utils/api-adaptive"
	const current = ref(0)
	const swiperDotIndex = ref(0)
	const data = reactive([{
		image: `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/mobile/')}swiper/swiper1.jpg`
	}, {
		image: `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/mobile/')}swiper/swiper2.jpg`
	}, ])
	const changeSwiper = (e) => {
		current.value = e.detail.current
	}
	const clickBannerItem = (item) => {
		console.log(item)
	}
</script>
<style>
</style>