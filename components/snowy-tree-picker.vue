<template>
	<view class="snowy-data-picker">
		<view class="input" @click="handleInput">
			<view class="input-value" :class="{ 'input-value-border': props.border }">
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
		<uni-popup class="pop" ref="popupRef" type="bottom" background-color="#fff" @maskClick="cancel">
			<view class="action">
				<view class="cal" @click="cancel"> 取消 </view>
				<view class="conf" @click="confirm"> 确定 </view>
			</view>
			<!-- 面包屑 -->
			<view class="crumb">
				<text v-for="(item, index) in allClickSelData" :key="index" @click="clickDataCru(item, index)" :class="index === (allClickSelData.length-1) ? 'uni-secondary-color' : 'uni-primary'">
					{{ item[map.label] + (index === (allClickSelData.length-1) ? '' : ' | ') }}
				</text>
			</view>
			<!-- 已选择 -->
			<view class="choiced" v-show="!!curSelDataKey && (!isMultiple? true : curSelDataKey.length > 0)" :style="{maxHeight:!isMultiple?'5vh':'20vh', overflowY: 'scroll'}">
				<!-- 单选已选择 -->
				<view class="single" v-if="!isMultiple">
					<view class="label" @click="delData(curSelData)">
						{{ curSelData[map.label] }}
					</view>
					<uni-icons type="trash-filled" @click="delData(curSelData)" color="#e43d33" size="20"></uni-icons>
				</view>
				<!-- 多选已选择 -->
				<view class="multiple" v-if="!!isMultiple" v-for="(item, index) in curSelData">
					<view class="label" @click="delData(item)">
						{{ item[map.label] }}
					</view>
					<uni-icons type="trash-filled" @click="delData(item)" color="#e43d33" size="20"></uni-icons>
				</view>
			</view>
			<!-- 数据 -->
			<view class="data">
				<uni-list>
					<uni-list-item v-for="(item, index) in curClickSelData" :key="index">
						<!-- 选择icon -->
						<template v-slot:header>
							<view>
								<uni-icons v-show="!isMultiple ? item[map.key] != curSelDataKey: curSelDataKey.indexOf(item[map.key]) == -1" type="circle" :size="25" @click="selData(item, index)"></uni-icons>
								<uni-icons v-show="!isMultiple ? item[map.key] == curSelDataKey: curSelDataKey.indexOf(item[map.key]) != -1" type="checkbox-filled" :size="25" color="#2979ff" @click="delData(item, index)">
								</uni-icons>
							</view>
						</template>
						<!-- 名称 -->
						<template v-slot:body>
							<text class="label" @click="clickData(item, index)">{{ item[map.label] }}</text>
						</template>
						<!-- 右侧icon -->
						<template v-slot:footer>
							<uni-icons type="right" @click="clickData(item, index)" v-if="$utils.isEmpty(item[map.children]) ? false : true">
							</uni-icons>
						</template>
					</uni-list-item>
				</uni-list>
			</view>
		</uni-popup>
	</view>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance, watch, inject } from "vue"
	import XEUtils from 'xe-utils'
	const emits = defineEmits(['update:modelValue', 'queryTreeData', 'cancel', 'confirm'])
	const props = defineProps({
		modelValue: [Number, String, Array],
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
		isTopLevel: {
			type: Boolean,
			default: false,
			required: false
		},
		map: {
			type: Object,
			default: {
				key: "key",
				parentKey: "parentKey",
				children: "children",
				label: "label"
			},
			required: false
		},
	})
	if (props.modelValue) {
		if (!props.isMultiple && (typeof props.modelValue !== "string" || typeof props.modelValue != "number")) {
			console.error("单选所传modelValue值应为字符串或数字")
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
	// 所有点击选中数据【页面数据】
	const allClickSelData = ref([])
	// 当前点击选中数据【页面数据】
	const curClickSelData = ref([])
	watch(() => props.modelValue, (newValue, oldValue) => {
		loadData()
	}, {
		deep: false,
		immediate: false
	})
	const loadData = () => {
		emits('queryTreeData', null, (treeData) => {
			if (props.isTopLevel) {
				// 含有顶级
				curClickSelData.value = [{
					[props.map.key]: '0',
					[props.map.parentKey]: '-1',
					[props.map.label]: '顶级',
					[props.map.children]: treeData
				}]
				allClickSelData.value = [{
					[props.map.key]: '-1',
					[props.map.label]: '全部',
					[props.map.children]: [{
						[props.map.key]: '0',
						[props.map.parentKey]: '-1',
						[props.map.label]: '顶级',
						[props.map.children]: treeData
					}]
				}]
			} else {
				// 不含有顶级
				curClickSelData.value = treeData || []
				allClickSelData.value = [{
					[props.map.key]: '0',
					[props.map.parentKey]: '-1',
					[props.map.label]: '全部',
					[props.map.children]: treeData
				}]
			}
			// 单选curSelData初始化值赋值
			if (!props.isMultiple) {
				if (props.modelValue) {
					curSelDataKey.value = XEUtils.clone(props.modelValue, true)
				} else {
					curSelDataKey.value = ""
				}
				if (curSelDataKey.value) {
					const curSelDataArr = XEUtils.filterTree(allClickSelData.value, item => {
						return curSelDataKey.value === item[props.map.key]
					})
					if (curSelDataArr && curSelDataArr.length === 1) {
						curSelData.value = curSelDataArr[0]
					}
				} else {
					curSelData.value = {}
				}
			}
			// 多选curSelData初始化值赋值
			if (!!props.isMultiple) {
				if (props.modelValue && props.modelValue.length > 0) {
					curSelDataKey.value = XEUtils.clone(props.modelValue, true)
				} else {
					curSelDataKey.value = []
				}
				if (curSelDataKey.value && curSelDataKey.value.length > 0) {
					curSelData.value = XEUtils.filterTree(allClickSelData.value, item => {
						return curSelDataKey.value.includes(item[props.map.key])
					})
				} else {
					curSelData.value = []
				}
			}
		})
	}
	loadData()
	// 点击输入框
	const handleInput = () => {
		// 重新初始化数据，防止数据更新
		popupRef.value.open('bottom')
	}
	// 点击面包屑
	const clickDataCru = (item, index) => {
		curClickSelData.value = item[props.map.children]
		allClickSelData.value.splice(index + 1, allClickSelData.value.length - (index + 1))
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
	// 点击数据
	const clickData = (item, index) => {
		if (XEUtils.isEmpty(item[props.map.children])) {
			return
		}
		curClickSelData.value = item[props.map.children]
		allClickSelData.value.push(item)
	}
	// 取消
	const cancel = () => {
		// 重置数据
		loadData()
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
</script>
<style lang="scss" scoped>
	.snowy-data-picker {
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

			.crumb {
				margin: 30upx;
				border-radius: 5upx;
				white-space: nowrap;
				overflow-x: scroll;
				background-color: white;
			}

			.choiced {
				.single {
					margin: 5px 30upx;
					display: inline-block;

					.label {
						display: inline-block;
						vertical-align: top;
						color: $uni-main-color;
					}
				}

				.multiple {
					margin: 10upx 0 10upx 30upx;
					display: inline-block;

					.label {
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

				.label {
					flex: 1;
					font-size: 30upx;
					margin: 2upx 20upx;
				}
			}
		}
	}
</style>