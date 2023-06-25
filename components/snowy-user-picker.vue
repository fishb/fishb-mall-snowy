<template>
	<view class="snowy-user-picker">
		<view class="input" @click="handleInput">
			<view class="input-value" :class="{ 'input-value-border': props.border }">
				<!-- 单选 -->
				<view v-if="!isMultiple && curSelUserId && curSelUserId !== ''">
					{{ curSelUser.name }}
				</view>
				<!-- 多选 -->
				<view class="multiple" v-else-if="!!isMultiple && curSelUserId && curSelUserId.length > 0"
					v-for="(item, key, index) in curSelUser" :key="index">
					{{ item.name }}
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
			<!-- 搜索 -->
			<uni-search-bar v-model="searchFormState.searchKey" @confirm="loadUserData(true)" ></uni-search-bar>
			<!-- 面包屑 -->
			<view class="crumb">
				<text v-for="(item, index) in allClickSelOrg" :key="index" @click="clickOrgCru(item, index)"
					:class="index === (allClickSelOrg.length-1) ? 'uni-secondary-color' : 'uni-primary'">
					{{ item.name + (index === (allClickSelOrg.length-1) ? '' : ' | ') }}
				</text>
			</view>
			<!-- 已选择 -->
			<view class="choiced" v-show="!!curSelUserId && (!isMultiple? true : curSelUserId.length > 0)"
				:style="{maxHeight:!isMultiple?'5vh':'20vh', overflowY: 'scroll'}">
				<!-- 单选已选择 -->
				<view class="single" v-if="!isMultiple">
					<view class="name" @click="delUser(curSelUser)">
						{{ curSelUser.name }}
					</view>
					<uni-icons type="trash-filled" @click="delUser(curSelUser)" color="#e43d33" size="20"></uni-icons>
				</view>
				<!-- 多选已选择 -->
				<view class="multiple" v-if="!!isMultiple" v-for="(item, index) in curSelUser" :key="index">
					<view class="name" @click="delUser(item)">
						{{ item.name }}
					</view>
					<uni-icons type="trash-filled" @click="delUser(item)" color="#e43d33" size="20"></uni-icons>
				</view>
			</view>
			<!-- 部门和人员 -->
			<scroll-view class="orgAndUser" :scroll-y="true" @scrolltolower="scrolltolower">
				<!-- 部门 -->
				<uni-list class="org">
					<uni-list-item v-for="(item, index) in curClickSelOrg" :key="index">
						<!-- 名称 -->
						<template v-slot:body>
							<text class="name" @click="clickOrg(item, index)">{{item.name}}</text>
						</template>
						<!-- 右侧icon -->
						<template v-slot:footer>
							<uni-icons v-if="item.children? true : false" type="right" @click="clickOrg(item, index)">
							</uni-icons>
						</template>
					</uni-list-item>
				</uni-list>
				<!-- 人员 -->
				<uni-list :border="false">
					<uni-list-chat 
						v-for="(item, index) in userData" :key="index" 
						:title="item?.name"
						:avatar="item?.avatar || '/static/logo.png'" 
						:note="item?.orgName + ' | '+ item?.positionName +' | '+item?.genderName"
						:time="item?.entryDate" 
						:clickable="true" @click="clickUser(item, index)">
						<uni-icons v-show="!isMultiple ? item.id != curSelUserId: curSelUserId.indexOf(item.id) == -1" type="circle" :size="25"></uni-icons>
						<uni-icons v-show="!isMultiple ? item.id == curSelUserId: curSelUserId.indexOf(item.id) != -1" type="checkbox-filled" :size="25" color="#2979ff"></uni-icons>
					</uni-list-chat>
				</uni-list>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		orgTree
	} from '@/api/biz/bizOrgApi.js'
	import {
		userSelector,
		getUserListByIdList
	} from '@/api/components/picker/userPickerApi.js'
	import {
		reactive,
		ref,
		getCurrentInstance,
		watch,
		inject
	} from "vue";
	import XEUtils from 'xe-utils'
	import {
		onLoad,
		onShow,
		onReady,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app"

	const emits = defineEmits(['update:modelValue', 'cancel', 'confirm'])
	const props = defineProps({
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
		getUserListByIdListUrl: {
			type: String,
			default: null,
			required: false
		},
		userSelectorUrl: {
			type: String,
			default: null,
			required: false
		},
	})
	// 数据类型校验
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
	orgTree().then(res => {
		curClickSelOrg.value = res.data
		allClickSelOrg.value = [{
			id: '0',
			name: '全部',
			children: res.data
		}]
	})
	// 监听函数
	watch(() => props.modelValue, (newValue, oldValue) => {
		initData()
		loadUserData(true)
	}, {
		deep: false,
		immediate: false
	})

	const initData = () => {
		// 单选curSelUser初始化值赋值
		if (!props.isMultiple) {
			if (!XEUtils.isEmpty(props.modelValue)) {
				getUserListByIdList({
					idList: [props.modelValue]
				}).then(res => {
					curSelUser.value = !XEUtils.isEmpty(res.data)? res.data[0] : {}
				})
				curSelUserId.value = XEUtils.clone(props.modelValue, true)
			} else {
				curSelUser.value = {}
				curSelUserId.value = ""
			}
		}
		// 多选curSelUser初始化值赋值
		if (!!props.isMultiple) {
			if (!XEUtils.isEmpty(props.modelValue)) {
				getUserListByIdList({
					idList: props.modelValue
				}, props.getUserListByIdListUrl).then(res => {
					curSelUser.value = !XEUtils.isEmpty(res.data)? res.data : []
				})
				curSelUserId.value = XEUtils.clone(props.modelValue, true)
			} else {
				curSelUser.value = []
				curSelUserId.value = []
			}
		}
	}
	
	const loadUserData = (isReset) => {
		if (isReset) {
			parameter.current = 1
			userData.value = []
		}
		Object.assign(parameter, searchFormState)
		userSelector(parameter, props.userSelectorUrl).then(res => {
			if (XEUtils.isEmpty(res?.data?.records)) {
				return
			}
			userData.value = userData.value.concat(res.data.records)
			parameter.current++
		})
	}

	// 点击输入框
	const handleInput = () => {
		// 重新初始化数据，防止数据更新
		loadUserData(true)
		popupRef.value.open('bottom')
	}

	// 点击面包屑
	const clickOrgCru = (item, index) => {
		curClickSelOrg.value = item.children
		allClickSelOrg.value.splice(index + 1, allClickSelOrg.value.length - (index + 1))

		searchFormState.orgId = (item.id === '0' ? null : item.id)
		loadUserData(true)
	}

	// 点击用户
	const clickUser = (item, index) => {
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
		initData()
		loadUserData(true)
		popupRef.value.close()
	}

	const confirm = () => {
		// 更新数据
		emits('update:modelValue', curSelUserId.value)
		// 调用父组件方法
		emits('confirm', {
			curSelUserId: curSelUserId.value,
			curSelUser: curSelUser.value
		})
		popupRef.value.close()
	}
	
	const scrolltolower = () =>{
		loadUserData()
	}
</script>

<style lang="scss" scoped>
	.snowy-user-picker {
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

			.orgAndUser {
				width: 100vw;
				height: 70vh;
				overflow-y: scroll;

				.org {
					.name {
						flex: 1;
						font-size: 30upx;
						margin: 2upx 0;
					}
				}
			}
		}
	}
</style>