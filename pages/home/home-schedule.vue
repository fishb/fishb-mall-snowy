<template>
	<view>
		<uni-section :title="`日程（开发中）`" type="square"></uni-section>
		<uni-calendar :insert="true" :lunar="true" :start-date="'2019-3-2'" :end-date="'2019-5-20'" @change="change" />
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		getCurrentInstance,
		computed
	} from "vue";

	const change = () => {}
</script>

<style>
</style>