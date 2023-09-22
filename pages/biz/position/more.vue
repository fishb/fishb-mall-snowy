<template>
	<uv-popup ref="popRef" mode="bottom" bg-color="null" z-index="99">
		<view class="container">
			<tui-list-view unlined="all" background-color="transparent">
				<tui-list-cell v-if="$snowy.hasPerm('mobileBizPositionEdit')" :hover="true" :arrow="false" @click="edit" :radius="10" >
					<view class="item"> 编辑 </view>
				</tui-list-cell>
				<tui-list-cell v-if="$snowy.hasPerm('mobileBizPositionDelete')" :hover="true" :arrow="false" @click="del" :radius="10" :margin-top="2">
					<view class="item"> 刪除 </view>
				</tui-list-cell>
				<tui-list-cell :hover="true" :arrow="false" @click="cancel" :margin-top="10" :radius="10">
					<view class="item"> 取消 </view>
				</tui-list-cell>
			</tui-list-view>
		</view>
	</uv-popup>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance } from "vue";
	import { positionDelete } from '@/api/biz/bizPositionApi'
	const emits = defineEmits(['handleOk'])
	const popRef = ref()
	const record = ref({})
	const open = (data) => {
		record.value = data
		popRef.value.open()
	}
	// 编辑
	const edit = () => {
		uni.navigateTo({
			url: '/pages/biz/position/form?id=' + record.value.id
		})
		popRef.value.close()
	}
	// 删除
	const del = () => {
		uni.$snowy.modal.confirm(`是否确认删除【${ record.value.name }】职位？`).then(() => {
			positionDelete([{
				id: record.value.id
			}]).then(res => {
				emits('handleOk')
				popRef.value.close()
			})
		})
	}
	// 取消
	const cancel = () => {
		popRef.value.close()
	}
	defineExpose({
		open
	})
</script>
<style lang="scss" scoped>
	.container {
		padding: 5upx;
		background-color: transparent;
		.item {
			text-align: center;
		}
	}
</style>