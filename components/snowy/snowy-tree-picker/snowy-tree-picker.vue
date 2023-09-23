<template>
	<view class="snowy-data-picker">
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
					<view class="multiple" v-if="!!isMultiple" v-for="(item, index) in curSelData">
						<view class="label" @click="delData(item)">
							{{ item[map.label] }}
						</view>
						<view class="icon">
							<icon type="clear" @click="delData(curSelData)" color="#ffffff" size="15"></icon>
						</view>
					</view>
				</scroll-view>
				<!-- 面包屑 -->
				<view class="crumb snowy-shadow">
					<text v-for="(item, index) in allClickSelData" :key="index" @click="clickDataCru(item, index)" :style="{ color: index === (allClickSelData.length-1) ? '#3a3a3a' : '#5677fc' }">
						{{ item[map.label] + (index === (allClickSelData.length-1) ? '' : ' | ') }}
					</text>
				</view>
				<!-- 面板数据 -->
				<scroll-view class="data" :scroll-y="true">
					<view class="item" :class="{ 'item-sel': !isMultiple ? item[map.key] == curSelDataKey: curSelDataKey.indexOf(item[map.key]) != -1 }" v-for="(item, index) in curClickSelData" :key="index" :index="index">
						<uv-row>
							<uv-col :span="1.5">
								<view v-show="!isMultiple ? item[map.key] != curSelDataKey: curSelDataKey.indexOf(item[map.key]) == -1">
									<uv-icon name="checkmark-circle" :size="20" color="#999" @click="selData(item, index)"></uv-icon>
								</view>
								<view v-show="!isMultiple ? item[map.key] == curSelDataKey: curSelDataKey.indexOf(item[map.key]) != -1">
									<uv-icon name="checkmark-circle-fill" :size="20" color="#2979ff" @click="delData(item, index)"></uv-icon>
								</view>
							</uv-col>
							<uv-col :span="9.5">
								<view class="item-left" @click="clickData(item, index)">{{ item[map.label] }}</view>
							</uv-col>
							<uv-col :span="1">
								<view class="snowy-flex-end">
									<uv-icon v-show="$xeu.isEmpty(item[map.children]) ? false : true" name="arrow-right" size="20" @click="clickData(item, index)"></uv-icon>
								</view>
							</uv-col>
						</uv-row>
					</view>
				</scroll-view>
			</view>
		</uv-popup>
	</view>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance, watch, inject } from "vue"
	const emits = defineEmits(['update:modelValue', 'queryTreeData', 'cancel', 'confirm'])
	const props = defineProps({
		// value: [String, Array],
		modelValue: [Number, String, Array],
		isMultiple: {
			type: Boolean,
			default: false,
			required: false
		},
		placeholder: {
			type: String,
			default: "请选择机构",
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
	// 弹出
	const popRef = ref()
	// 当前选中的数据key及数据
	const curSelDataKey = !props.isMultiple ? ref("") : ref([])
	const curSelData = !props.isMultiple ? ref({}) : ref([])
	// 所有点击选中数据【页面数据】
	const allClickSelData = ref([])
	// 当前点击选中数据【页面数据】
	const curClickSelData = ref([])
	const initOrResetData = () => {
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
					curSelDataKey.value = uni.$xeu.clone(props.modelValue, true)
				} else {
					curSelDataKey.value = ""
				}
				if (curSelDataKey.value) {
					const curSelDataArr = uni.$xeu.filterTree(allClickSelData.value, item => {
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
					curSelDataKey.value = uni.$xeu.clone(props.modelValue, true)
				} else {
					curSelDataKey.value = []
				}
				if (curSelDataKey.value && curSelDataKey.value.length > 0) {
					curSelData.value = uni.$xeu.filterTree(allClickSelData.value, item => {
						return curSelDataKey.value.includes(item[props.map.key])
					})
				} else {
					curSelData.value = []
				}
			}
		})
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
	// 点击输入框
	const handleInput = () => {
		// 重新初始化数据，防止数据更新
		popRef.value.open()
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
		if (uni.$xeu.isEmpty(item[props.map.children])) {
			return
		}
		curClickSelData.value = item[props.map.children]
		allClickSelData.value.push(item)
	}
	// 取消
	const cancel = () => {
		// 重置数据
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
</script>
<style lang="scss" scoped>
	.snowy-data-picker {
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

	.crumb {
		margin-top: 15rpx;
		padding: 25rpx 30rpx;
		border-radius: 10rpx;
		white-space: nowrap;
		overflow-x: scroll;
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
				font-size: 30rpx;
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