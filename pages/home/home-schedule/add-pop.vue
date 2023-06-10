<template>
	<uni-popup ref="formDialogRef" type="bottom" safeArea>
		<view class="container">
			<uni-forms ref="formRef" :model="formData" label-position="top" labelWidth="75px">
				<uni-forms-item label="时间" name="scheduleTime" :required="true"
					:rules="[{ required: true, errorMessage: '请选择时间' }]">
					<!-- <uni-easyinput type="textarea" v-model="formData.scheduleTime" placeholder="请输入日程描述"></uni-easyinput> -->
					<picker mode="time" :value="formData.scheduleTime"
						@change="(e)=>{formData.scheduleTime = e.detail.value}">
						<view class="uni-input input-value-border">
							{{formData.scheduleTime?formData.scheduleTime:"请选择时间"}}</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item label="日程描述" name="scheduleContent" :required="true"
					:rules="[{ required: true, errorMessage: '请输入日程描述' }]">
					<uni-easyinput type="textarea" v-model="formData.scheduleContent"
						placeholder="请输入日程描述"></uni-easyinput>
				</uni-forms-item>
			</uni-forms>
			<button class="btn-sub" type="primary" @click="submit">确定</button>
		</view>
	</uni-popup>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import {
		indexScheduleAdd
	} from '@/api/sys/indexApi'

	const formDialogRef = ref()
	const formRef = ref()
	// 表单数据
	const formData = ref({})
	const emit = defineEmits({
		ok: null
	})
	const onOpen = (scheduleDate) => {
		formData.value.scheduleDate = scheduleDate
		formDialogRef.value.open()
	}
	const submit = () => {
		formRef.value.validate().then(res => {
			indexScheduleAdd(formData.value).then(res => {
				emit('ok', res)
				formDialogRef.value.close()
				// 重置表单数据
				formData.value = {}
			})
		})
	}
	defineExpose({
		onOpen
	})
</script>

<style lang="scss">
	.container {
		/* #ifdef H5 */
		margin: 15upx 15upx 120upx 15upx;
		/* #endif */
		/* #ifndef H5 */
		margin: 15upx;
		/* #endif */
		border-radius: 5upx;
		padding: 25upx;
		background-color: $uni-white;

		.uni-input {
			height: 50rpx;
			padding: 15rpx 25rpx;
			line-height: 50rpx;
			font-size: 28rpx;
			background: #FFF;
			flex: 1;
		}

		.input-value-border {
			border: 1px solid $uni-border-2;
			border-radius: 5upx;
		}

		.btn-sub {
			background-color: $uni-primary;
		}
	}
</style>