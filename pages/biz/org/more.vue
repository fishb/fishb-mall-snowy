<template>
	<uni-popup ref="popupRef" type="bottom" safeArea>
		<view class="container">
			<uni-list :border="false">
				<uni-list-item v-if="hasPerm('mobileBizOrgEdit')" title="编辑" class="item" :clickable="true" @click="edit">
				</uni-list-item>
				<uni-list-item v-if="hasPerm('mobileBizOrgDelete')" title="刪除" class="item" :clickable="true" @click="del">
				</uni-list-item>
				<uni-list-item title="取消" class="item" :clickable="true" @click="cancel">
				</uni-list-item>
			</uni-list>
		</view>
	</uni-popup>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance } from "vue"
	import { orgDelete } from '@/api/biz/bizOrgApi'
	import modal from '@/plugins/modal'
	const emits = defineEmits(['handleOk'])
	// 弹出ref
	const popupRef = ref()
	// 打开
	let record = ref({})
	const open = (data) => {
		record.value = data
		popupRef.value.open("bottom")
	}
	// 编辑
	const edit = () => {
		uni.navigateTo({
			url: '/pages/biz/org/form?id=' + record.value.id
		})
		popupRef.value.close()
	}
	// 删除
	const del = () => {
		modal.confirm(`是否确认删除【${ record.value.name }】机构？`).then(() => {
			orgDelete([{
				id: record.value.id
			}]).then(res => {
				emits('handleOk')
				popupRef.value.close()
			})
		})
	}
	// 取消
	const cancel = () => {
		popupRef.value.close()
	}
	defineExpose({
		open
	})
</script>
<style lang="scss" scoped>
	.container {
		margin: 15upx;
		border-radius: 5upx;
		padding: 5upx;
		background-color: $uni-white;

		.item {
			text-align: center;
		}
	}
</style>