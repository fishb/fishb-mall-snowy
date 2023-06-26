<template>
	<view class="snowy-sel-picker">
		<view class="input" @click="handleInput" :class="{ 'input-disabled': props.disabled }">
			<view class="input-value" :class="{ 'input-value-border': props.border, 'input-value-disabled': props.disabled }">
				<!-- 单选 -->
				<view v-if="!isMultiple && curSelDataKey && curSelDataKey !== ''">
					{{ curSelData[map.label] }}
				</view>
				<!-- 多选 -->
				<view class="multiple" v-else-if="!!isMultiple && curSelDataKey && curSelDataKey.length > 0"
					v-for="(item, key, index) in curSelData" :key="index">
					{{ item[map.label] }}
				</view>
				<view class="placeholder" v-else>
					{{ placeholder }}
				</view>
			</view>
		</view>
		<uni-popup class="pop" ref="popupRef" type="bottom" background-color="#fff" @maskClick="cancel">
			<view class="action">
				<view class="cal" @click="cancel">
					取消
				</view>
				<view class="conf" @click="confirm">
					确定
				</view>
			</view>
			<!-- 已选择 -->
			<view class="choiced" v-show="!!curSelDataKey && (!isMultiple? true : curSelDataKey.length > 0)"
				:style="{maxHeight:!isMultiple?'5vh':'20vh', overflowY: 'scroll'}">
				<!-- 单选已选择 -->
				<view class="single" v-if="!isMultiple">
					<view class="name" @click="delData(curSelData)">
						{{ curSelData[map.label] }}
					</view>
					<uni-icons type="trash-filled" @click="delData(curSelData)" color="#e43d33" size="20"></uni-icons>
				</view>
				<!-- 多选已选择 -->
				<view class="multiple" v-if="!!isMultiple" v-for="(item, index) in curSelData" :key="index">
					<view class="name" @click="delData(item)">
						{{ item[map.label] }}
					</view>
					<uni-icons type="trash-filled" @click="delData(item)" color="#e43d33" size="20"></uni-icons>
				</view>
			</view>
			<!-- 面板数据 -->
			<scroll-view class="data" :scroll-y="true" @scrolltolower="scrolltolower">
				<uni-list>
					<uni-list-item v-for="(item, index) in rangeData" :key="index">
						<!-- 选择icon -->
						<template v-slot:header>
							<view>
								<uni-icons
									v-show="!isMultiple ? item[map.key] != curSelDataKey: curSelDataKey.indexOf(item[map.key]) == -1"
									type="circle" :size="25" @click="selData(item, index)"></uni-icons>
								<uni-icons
									v-show="!isMultiple ? item[map.key] == curSelDataKey: curSelDataKey.indexOf(item[map.key]) != -1"
									type="checkbox-filled" :size="25" color="#2979ff" @click="delData(item, index)">
								</uni-icons>
							</view>
						</template>
						<!-- 名称 -->
						<template v-slot:body>
							<text class="name" @click="selOrDelData(item, index)">{{item[map.label]}}</text>
						</template>
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		getCurrentInstance,
		watch,
		inject
	} from "vue";
	import XEUtils from 'xe-utils'

	const emits = defineEmits(['update:modelValue', 'queryCurSelData', 'scrollToLower', 'cancel', 'confirm'])

	const props = defineProps({
		// value: [String, Array],
		modelValue: [String, Array],
		border: {
			type: Boolean,
			default: true,
			required: false
		},
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
	})
	// 数据类型校验
	// if (props.value) {
	// 	if (!props.isMultiple && typeof props.value !== "string") {
	// 		console.error("单选所传value值应为字符串")
	// 	}
	// 	if (!!props.isMultiple && !Array.isArray(props.value)) {
	// 		console.error("多选所传value值应为数组")
	// 	}
	// }
	if (props.modelValue) {
		if (!props.isMultiple && typeof props.modelValue !== "string") {
			console.error("单选所传modelValue值应为字符串")
		}
		if (!!props.isMultiple && !Array.isArray(props.modelValue)) {
			console.error("多选所传modelValue值应为数组")
		}
	}

	// 弹出
	const popupRef = ref()

	// 当前选中的数据key及数据
	const curSelDataKey = !props.isMultiple ? ref("") : ref([])
	const curSelData = !props.isMultiple ? ref({}) : ref([])

	watch(() => props.modelValue, (newValue, oldValue) => {
		initData()
	}, {
		deep: false,
		immediate: false
	})

	watch(() => props.rangeData, (newValue, oldValue) => {
		if(!props.isBigData){
			initData()
		}
	}, {
		deep: false,
		immediate: false
	})
	
	const initData = () => {
		// 单选curSelData初始化值赋值
		if (!props.isMultiple) {
			curSelDataKey.value = props.modelValue ? XEUtils.clone(props.modelValue, true) : ""
			if(props.isBigData){
				emits('queryCurSelData', curSelDataKey.value, (val) => {
					curSelData.value = val
				})
			}else{
				if (!XEUtils.isEmpty(curSelDataKey.value)) {
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
			
			if(props.isBigData){
				emits('queryCurSelData', curSelDataKey.value, (val) => {
					curSelData.value = val
				})
			}else{
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

	// 点击输入框
	const handleInput = () => {
		// initData()
		popupRef.value.open('bottom')
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
			curSelDataKey.value.splice(curSelDataKey.value.findIndex(curSelDataKeyItem => curSelDataKeyItem === item[
				props.map.key]), 1);
			curSelData.value.splice(curSelData.value.findIndex(curSelDataItem => curSelDataItem[props.map.key] ===
				item[props.map.key]), 1);
		}
	}

	// 取消
	const cancel = () => {
		// 重置数据
		initData()
		popupRef.value.close()
	}

	const confirm = () => {
		// 更新数据
		emits('update:modelValue', curSelDataKey.value)
		// 调用父组件方法
		emits('confirm', {
			curSelDataKey: curSelDataKey.value,
			curSelData: curSelData.value
		})
		popupRef.value.close()
	}
	const scrolltolower = () =>{
		emits('scrollToLower')
	}
	defineExpose({
		initData
	})
</script>

<style lang="scss">
	.snowy-sel-picker {
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

				.multiple {
					display: inline-block;
					margin: 0px 10upx 0px 0px
				}

				.placeholder {
					color: $uni-secondary-color;
				}
			}

			.input-value-border {
				border: 1px solid $uni-border-2;
				border-radius: 5upx;
			}
		}

		.pop {
			.action {
				display: flex;
				justify-content: space-between;
				margin: 30upx;
				font-size: 30upx;

				.cal {
					color: $uni-secondary-color
				}

				.conf {
					color: $uni-primary
				}
			}

			.choiced {
				.single {
					margin: 5px 30upx;
					display: inline-block;

					.name {
						display: inline-block;
						vertical-align: top;
						color: $uni-main-color;
					}
				}

				.multiple {
					margin: 10upx 0 10upx 30upx;
					display: inline-block;

					.name {
						display: inline-block;
						vertical-align: top;
						color: $uni-main-color;
					}
				}
			}

			.data {
				width: 100vw;
				height: 40vh;
				overflow-y: scroll;

				.name {
					flex: 1;
					font-size: 30upx;
					margin: 2upx 20upx;
				}
			}
		}
	}
</style>
