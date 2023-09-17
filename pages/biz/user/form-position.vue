<template>
	<view style="width: 100%;">
		<view v-for="(item, index) in dataList" :key="index">
			<tui-button margin="0 0 50rpx 0" :preventClick="true" type="danger" @click="del(index)">删除任职</tui-button>
			<uv-form :key="index" :ref="`formRef${ index }`" :model="item" :rules="rules" label-position="top" labelWidth="auto">
				<uv-form-item label="机构" prop="orgId" required>
					<!-- 多选属性:isMultiple="true" -->
					<snowy-org-picker v-model="item.orgId" placeholder="请选择机构" @confirm="(data)=>{orgChange(data,index)}" :org-tree-api="selectorApiFunction.orgTreeApi" @validateField="$refs[`formRef${ index }`][0].validateField('orgId')">
					</snowy-org-picker>
				</uv-form-item>
				<uv-form-item label="职位" prop="positionId" required>
					<snowy-sel-picker :ref="`positionRef${ index }`" :map="{key: 'id', label: 'name'}" v-model="item.positionId" :rangeData="positionDataList[index]" placeholder="请选择选择职位" :isBigData="true" @scrollToLower="positionScrollToLower(index)" @queryCurSelData="positionQueryCurSelData" @validateField="$refs[`formRef${ index }`][0].validateField('positionId')"></snowy-sel-picker>
				</uv-form-item>
				<uv-form-item label="主管" prop="directorId">
					<!-- 多选属性:isMultiple="true"  :autoInitData="false" -->
					<snowy-user-picker :ref="`directorRef${ index }`" v-model="item.directorId" placeholder="请选择主管" :org-tree-api="selectorApiFunction.orgTreeApi" :user-page-api="selectorApiFunction.userPageApi" :checked-user-list-api="selectorApiFunction.checkedUserListApi">
					</snowy-user-picker>
				</uv-form-item>
			</uv-form>
		</view>
		<tui-button ssmargin="50rpx 0 0 0" :preventClick="true" type="primary" @click="add">增加任职</tui-button>
	</view>
	
</template>
<script setup>
	import { userPositionSelector, userSelector, userOrgTreeSelector } from '@/api/biz/bizUserApi'
	import { getPositionListByIdList, userCenterGetUserListByIdList } from '@/api/sys/userCenterApi'
	import XEUtils from 'xe-utils'
	import { nextTick, reactive, ref, watch, getCurrentInstance } from "vue"
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	const { proxy } = getCurrentInstance()
	const emits = defineEmits(['update:modelValue'])
	const props = defineProps({
		modelValue: {
			type: String,
			default: '',
			required: false
		},
	})
	const rules = reactive({
		orgId: [{
			type: 'string',
			required: true,
			message: '请选择机构',
		}],
		positionId: [{
			type: 'string',
			required: true,
			message: '请选择职位',
		}],
	})
	// 数据列表
	const dataList = ref([])
	// 传递用户选择器需要的API
	const selectorApiFunction = {
		orgTreeApi: (param) => {
			return userOrgTreeSelector(param).then((res) => {
				return Promise.resolve(res)
			})
		},
		userPageApi: (param) => {
			return userSelector(param).then((data) => {
				return Promise.resolve(data)
			})
		},
		checkedUserListApi: (param) => {
			return userCenterGetUserListByIdList(param).then((data) => {
				return Promise.resolve(data)
			})
		}
	}
	// 职位参数
	const positionParamList = ref([])
	// 职位下拉列表
	const positionDataList = ref([])
	watch(() => props.modelValue, (newValue, oldValue) => {
		initData()
	}, {
		deep: false,
		immediate: false
	})
	const initData = () => {
		if (props.modelValue) {
			dataList.value = XEUtils.clone(JSON.parse(props.modelValue), true)
		} else {
			dataList.value = []
		}
		dataList.value.forEach((item, index) => {
			if (positionParamList.value[index] === undefined || positionParamList.value[index] === null) {
				positionParamList.value[index] = {}
			}
			positionParamList.value[index].orgId = item.orgId
			loadPositionSelector(true, index)
			nextTick(() => {
				proxy.$refs[`positionRef${ index }`][0].initData()
				proxy.$refs[`directorRef${ index }`][0].initData()
				// proxy.$refs[`directorRef${ index }`][0].loadUserData(true, {orgId: item.orgId})
			})
		})
	}
	// 组织变换
	const orgChange = ({
		curSelOrgId,
		curSelOrg
	}, index) => {
		// 重置职位数据
		dataList.value[index].positionId = null
		positionParamList.value[index].orgId = curSelOrgId
		loadPositionSelector(true, index)
		// 重置用户数据
		// dataList.value[index].directorId = null
		// proxy.$refs[`directorRef${ index }`][0].loadUserData(true, {orgId: curSelOrgId})
	}
	// 根据职位id进行查询
	const positionQueryCurSelData = (curSelDataKey, callback) => {
		if (!XEUtils.isEmpty(curSelDataKey)) {
			getPositionListByIdList({
				idList: [curSelDataKey]
			}).then(res => {
				callback(res.data[0])
			})
		}
	}
	// 职位分页加载
	const loadPositionSelector = (isReset, index) => {
		if (isReset) {
			positionParamList.value[index].current = 1
			positionParamList.value[index].size = 10
			positionDataList.value[index] = []
		}
		userPositionSelector(positionParamList.value[index]).then(res => {
			if (XEUtils.isEmpty(res?.data?.records)) {
				return
			}
			positionDataList.value[index] = positionDataList.value[index].concat(res.data.records)
			positionParamList.value[index].current++
		})
	}
	// 职位下拉触发
	const positionScrollToLower = (index) => {
		loadPositionSelector(false, index)
	}
	// 新增
	const add = () => {
		dataList.value.push({
			orgId: "",
			positionId: "",
			directorId: ""
		})
		positionDataList.value.push([])
		positionParamList.value.push({})
	}
	// 删除
	const del = (index) => {
		dataList.value.splice(index, 1)
		positionDataList.value.splice(index, 1)
		positionParamList.value.splice(index, 1)
	}
	// 表单校验
	const formListEmitAndValidate = () => {
		// 更新数据
		if (dataList.value && dataList.value.length > 0) {
			emits('update:modelValue', JSON.stringify(dataList.value))
		}
		// 校验逻辑
		const promiseList = []
		dataList.value.forEach((item, index) => {
			promiseList.push(new Promise((resolve, reject) => {
				proxy.$refs[`formRef${ index }`][0].validate().then(result => {
					resolve(result)
				}).catch(err => {
					reject(err)
				})
			}))
		})
		return new Promise((resolve, reject) => {
			Promise.all(promiseList).then((result) => {
				resolve(result)
			}).catch(err => {
				reject(err)
			})
		})
	}
	defineExpose({
		formListEmitAndValidate
	})
</script>