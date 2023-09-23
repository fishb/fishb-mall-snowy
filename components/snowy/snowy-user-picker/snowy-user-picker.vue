<template>
	<view class="snowy-user-picker">
		<view @click="handleInput" :class="{ 'input-disabled': props.disabled }">
			<view class="input-value">
				<!-- 单选 -->
				<view v-if="!isMultiple && curSelUserId && curSelUserId !== ''">
					{{ curSelUser.name }}
				</view>
				<!-- 多选 -->
				<view class="multiple" v-else-if="!!isMultiple && curSelUserId && curSelUserId.length > 0" v-for="(item, key, index) in curSelUser" :key="index">
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
				<scroll-view :scroll-y="true" :style="{maxHeight:!isMultiple?'5vh':'10vh'}" class="choiced" v-show="!!curSelUserId && (!isMultiple? true : curSelUserId.length > 0)">
					<!-- 单选已选择 -->
					<view class="single" v-if="!isMultiple">
						<view class="label" @click="delUser(curSelUser)">
							{{ curSelUser.name }}
						</view>
						<view class="icon">
							<icon type="clear" @click="delUser(curSelUser)" color="#ffffff" size="15"></icon>
						</view>
					</view>
					<!-- 多选已选择 -->
					<view class="multiple" v-if="!!isMultiple" v-for="(item, index) in curSelUser" :key="index">
						<view class="label" @click="delUser(item)">
							{{ item.name }}
						</view>
						<view class="icon">
							<icon type="clear" @click="delUser(curSelUser)" color="#ffffff" size="15"></icon>
						</view>
					</view>
				</scroll-view>
				<!-- 组织和人员 -->
				<scroll-view class="orgAndUser" :scroll-y="true" @scrolltolower="scrolltolower">
					<!-- 搜索 -->
					<snowy-search v-model="searchFormState.searchKey" @confirm="loadUserData(true)" @clear="loadUserData(true)" :customStyle="{'padding': 0}"></snowy-search>
					<!-- 面包屑 -->
					<view class="crumb snowy-shadow">
						<text v-for="(item, index) in allClickSelOrg" :key="index" @click="clickOrgCru(item, index)" :style="{ color: index === (allClickSelOrg.length-1) ? '#3a3a3a' : '#5677fc' }">
							{{ item.name + (index === (allClickSelOrg.length-1) ? '' : ' | ') }}
						</text>
					</view>
					<!-- 组织 -->
					<view class="org-item" v-for="(item, index) in curClickSelOrg" :key="index" :index="index" @click="clickOrg(item, index)">
						<uv-row>
							<uv-col :span="6">
								<view class="item-left">{{item.name}}</view>
							</uv-col>
							<uv-col :span="6">
								<view class="snowy-flex-end">
									<uv-icon name="arrow-right" size="20"></uv-icon>
								</view>
							</uv-col>
						</uv-row>
					</view>
					<!-- 人员 -->
					<view class="user-item" :class="{ 'item-sel': !isMultiple ? item.id == curSelUserId: curSelUserId.indexOf(item.id) != -1 }" v-for="(item, index) in userData" :key="index" :index="index" @click="selOrDelUser(item, index)">
						<uv-row>
							<uv-col :span="1.5">
								<image class="item-img" :src="item?.avatar || '/static/logo.png'" mode="widthFix"></image>
							</uv-col>
							<uv-col :span="9.5">
								<view class="item-title">{{item?.name}}</view>
								<view class="item-sub-title">
									{{item?.orgName + ' | '+ item?.positionName +' | '+item?.genderName}}
								</view>
							</uv-col>
							<uv-col :span="1">
								<view v-show="!isMultiple ? item.id != curSelUserId: curSelUserId.indexOf(item.id) == -1">
									<uv-icon name="checkmark-circle" :size="20"></uv-icon>
								</view>
								<view v-show="!isMultiple ? item.id == curSelUserId: curSelUserId.indexOf(item.id) != -1">
									<uv-icon name="checkmark-circle-fill" :size="20" color="#2979ff"></uv-icon>
								</view>
							</uv-col>
						</uv-row>
					</view>
					<snowy-empty v-show="$xeu.isEmpty(userData)"></snowy-empty>
				</scroll-view>
			</view>
		</uv-popup>
	</view>
</template>

<script setup>
	import { reactive, ref, getCurrentInstance, watch, inject } from "vue";
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	const emits = defineEmits(['update:modelValue', 'cancel', 'confirm'])
	const props = defineProps({
		modelValue: [String, Array],
		placeholder: {
			type: String,
			default: "请选择",
			required: false
		},
		// 是否多选
		isMultiple: {
			type: Boolean,
			default: false,
			required: false
		},
		// 部门树api
		orgTreeApi: {
			type: Function,
			default: () => {
				return Promise.resolve()
			},
			required: false
		},
		// 已选择用户数据api
		checkedUserListApi: {
			type: Function,
			default: () => {
				return Promise.resolve()
			},
			required: false
		},
		// 用户分页api
		userPageApi: {
			type: Function,
			default: () => {
				return Promise.resolve()
			},
			required: false
		},
		autoInitData: {
			type: Boolean,
			default: true,
			required: false
		}
	})
	// 弹出
	const popRef = ref()
	const searchFormState = reactive({})
	const parameter = reactive({
		current: 1,
		size: 10
	})
	const userData = ref([])
	// 当前选中的机构id及机构
	const curSelUserId = !props.isMultiple ? ref("") : ref([])
	const curSelUser = !props.isMultiple ? ref({}) : ref([])
	// 所有点击选中机构【页面数据】
	const allClickSelOrg = ref([])
	// 当前点击选中机构【页面数据】
	const curClickSelOrg = ref([])
	
	const initOrResetData = () => {
		// 单选curSelUser初始化值赋值
		if (!props.isMultiple) {
			if (!uni.$xeu.isEmpty(props.modelValue)) {
				props.checkedUserListApi({
					idList: [props.modelValue]
				}).then(res => {
					curSelUser.value = !uni.$xeu.isEmpty(res?.data) ? res?.data[0] : {}
				})
				curSelUserId.value = uni.$xeu.clone(props.modelValue, true)
			} else {
				curSelUser.value = {}
				curSelUserId.value = ""
			}
		}
		// 多选curSelUser初始化值赋值
		if (!!props.isMultiple) {
			if (!uni.$xeu.isEmpty(props.modelValue)) {
				props.checkedUserListApi({
					idList: props.modelValue
				}).then(res => {
					curSelUser.value = !uni.$xeu.isEmpty(res?.data) ? res.data : []
				})
				curSelUserId.value = uni.$xeu.clone(props.modelValue, true)
			} else {
				curSelUser.value = []
				curSelUserId.value = []
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
	const loadOrgTree = (orgTreeParam) => {
		props.orgTreeApi().then(res => {
			curClickSelOrg.value = res?.data || []
			allClickSelOrg.value = [{
				id: '0',
				name: '全部',
				children: res?.data || []
			}]
		})
	}
	if (props.autoInitData) {
		loadOrgTree()
	}
	
	const loadUserData = (isReset, userSelectorParam) => {
		if (isReset) {
			parameter.current = 1
			userData.value = []
		}
		Object.assign(parameter, userSelectorParam)
		Object.assign(parameter, searchFormState)
		props.userPageApi(parameter).then(res => {
			if (uni.$xeu.isEmpty(res?.data?.records)) {
				return
			}
			userData.value = userData.value.concat(res.data.records)
			parameter.current++
		})
	}
	if (props.autoInitData) {
		loadUserData(true)
	}
	// 点击输入框
	const handleInput = () => {
		// 重新初始化数据，防止数据更新
		// loadUserData(true)
		popRef.value.open()
	}
	// 点击面包屑
	const clickOrgCru = (item, index) => {
		curClickSelOrg.value = item.children
		allClickSelOrg.value.splice(index + 1, allClickSelOrg.value.length - (index + 1))
		searchFormState.orgId = (item.id === '0' ? null : item.id)
		loadUserData(true)
	}
	// 点击用户
	const selOrDelUser = (item, index) => {
		if (!props.isMultiple) {
			if (item.id != curSelUserId.value) {
				selUser(item, index)
			} else {
				delUser(item, index)
			}
		} else {
			if (!curSelUserId.value.includes(item.id)) {
				selUser(item, index)
			} else {
				delUser(item, index)
			}
		}
	}
	// 选择用户
	const selUser = (item, index) => {
		if (!props.isMultiple) {
			curSelUserId.value = item.id
			curSelUser.value = item
		} else {
			curSelUserId.value.push(item.id)
			curSelUser.value.push(item)
		}
	}
	// 移除用户
	const delUser = (item, index) => {
		if (!props.isMultiple) {
			curSelUserId.value = ""
			curSelUser.value = {}
		} else {
			curSelUserId.value.splice(curSelUserId.value.findIndex(curSelOrgIdItem => curSelOrgIdItem === item.id), 1);
			curSelUser.value.splice(curSelUser.value.findIndex(curSelOrgItem => curSelOrgItem.id === item.id), 1);
		}
	}
	// 点击部门
	const clickOrg = (item, index) => {
		curClickSelOrg.value = item.children
		allClickSelOrg.value.push(item)
		searchFormState.orgId = (item.id === '0' ? null : item.id)
		loadUserData(true)
	}
	// 取消
	const cancel = () => {
		// 重置数据
		initOrResetData()
		// loadUserData(true)
		popRef.value.close()
	}
	const confirm = () => {
		// 更新数据
		modelValueWatchIsAct.value = false
		emits('update:modelValue', curSelUserId.value)
		// 调用父组件方法
		emits('confirm', {
			curSelUserId: curSelUserId.value,
			curSelUser: curSelUser.value
		})
		popRef.value.close()
	}
	const scrolltolower = () => {
		loadUserData()
	}
	defineExpose({
		initOrResetData,
		loadOrgTree,
		loadUserData
	})
</script>
<style lang="scss" scoped>
	.snowy-user-picker {
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
	
	.orgAndUser {
		width: 100%;
		height: 50vh;
	}
	
	.crumb {
		margin-top: 15rpx;
		padding: 25rpx 30rpx;
		border-radius: 10rpx;
		white-space: nowrap;
		overflow-x: scroll;
	}
	
	.org-item {
		background: #ffffff;
		margin: 10rpx 0;
		padding: 25rpx;
		box-shadow: 0 1px 2px #ccc;
		border-radius: 10rpx;
	
		.item-left {
			font-size: 28rpx;
		}
	
		.item-right {
			font-size: 27rpx;
			text-align: right;
		}
	}
	.user-item {
		background: #ffffff;
		margin: 20rpx 0;
		padding: 25rpx;
		box-shadow: 0 1px 2px #ccc;
		border-radius: 15rpx;
		
		.item-img {
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
			display: block;
			margin-right: 5rpx;
			flex-shrink: 0;
		}
		
		.item-title {
			font-size: 27rpx;
		}
	
		.item-sub-title {
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
</style>