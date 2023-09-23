<template>
	<view class="snowy-calendar">
		<view class="input" @click="clickInput" :class="{ 'input-disabled': props.disabled }">
			<view class="input-value" :class="{ 'input-value-border': props.border, 'input-value-disabled': props.disabled }">
				<view v-if="!$xeu.isEmpty(curSelData)">
					{{ curSelData }}
				</view>
				<view class="placeholder" v-else>
					{{ placeholder }}
				</view>
			</view>
		</view>
		<uv-calendars ref="calendarRef" :date="curSelData" @confirm="confirm" />
	</view>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance, watch, inject } from "vue"
	const { proxy } = getCurrentInstance()
	const emits = defineEmits(['update:modelValue', 'cancel', 'confirm',])
	const props = defineProps({
		modelValue: [String, Array],
		border: {
			type: Boolean,
			default: true,
			required: false
		},
		placeholder: {
			type: String,
			default: "请选择",
			required: false
		},
		disabled: {
			type: Boolean,
			default: false,
			required: false
		},
	})
	const curSelData = ref('')
	const calendarRef = ref()
	// watch(() => props.modelValue, (newValue, oldValue) => {
	// 	curSelData.value = props.modelValue
	// }, {
	// 	deep: false,
	// 	immediate: true
	// })
	
	curSelData.value = props.modelValue
	
	const clickInput = () => {
		calendarRef.value.open()
	}
	const confirm = (e) => {
		curSelData.value = e.fulldate
		emits('update:modelValue', e.fulldate)
		// 校验字段
		uni.$uv.formValidate(proxy, "change")
	}
</script>
<style lang="scss" scoped>
	.snowy-calendar {
		width: 100%;

		.input-disabled {
			pointer-events: none;
			background-color: rgb(247, 246, 246);

			.input-value-disabled {
				color: rgb(192, 192, 192);
			}
		}

		.input {
			.input-value {
				font-size: 25upx;
				line-height: 30upx;
				padding: 20upx;
				min-height: 30upx;

				.placeholder {
					color: $uni-secondary-color;
				}
			}

			.input-value-border {
				border: 1px solid $uni-border-2;
				border-radius: 5upx;
			}
		}
	}
</style>