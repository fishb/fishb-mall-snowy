<template>
	<view class="snowy-org-picker">
		<view @click="handleInput" :class="{ 'input-disabled': props.disabled }">
			<view class="input-value">
				<!-- 单选 -->
				<view v-if="!isMultiple && curSelOrgId && curSelOrgId !== ''">
					{{ curSelOrg.name }}
				</view>
				<!-- 多选 -->
				<view class="multiple" v-else-if="!!isMultiple && curSelOrgId && curSelOrgId.length > 0" v-for="(item, key, index) in curSelOrg" :key="index">
					{{ item.name }}
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
				<scroll-view :scroll-y="true" :style="{maxHeight:!isMultiple?'5vh':'10vh'}" class="choiced" v-show="!!curSelOrgId && (!isMultiple? true : curSelOrgId.length > 0)">
					<!-- 单选已选择 -->
					<view class="single" v-if="!isMultiple">
						<view class="label" @click="delOrg(curSelOrg)">
							{{ curSelOrg.name }}
						</view>
						<view class="icon">
							<icon type="clear" @click="delOrg(curSelOrg)" color="#ffffff" size="15"></icon>
						</view>
					</view>
					<!-- 多选已选择 -->
					<view class="multiple" v-if="!!isMultiple" v-for="(item, index) in curSelOrg">
						<view class="label" @click="delOrg(item)">
							{{ item.name }}
						</view>
						<view class="icon">
							<icon type="clear" @click="delOrg(curSelOrg)" color="#ffffff" size="15"></icon>
						</view>
					</view>
				</scroll-view>
				<!-- 面包屑 -->
				<view class="crumb snowy-shadow">
					<text v-for="(item, index) in allClickSelOrg" :key="index" @click="clickOrgCru(item, index)" :style="{ color: index === (allClickSelOrg.length-1) ? '#3a3a3a' : '#5677fc' }">
						{{ item.name + (index === (allClickSelOrg.length-1) ? '' : ' | ') }}
					</text>
				</view>
				<!-- 面板数据 -->
				<scroll-view class="data" :scroll-y="true">
					<view class="item" :class="{ 'item-sel': !isMultiple ? item.id == curSelOrgId: curSelOrgId.indexOf(item.id) != -1 }" v-for="(item, index) in curClickSelOrg" :key="index" :index="index">
						<uv-row>
							<uv-col :span="1.5">
								<view>
									<uv-icon v-show="!isMultiple ? item.id != curSelOrgId: curSelOrgId.indexOf(item.id) == -1" name="checkmark-circle" :size="20" color="#999" @click="selOrg(item, index)"></uv-icon>
									<uv-icon v-show="!isMultiple ? item.id == curSelOrgId: curSelOrgId.indexOf(item.id) != -1" name="checkmark-circle-fill" :size="20" color="#5677fc" @click="delOrg(item, index)"></uv-icon>
								</view>
							</uv-col>
							<uv-col :span="9.5">
								<view class="item-left" @click="clickOrg(item, index)">{{ item.name }}</view>
							</uv-col>
							<uv-col :span="1">
								<view class="snowy-flex-end">
									<uv-icon v-if="$utils.isEmpty(item.children) ? false : true" name="arrow-right" size="20" @click="clickOrg(item, index)"></uv-icon>
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
	import XEUtils from 'xe-utils'
	const { proxy } = getCurrentInstance()
	const emits = defineEmits(['update:modelValue', 'cancel', 'confirm'])
	const props = defineProps({
		modelValue: [String, Array],
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
		orgTreeApi: {
			type: Function,
			default: () => {
				return Promise.resolve()
			},
			required: false
		},
		isTopLevel: {
			type: Boolean,
			default: false,
			required: false
		}
	})
	// 弹出
	const popRef = ref()
	// 当前选中的机构id及机构
	const curSelOrgId = !props.isMultiple ? ref("") : ref([])
	const curSelOrg = !props.isMultiple ? ref({}) : ref([])
	// 所有点击选中机构【页面数据】
	const allClickSelOrg = ref([])
	// 当前点击选中机构【页面数据】
	const curClickSelOrg = ref([])
	const initOrResetData = () => {
		props.orgTreeApi().then(res => {
			if (props.isTopLevel) {
				// 含有顶级
				curClickSelOrg.value = [{
					id: '0',
					parentId: '-1',
					name: '顶级',
					children: res?.data
				}]
				allClickSelOrg.value = [{
					id: '-1',
					name: '全部',
					children: [{
						id: '0',
						parentId: '-1',
						name: '顶级',
						children: res?.data
					}]
				}]
			} else {
				// 不含有顶级
				curClickSelOrg.value = res?.data || []
				allClickSelOrg.value = [{
					id: '0',
					parentId: '-1',
					name: '全部',
					children: res?.data
				}]
			}
			// 单选curSelOrg初始化值赋值
			if (!props.isMultiple) {
				if (props.modelValue) {
					curSelOrgId.value = XEUtils.clone(props.modelValue, true)
				} else {
					curSelOrgId.value = ""
				}
				if (curSelOrgId.value) {
					const curSelOrgArr = XEUtils.filterTree(allClickSelOrg.value, item => {
						return curSelOrgId.value === item.id
					})
					if (curSelOrgArr && curSelOrgArr.length === 1) {
						curSelOrg.value = curSelOrgArr[0]
					}
				} else {
					curSelOrg.value = {}
				}
			}
			// 多选curSelOrg初始化值赋值
			if (!!props.isMultiple) {
				if (props.modelValue && props.modelValue.length > 0) {
					curSelOrgId.value = XEUtils.clone(props.modelValue, true)
				} else {
					curSelOrgId.value = []
				}
				if (curSelOrgId.value && curSelOrgId.value.length > 0) {
					curSelOrg.value = XEUtils.filterTree(allClickSelOrg.value, item => {
						return curSelOrgId.value.includes(item.id)
					})
				} else {
					curSelOrg.value = []
				}
			}
		})
	}
	watch(() => props.modelValue, (newValue, oldValue) => {
		initOrResetData()
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
	const clickOrgCru = (item, index) => {
		curClickSelOrg.value = item.children
		allClickSelOrg.value.splice(index + 1, allClickSelOrg.value.length - (index + 1))
	}
	// 选择部门
	const selOrg = (item, index) => {
		if (!props.isMultiple) {
			curSelOrgId.value = item.id
			curSelOrg.value = item
		} else {
			curSelOrgId.value.push(item.id)
			curSelOrg.value.push(item)
		}
	}
	// 移除部门
	const delOrg = (item, index) => {
		if (!props.isMultiple) {
			curSelOrgId.value = ""
			curSelOrg.value = {}
		} else {
			curSelOrgId.value.splice(curSelOrgId.value.findIndex(curSelOrgIdItem => curSelOrgIdItem === item.id), 1);
			curSelOrg.value.splice(curSelOrg.value.findIndex(curSelOrgItem => curSelOrgItem.id === item.id), 1);
		}
	}
	// 点击部门
	const clickOrg = (item, index) => {
		if (item.children) {
			curClickSelOrg.value = item.children
			allClickSelOrg.value.push(item)
		}
	}
	// 取消
	const cancel = () => {
		// 重置数据
		initOrResetData()
		popRef.value.close()
	}
	const confirm = () => {
		// 更新数据
		emits('update:modelValue', curSelOrgId.value)
		// 调用父组件方法
		emits('confirm', {
			curSelOrgId: curSelOrgId.value,
			curSelOrg: curSelOrg.value
		})
		uni.$uv.formValidate(proxy, "change")
		popRef.value.close()
	}
</script>
<style lang="scss" scoped>
	.snowy-org-picker {
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