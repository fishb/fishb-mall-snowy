<template>
	<view>
		<view>
			<tui-tabs :top="0" :isFixed="true" :tabs="[{name:'基础信息'}, {name: '更多信息'}]" :currentTab="curView" @change="(e) => {
					if (curView != e.index) {
						curView = e.index
					}
				}"></tui-tabs>
		</view>
		<view class="container snowy-shadow">
			<uv-form ref="formRef" :model="formData" label-position="top" :rules="rules" labelWidth="auto" :labelStyle="{marginBottom: '25rpx', fontSize: '27rpx', color: '#606266'}">
				<view v-show="curView === 0">
					<uv-form-item label="账号" prop="account" required>
						<uv-input v-model="formData.account" placeholder="请输入账号"></uv-input>
					</uv-form-item>
					<uv-form-item label="姓名" prop="name" required>
						<uv-input v-model="formData.name" placeholder="请输入姓名"></uv-input>
					</uv-form-item>
					<uv-form-item label="性别" prop="gender">
						<uv-radio-group v-model="formData.category">
							<uv-radio :customStyle="{marginRight: '50rpx'}" v-for="(item, index) in genderOptions" :key="index" :label="item.text" :name="item.value">
							</uv-radio>
						</uv-radio-group>
					</uv-form-item>
					<uv-form-item label="昵称" prop="nickname">
						<uv-input v-model="formData.nickname" placeholder="请输入昵称"></uv-input>
					</uv-form-item>
					<uv-form-item label="手机号" prop="phone">
						<uv-input v-model="formData.phone" placeholder="请输入手机"></uv-input>
					</uv-form-item>
					<uv-form-item label="邮箱" prop="email">
						<uv-input v-model="formData.email" placeholder="请输入邮箱"></uv-input>
					</uv-form-item>
					<uv-form-item label="出生日期" prop="birthday">
						<snowy-calendar v-model="formData.birthday" placeholder="请选择出生日期"></snowy-calendar>
					</uv-form-item>
					<uv-form-item label="选择组织" prop="orgId" required>
						<!-- 多选属性:isMultiple="true" -->
						<snowy-org-picker v-model="formData.orgId" placeholder="请选择组织" @confirm="orgChange" :org-tree-api="selectorApiFunction.orgTreeApi">
						</snowy-org-picker>
					</uv-form-item>
					<uv-form-item label="选择职位" prop="positionId" required>
						<snowy-sel-picker :map="{key: 'id', label: 'name'}" v-model="formData.positionId" :rangeData="positionData" placeholder="请选择选择职位" :isBigData="true" @queryCurSelData="positionQueryCurSelData" @scrollToLower="positionScrollToLower"></snowy-sel-picker>
					</uv-form-item>
					<uv-form-item label="选择主管" prop="directorId">
						<!-- 多选属性:isMultiple="true" ref="directorRef" :autoInitData="false" -->
						<snowy-user-picker v-model="formData.directorId" placeholder="请选择主管" :org-tree-api="selectorApiFunction.orgTreeApi" :user-page-api="selectorApiFunction.userPageApi" :checked-user-list-api="selectorApiFunction.checkedUserListApi">
						</snowy-user-picker>
					</uv-form-item>
					<uv-form-item label="员工编号" prop="empNo">
						<uv-input v-model="formData.empNo" placeholder="请输入员工编号"></uv-input>
					</uv-form-item>
					<uv-form-item label="职位级别" prop="positionLevel">
						<uv-input v-model="formData.positionLevel" placeholder="请输入职位级别"></uv-input>
					</uv-form-item>
					<uv-form-item label="入职日期" prop="entryDate">
						<snowy-calendar v-model="formData.entryDate" placeholder="请选择入职日期"></snowy-calendar>
					</uv-form-item>
					<!-- required :rules="[{ required: true, errorMessage: '请添加任职信息' }]" -->
					<uv-form-item label="任职信息" prop="positionJson">
						<formPosition v-model="formData.positionJson" ref="positionJsonRef"></formPosition>
					</uv-form-item>
				</view>
				<view v-show="curView === 1">
					<uv-form-item label="民族" prop="nation">
						<!-- :isMultiple="true" -->
						<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.nation" :rangeData="nationOptions" placeholder="请选择民族"></snowy-sel-picker>
					</uv-form-item>
					<uv-form-item label="籍贯" prop="nativePlace">
						<uv-input v-model="formData.nativePlace" placeholder="请输入籍贯"></uv-input>
					</uv-form-item>
					<uv-form-item label="家庭住址" prop="homeAddress">
						<uv-textarea v-model="formData.homeAddress" placeholder="请输入家庭住址"></uv-textarea>
					</uv-form-item>
					<uv-form-item label="通信地址" prop="mailingAddress">
						<uv-textarea v-model="formData.mailingAddress" placeholder="请输入通信地址">
						</uv-textarea>
					</uv-form-item>
					<uv-form-item label="证件类型" prop="idCardType">
						<!-- :isMultiple="true" -->
						<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.idCardType" :rangeData="idcardTypeOptions" placeholder="请选择证件类型"></snowy-sel-picker>
					</uv-form-item>
					<uv-form-item label="证件号码" prop="idCardNumber">
						<uv-input v-model="formData.idCardNumber" placeholder="请输入证件号码"></uv-input>
					</uv-form-item>
					<uv-form-item label="文化程度" prop="cultureLevel">
						<!-- :isMultiple="true" -->
						<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.cultureLevel" :rangeData="cultureLevelOptions" placeholder="请选择文化程度"></snowy-sel-picker>
					</uv-form-item>
					<uv-form-item label="政治面貌" prop="politicalOutlook">
						<uv-input v-model="formData.politicalOutlook" placeholder="请输入政治面貌"></uv-input>
					</uv-form-item>
					<uv-form-item label="毕业学校" prop="college">
						<uv-input v-model="formData.college" placeholder="请输入毕业学校"></uv-input>
					</uv-form-item>
					<uv-form-item label="学历" prop="education">
						<uv-input v-model="formData.education" placeholder="请输入学历"></uv-input>
					</uv-form-item>
					<uv-form-item label="学制" prop="eduLength">
						<uv-input v-model="formData.eduLength" placeholder="请输入学制"></uv-input>
					</uv-form-item>
					<uv-form-item label="学位" prop="degree">
						<uv-input v-model="formData.degree" placeholder="请输入学位"></uv-input>
					</uv-form-item>
					<uv-form-item label="家庭电话" prop="homeTel">
						<uv-input v-model="formData.homeTel" placeholder="请输入家庭电话"></uv-input>
					</uv-form-item>
					<uv-form-item label="办公电话" prop="officeTel">
						<uv-input v-model="formData.officeTel" placeholder="请输入办公电话"></uv-input>
					</uv-form-item>
					<uv-form-item label="紧急联系人" prop="emergencyContact">
						<uv-input v-model="formData.emergencyContact" placeholder="请输入紧急联系人"></uv-input>
					</uv-form-item>
					<uv-form-item label="紧急联系电话" prop="emergencyPhone">
						<uv-input v-model="formData.emergencyPhone" placeholder="请输入紧急联系电话"></uv-input>
					</uv-form-item>
					<uv-form-item label="紧急联系人地址" prop="emergencyAddress">
						<uv-textarea v-model="formData.emergencyAddress" placeholder="请输入紧急联系人地址">
						</uv-textarea>
					</uv-form-item>
				</view>
			</uv-form>
			<tui-button margin="50rpx 0" :preventClick="true" :shadow="true" @click="submit">提交</tui-button>
		</view>
	</view>
</template>
<script setup>
	import { nextTick, reactive, ref } from "vue"
	import tool from '@/plugins/tool.js'
	import { userDetail, userPositionSelector, submitForm, userSelector, userOrgTreeSelector } from '@/api/biz/bizUserApi'
	import { getPositionListByIdList, userCenterGetUserListByIdList } from '@/api/sys/userCenterApi'
	import formPosition from '@/pages/biz/user/form-position.vue'
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	import XEUtils from "xe-utils"
	const curView = ref(0)
	const formRef = ref()
	// 表单数据
	const formData = ref({
		account: '',
		name: '',
		gender: '',
		nickname: '',
		phone: '',
		email: '',
		birthday: '',
		orgId: '',
		positionId: '',
		directorId: '',
		empNo: '',
		positionLevel: '',
		entryDate: '',
		positionJson: '',
		nation: '',
		nativePlace: '',
		homeAddress: '',
		mailingAddress: '',
		idCardType: '',
		idCardNumber: '',
		cultureLevel: '',
		politicalOutlook: '',
		college: '',
		education: '',
		eduLength: '',
		degree: '',
		homeTel: '',
		officeTel: '',
		emergencyContact: '',
		emergencyPhone: '',
		emergencyAddress: ''
	})
	// 常用正则规则大全：https://any86.github.io/any-rule/
	const rules = reactive({
		account: [{
			type: 'string',
			required: true,
			message: '请输入账号',
			trigger: ['blur', 'change']
		}],
		name: [{
			type: 'string',
			required: true,
			message: '请输入姓名',
			trigger: ['blur', 'change']
		}],
		phone: [{
			pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
			message: '请填写符合要求的11位手机号',
			trigger: ['blur', 'change']
		}],
		email: [{
			pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
			message: '请填写正确的邮箱号',
			trigger: ['blur', 'change']
		}],
		orgId: [{
			type: 'string',
			required: true,
			message: '选择组织',
			trigger: ['blur', 'change']
		}],
		positionId: [{
			type: 'string',
			required: true,
			message: '选择职位',
			trigger: ['blur', 'change']
		}],
	})
	// 性别
	const genderOptions = tool.dictList('GENDER')
	// 职位
	const positionData = ref([])
	// 民族
	const nationOptions = tool.dictList('NATION')
	// 身份证件
	const idcardTypeOptions = tool.dictList('IDCARD_TYPE')
	// 文化程度
	const cultureLevelOptions = tool.dictList('CULTURE_LEVEL')
	// 职位
	const positionJsonRef = ref()
	// const directorRef = ref()
	// 传递用户选择器需要的API
	const selectorApiFunction = {
		orgTreeApi: (param) => {
			return userOrgTreeSelector(param).then((res) => {
				return Promise.resolve(res)
			})
		},
		userPageApi: (param) => {
			return userSelector(param).then((res) => {
				return Promise.resolve(res)
			})
		},
		checkedUserListApi: (param) => {
			return userCenterGetUserListByIdList(param).then((res) => {
				return Promise.resolve(res)
			})
		}
	}
	// 职位参数
	const positionParam = reactive({
		current: 1,
		size: 10
	})
	// 职位分页加载
	const loadPositionSelector = (isReset) => {
		if (isReset) {
			positionParam.current = 1
			positionData.value = []
		}
		userPositionSelector(positionParam).then(res => {
			if (XEUtils.isEmpty(res?.data?.records)) {
				return
			}
			positionData.value = positionData.value.concat(res.data.records)
			positionParam.current++
		})
	}
	// 加載
	onLoad((option) => {
		if (!option.id) {
			return
		}
		userDetail({
			id: option.id
		}).then(res => {
			formData.value = res?.data
			// 職位
			if (!formData.value.orgId) {
				return
			}
			positionParam.orgId = formData.value.orgId
			loadPositionSelector(true)
			// directorRef.value.loadUserData(true, {orgId: formData.value.orgId})
		})
	})
	// 机构
	const orgChange = ({
		curSelOrgId,
		curSelOrg
	}) => {
		formData.value.positionId = null
		positionParam.orgId = curSelOrgId
		loadPositionSelector(true)
		// directorRef.value.loadOrgTree()
		// formData.value.directorId = null
		// directorRef.value.loadUserData(true, {orgId: curSelOrgId})
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
	// 职位下拉触发
	const positionScrollToLower = () => {
		loadPositionSelector()
	}
	const submit = () => {
		// 子表单数据给父表单数据赋值，并校验子表单数据
		positionJsonRef.value.formListEmitAndValidate().then(result => {
			// 父表单校验
			formRef.value.validate().then(res => {
				submitForm(formData.value, !formData.value.id).then(respond => {
					uni.$emit('formBack', {
						data: respond.data
					})
					uni.navigateBack({
						delta: 1
					})
				})
			}).catch(err => {
				console.error('父表单错误信息：', err);
			})
		}).catch(err => {
			console.error('子表单错误信息：', err);
		})
	}
</script>
<style lang="scss" scoped>
	.container {
		margin: 80rpx 0 0;
		padding: 30rpx;
	}
</style>