<template>
	<view class="snowy-sel-picker">
		<view @click="handleInput" :class="{ 'input-disabled': props.disabled }">
			<view class="input-value">
				<!-- 单选 -->
				<view v-if="!isMultiple && curSelDataKey && curSelDataKey !== ''">
					{{ curSelData[map.label] }}
				</view>
				<!-- 多选 -->
				<view class="multiple" v-else-if="!!isMultiple && curSelDataKey && curSelDataKey.length > 0" v-for="(item, key, index) in curSelData" :key="index">
					{{ item[map.label] }}
				</view>
				<view class="placeholder" v-else>
					{{ placeholder }}
				</view>
			</view>
		</view>
		<uv-popup ref="popRef" mode="bottom" bg-color="null" z-index="99" @maskClick="cancel">
			<view class="pop-container">
				<view class="action">
					<view class="cancel snowy-bold" @click="cancel"> 取消 </view>
					<view class="confirm snowy-bold" @click="confirm"> 确定 </view>
				</view>
				<!-- 已选择 -->
				<scroll-view :scroll-y="true" :style="{maxHeight:!isMultiple?'5vh':'10vh'}" class="choiced" v-show="!!curSelDataKey && (!isMultiple? true : curSelDataKey.length > 0)">
					<!-- 单选已选择 -->
					<view class="single" v-if="!isMultiple">
						<view class="label" @click="delData(curSelData)">
							{{ curSelData[map.label] }}
						</view>
						<view class="icon">
							<icon type="clear" @click="delData(curSelData)" color="#ffffff" size="15"></icon>
						</view>
					</view>
					<!-- 多选已选择 -->
					<view class="multiple" v-if="!!isMultiple" v-for="(item, index) in curSelData" :key="index">
						<view class="label" @click="delData(item)">
							{{ item[map.label] }}
						</view>
						<view class="icon">
							<icon type="clear" @click="delData(curSelData)" color="#ffffff" size="15"></icon>
						</view>
					</view>
				</scroll-view>
				<!-- 搜索 -->
				<snowy-search v-if="enableSearch" @confirm="searchConfirm" @clear="searchClear" :customStyle="{'padding': 0}"></snowy-search>
				<!-- 面板数据 -->
				<scroll-view class="data" :scroll-y="true" @scrolltolower="scrolltolower">
					<view class="item" :class="{ 'item-sel': !isMultiple ? item[map.key] == curSelDataKey: curSelDataKey.indexOf(item[map.key]) != -1 }" v-for="(item, index) in rangeData" :key="index" :index="index" @click="selOrDelData(item, index)">
						<uv-row>
							<uv-col :span="1.5">
								<uv-icon v-show="!isMultiple ? item[map.key] != curSelDataKey: curSelDataKey.indexOf(item[map.key]) == -1" name="checkmark-circle" :size="20" color="#999"></uv-icon>
								<uv-icon v-show="!isMultiple ? item[map.key] == curSelDataKey: curSelDataKey.indexOf(item[map.key]) != -1" name="checkmark-circle-fill" :size="20" color="#2979ff"></uv-icon>
							</uv-col>
							<uv-col :span="9.5">
								<view class="item-left">{{item[map.label]}}</view>
							</uv-col>
							<uv-col :span="1">
								<view class="item-right snowy-bold snowy-ellipsis"> {{item[map.label]}} </view>
							</uv-col>
						</uv-row>
					</view>
					<snowy-empty :fixed="true" v-if="XEUtils.isEmpty(rangeData)"></snowy-empty>
				</scroll-view>
			</view>
		</uv-popup>
	</view>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance, watch, inject } from "vue"
	import XEUtils from 'xe-utils'
	const emits = defineEmits(['update:modelValue', 'queryCurSelData', 'scrollToLower', 'cancel', 'confirm', 'searchConfirm', 'searchClear'])
	const props = defineProps({
		modelValue: [String, Array, Number],
		isMultiple: {
			type: Boolean,
			default: false,
			required: false
		},
		placeholder: {
			type: String,
			default: "请选择",
			required: false
		},
		map: {
			type: Object,
			default: {
				key: "key",
				label: "label"
			},
			required: false
		},
		rangeData: {
			type: Array,
			default: [],
			required: false
		},
		disabled: {
			type: Boolean,
			default: false,
			required: false
		},
		// 是否开启大数据模式，如果开启大数据模式，
		// 那么就要实现queryCurSelData方法，并提供相应的回调（通过服务端获取已选择的数据）
		// 与此同时要实现scrollToLower方法（用于分页加载）
		isBigData: {
			type: Boolean,
			default: false,
			required: false
		},
		enableSearch: {
			type: Boolean,
			default: false,
			required: false
		}
	})
	
	// 弹出
	const popRef = ref()
	// 当前选中的数据key及数据
	const curSelDataKey = !props.isMultiple ? ref("") : ref([])
	const curSelData = !props.isMultiple ? ref({}) : ref([])
	const initOrResetData = () => {
		// 单选curSelData初始化值赋值
		if (!props.isMultiple) {
			curSelDataKey.value = props.modelValue ? XEUtils.clone(props.modelValue, true) : ""
			if (props.isBigData) {
				emits('queryCurSelData', curSelDataKey.value, (val) => {
					curSelData.value = val
				})
			} else {
				if (!XEUtils.isEmpty(curSelDataKey.value) || XEUtils.isNumber(curSelDataKey.value)) {
					const curSelDataArr = XEUtils.filterTree(props.rangeData, item => {
						return curSelDataKey.value === item[props.map.key]
					})
					if (curSelDataArr && curSelDataArr.length === 1) {
						curSelData.value = curSelDataArr[0]
					}
				} else {
					curSelData.value = {}
				}
			}
		}
		// 多选curSelData初始化值赋值
		if (!!props.isMultiple) {
			curSelDataKey.value = props.modelValue ? XEUtils.clone(props.modelValue, true) : []
			if (props.isBigData) {
				emits('queryCurSelData', curSelDataKey.value, (val) => {
					curSelData.value = val
				})
			} else {
				if (!XEUtils.isEmpty(curSelDataKey.value)) {
					curSelData.value = XEUtils.filterTree(props.rangeData, item => {
						return curSelDataKey.value.includes(item[props.map.key])
					})
				} else {
					curSelData.value = []
				}
			}
		}
	}
	// 控制modelValue watch方法是否执行
	const modelValueWatchIsAct = ref(true)
	watch(() => props.modelValue, (newValue, oldValue) => {
		if(modelValueWatchIsAct.value){
			initOrResetData()
		}
		modelValueWatchIsAct.value = true
	}, {
		deep: false,
		immediate: true
	})
	watch(() => props.rangeData, (newValue, oldValue) => {
		initOrResetData()
	}, {
		deep: false,
		immediate: true
	})
	// 搜索确认
	const searchConfirm = (val) => {
		emits('searchConfirm', val)
	}
	// 搜索清除
	const searchClear = () => {
		emits('searchClear')
	}
	// 点击输入框
	const handleInput = () => {
		// initOrResetData()
		popRef.value.open()
	}
	// 选择或删除数据
	const selOrDelData = (item, index) => {
		if (!props.isMultiple) {
			if (item[props.map.key] != curSelDataKey.value) {
				selData(item, index)
			} else {
				delData(item, index)
			}
		} else {
			if (!curSelDataKey.value.includes(item[props.map.key])) {
				selData(item, index)
			} else {
				delData(item, index)
			}
		}
	}
	// 选择数据
	const selData = (item, index) => {
		if (!props.isMultiple) {
			curSelDataKey.value = item[props.map.key]
			curSelData.value = item
		} else {
			curSelDataKey.value.push(item[props.map.key])
			curSelData.value.push(item)
		}
	}
	// 移除数据
	const delData = (item, index) => {
		if (!props.isMultiple) {
			curSelDataKey.value = ""
			curSelData.value = {}
		} else {
			curSelDataKey.value.splice(curSelDataKey.value.findIndex(curSelDataKeyItem => curSelDataKeyItem === item[props.map.key]), 1);
			curSelData.value.splice(curSelData.value.findIndex(curSelDataItem => curSelDataItem[props.map.key] === item[props.map.key]), 1);
		}
	}
	// 取消
	const cancel = () => {
		initOrResetData()
		popRef.value.close()
	}
	const confirm = () => {
		// 更新数据
		modelValueWatchIsAct.value = false
		emits('update:modelValue', curSelDataKey.value)
		// 调用父组件方法
		emits('confirm', {
			curSelDataKey: curSelDataKey.value,
			curSelData: curSelData.value
		})
		uni.$uv.formValidate(proxy, "change")
		popRef.value.close()
	}
	const scrolltolower = () => {
		emits('scrollToLower')
	}
	defineExpose({
		initOrResetData
	})
</script>
<style lang="scss" scoped>
	.snowy-sel-picker {
		width: 100%;
	}
	.input-value {
		font-size: 28rpx;
		line-height: 30rpx;
		padding: 20rpx;
		min-height: 30rpx;
		border: 1px solid #EDEDED;
		border-radius: 5rpx;

		.multiple {
			display: inline-block;
			margin: 3rpx 10rpx 3rpx 0
		}

		.placeholder {
			color: #909399;
		}
	}

	.input-disabled {
		pointer-events: none;
		background-color: rgb(247, 246, 246);
		color: rgb(192, 192, 192);
	}

	.pop-container {
		margin: 5rpx;
		border-radius: 10rpx;
		padding: 10rpx;
		background-color: #f7f7f7; //white;
	}

	.action {
		display: flex;
		justify-content: space-between;
		margin: 30rpx;
		font-size: 30rpx;

		.cancel {
			color: #909399
		}

		.confirm {
			color: #5677fc
		}
	}

	.choiced {
		background: #5677fc;
		margin: 20rpx 0;
		padding: 10rpx 0;
		box-shadow: 0 1px 2px #ccc;
		border-radius: 15rpx;

		.single {
			margin: 5rpx 30rpx;
			display: inline-flex;
		}
		
		.multiple {
			margin: 10rpx 0 10rpx 20rpx;
			display: inline-flex;
		}
		
		.label {
			color: #ffffff;
			margin-right: 5rpx;
		}
		
		.icon {
			display: flex;
			align-items: center;
		}
	}

	.data {
		height: 50vh;

		.item {
			background: #ffffff;
			margin: 20rpx 0;
			padding: 25rpx;
			box-shadow: 0 1px 2px #ccc;
			border-radius: 15rpx;

			.item-left {
				color: #999;
				font-size: 27rpx;
			}

			.item-right {
				font-size: 27rpx;
				text-align: right;
			}
		}

		.item-sel {
			box-shadow: 1upx 5upx 5upx #5677fc;
		}
	}
</style>