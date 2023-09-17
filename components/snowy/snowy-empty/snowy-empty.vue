<template>
	<tui-no-data v-bind="$attrs" :fixed="$attrs.fixed ? $attrs.fixed : false" :imgUrl="$attrs.imgUrl? $attrs.imgUrl: '/static/svg/empty/nodata.svg'">
		<slot>暂无数据</slot>
	</tui-no-data>
</template>
<script setup>
</script>
<style lang="scss" scoped>
</style>