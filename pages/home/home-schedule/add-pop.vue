<template>
	<uv-popup ref="popRef" mode="bottom" bg-color="null" z-index="99">
		<view class="container">
			<view class="close">
				<icon type="clear" :size="20" color="#5677fc" @click="close"></icon>
			</view>
			<uv-form ref="formRef" :model="formData" :rules="rules" label-position="top" labelWidth="auto" :labelStyle="{marginBottom: '25rpx', fontSize: '27rpx', color: '#606266'}">
				<uv-form-item label="时间" prop="scheduleTime" :required="true">
					<picker style="width: 100%;" mode="time" :value="formData.scheduleTime" @change="(e)=>{formData.scheduleTime = e.detail.value}">
						<view class="uni-input input-value-border">
							{{formData.scheduleTime?formData.scheduleTime:"请选择时间"}}
						</view>
					</picker>
				</uv-form-item>
				<uv-form-item label="日程描述" prop="scheduleContent" :required="true">
					<uv-input type="textarea" v-model="formData.scheduleContent" placeholder="请输入日程描述"></uv-input>
				</uv-form-item>
			</uv-form>
			<tui-button height="90rpx" type="primary" @click="submit">确认</tui-button>
		</view>
	</uv-popup>
</template>
<script setup>
	import { ref, reactive } from "vue"
	import { indexScheduleAdd } from '@/api/sys/indexApi'
	const popRef = ref()
	const formRef = ref()
	const formData = ref({
		scheduleTime: '',
		scheduleContent: ''
	})
	const rules = reactive({
		scheduleTime: [{
			type: 'string',
			required: true,
			message: '请选择时间',
		}],
		scheduleContent: [{
			type: 'string',
			required: true,
			message: '请输入日程描述',
		}],
	})
	const emit = defineEmits({
		ok: null
	})
	const onOpen = (scheduleDate) => {
		formData.value.scheduleDate = scheduleDate
		popRef.value.open()
	}
	const submit = () => {
		formRef.value.validate().then(res => {
			indexScheduleAdd(formData.value).then(res => {
				emit('ok', res)
				popRef.value.close()
				formData.value = {}
			})
		})
	}
	const close = () => {
		popRef.value.close()
	}
	defineExpose({
		onOpen
	})
</script>
<style lang="scss" scoped>
	.container {
		/* #ifdef H5 */
		margin: 15upx 15upx 120upx 15upx;
		/* #endif */
		/* #ifndef H5 */
		margin: 15upx;
		/* #endif */
		border-radius: 10rpx;
		padding: 20rpx;
		background-color: white;
		
		.close {
			display: flex;
			justify-content: flex-end;
		}

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