<template>
	<view>
		<uni-forms-item
			v-if="formField && formField.type && ['input','textarea','number',].includes(formField.type) && (typeof(formField.options.hidden) === 'boolean' ? !formField.options.hidden : true)"
			:label="formField.label"
			:name="formField.name" 
			:required="formField.required" 
			:rules="formField.rules">
			<uni-easyinput
				:disabled="typeof(formFieldDisable) === 'boolean' ? formFieldDisable : typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false"
				:type="formField.type"
				v-model="formData[formField.name]"
				:placeholder="formField.options.placeholder" />
		</uni-forms-item>
		
		<uni-forms-item
			v-if="formField && formField.type && ['radio','checkbox',].includes(formField.type) && (typeof(formField.options.hidden) === 'boolean' ? !formField.options.hidden : true)"
			:label="formField.label"
			:name="formField.name" 
			:required="formField.required" 
			:rules="formField.rules">
			<uni-data-checkbox
				:disabled="typeof(formFieldDisable) === 'boolean' ? formFieldDisable : typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false"
				v-model="formData[formField.name]"
				:multiple="formField.options.isMultiple"
				:map="formField.options.map"
				:localdata="formField.options.options" />
		</uni-forms-item>
		
		<uni-forms-item
			v-if="formField && formField.type && ['select',].includes(formField.type) && (typeof(formField.options.hidden) === 'boolean' ? !formField.options.hidden : true)"
			:label="formField.label"
			:name="formField.name" 
			:required="formField.required" 
			:rules="formField.rules">
			<snowy-sel-picker
				:disabled="typeof(formFieldDisable) === 'boolean' ? formFieldDisable : typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false"
				v-model="formData[formField.name]"
				:isMultiple = "formField.options.isMultiple"
				:map="formField.options.map"
				@getOptData="(param, callback) => callback({ state: CallbackState.SUCCESS, data: formField.options.options })" />
		</uni-forms-item>
		
		<uni-forms-item
			v-if="formField && formField.type && ['date'].includes(formField.type) && (typeof(formField.options.hidden) === 'boolean' ? !formField.options.hidden : true)"
			:label="formField.label"
			:name="formField.name" 
			:required="formField.required" 
			:rules="formField.rules">
			<uni-datetime-picker
				:disabled="typeof(formFieldDisable) === 'boolean' ? formFieldDisable : typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false"
				v-model="formData[formField.name]"
				:type="getDatetimePickerType(formField.options.range, formField.options.showTime)"
				:placeholder="formField.options.placeholder"
				:start-placeholder="formField.options.rangePlaceholder?formField.options.rangePlaceholder[0]:null"
				:end-placeholder="formField.options.rangePlaceholder?formField.options.rangePlaceholder[1]:null"
				 return-type="string"
				:clear-icon="formField.options.clearable">
			</uni-datetime-picker>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="formField && formField.type && ['time',].includes(formField.type) && (typeof(formField.options.hidden) === 'boolean' ? !formField.options.hidden : true)"
			:label="formField.label"
			:name="formField.name" 
			:required="formField.required" 
			:rules="formField.rules">
			<view style="flex: 1;">
				<!-- start="09:01" end="21:01" -->
				<picker 
					:disabled="typeof(formFieldDisable) === 'boolean' ? formFieldDisable : typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false" 
					mode="time"
					:value="formData[formField.name]" 
					@change="(e)=>{formData[formField.name] = e.detail.value}">
					<view class="uni-input input-value-border">{{formData[formField.name]?formData[formField.name]:formField.options.placeholder}}</view>
				</picker>
			</view>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="formField && formField.type && ['rate',].includes(formField.type) && (typeof(formField.options.hidden) === 'boolean' ? !formField.options.hidden : true)"
			:label="formField.label"
			:name="formField.name" 
			:required="formField.required" 
			:rules="formField.rules">
			<uni-rate
				:disabled="typeof(formFieldDisable) === 'boolean' ? formFieldDisable : typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false"
				v-model="formData[formField.name]"/>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="formField && formField.type && ['slider',].includes(formField.type) && (typeof(formField.options.hidden) === 'boolean' ? !formField.options.hidden : true)"
			:label="formField.label"
			:name="formField.name" 
			:required="formField.required" 
			:rules="formField.rules">
			<slider
				:disabled="typeof(formFieldDisable) === 'boolean' ? formFieldDisable : typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false"
				:min="formField.options.min"
				:max="formField.options.max"
				:value="formData[formField.name]"
				:step="formField.options.step"
				@change="(e)=>{formData[formField.name] = e.detail.value}"
				show-value/>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="formField && formField.type && ['switch',].includes(formField.type) && (typeof(formField.options.hidden) === 'boolean' ? !formField.options.hidden : true)"
			:label="formField.label"
			:name="formField.name" 
			:required="formField.required" 
			:rules="formField.rules">
			<switch
				:disabled="typeof(formFieldDisable) === 'boolean' ? formFieldDisable : typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false"
				:checked = "formData[formField.name]"
				@change="(e)=>{formData[formField.name] = e.detail.value}" />
		</uni-forms-item>
		
		<uni-forms-item
			v-if="formField && formField.type && ['uploadFile',].includes(formField.type) && (typeof(formField.options.hidden) === 'boolean' ? !formField.options.hidden : true)"
			:label="formField.label"
			:name="formField.name" 
			:required="formField.required" 
			:rules="formField.rules">
			<snowy-file-picker-api 
				:disabled="typeof(formFieldDisable) === 'boolean' ? formFieldDisable : typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false" 
				idDataType="objArr"
				v-model="formData[formField.name]">
			</snowy-file-picker-api>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="formField && formField.type && ['userSelector',].includes(formField.type) && (typeof(formField.options.hidden) === 'boolean' ? !formField.options.hidden : true)"
			:label="formField.label"
			:name="formField.name" 
			:required="formField.required" 
			:rules="formField.rules">
			<snowy-user-picker
				:disabled="typeof(formFieldDisable) === 'boolean' ? formFieldDisable : typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false"
				v-model="formData[formField.name]"
				:isMultiple = "formField.options.isMultiple"
				:placeholder="formField.options.placeholder"
				:map="{key: 'id', label: 'name'}"
				@getOptData="selectorFunction.user.getOptData"
				:isPage="true"
				@getSelData="selectorFunction.user.getSelData">
			</snowy-user-picker>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="formField && formField.type && ['editor',].includes(formField.type) && (typeof(formField.options.hidden) === 'boolean' ? !formField.options.hidden : true)"
			:label="formField.label"
			:name="formField.name" 
			:required="formField.required" 
			:rules="formField.rules">
			<editor 
				:placeholder="formField.options.placeholder"></editor>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="formField && formField.type && ['batch',].includes(formField.type) && (typeof(formField.options.hidden) === 'boolean' ? !formField.options.hidden : true)"
			:label="formField.label"
			:name="formField.name" 
			:required="formField.required" 
			>
			
			<view v-for="(item, index) in formData[formField.name]" :key="`v-${ index }`" :index="`v-${ index }`">
				<button class="uni-btn" type="warn" :plain="true" v-if ="typeof(formField.options.disabled) === 'boolean' ? !formField.options.disabled : true" @click="()=>{formData[formField.name].splice(index, 1);}">
					删除{{ formField.label }}
				</button>
				<uni-forms :ref="`batch-form-ref-${ formField.name }-${ index }`" :model="item" label-position="top" labelWidth="auto" validate-trigger="submit">
					<!-- #ifndef MP-WEIXIN -->
					<snowy-form-item v-for="(fItem, fIndex) in formField.list" :key="`sfi-${ fIndex }`" :index="`sfi-${ fIndex }`" :formField="fItem" :formData="item" :formFieldDisable="typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false" :useDefault="useDefault"/>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<!-- 适配小程序 -->
					<batch-form-item v-for="(fItem, fIndex) in formField.list" :key="`sfi-${ fIndex }`" :index="`sfi-${ fIndex }`" :batchFormField="fItem" :batchFormData="item" :formFieldDisable="typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false" :useDefault="useDefault"></batch-form-item>
					<!-- #endif -->	
				</uni-forms>
			</view>
			<button class="uni-btn" type="primary" :disabled ="typeof(formField.options.disabled) === 'boolean' ? formField.options.disabled : false" @click="()=>{
				if(!formData[formField.name]){
					formData[formField.name] = []
				}
				formData[formField.name].push({})
				// formData[formField.name].unshift({})
			}">
				增加{{ formField.label }}
			</button>
		</uni-forms-item>
	</view>
</template>
<script>
	export default {
		name: 'SnowyFormItem'
	}
</script>
<script setup>
	import BatchFormItem from './batch-form-item.vue'
	import { nextTick, reactive, ref, watch, getCurrentInstance } from "vue"
	import processApi from '@/api/flw/process-api'
	import userCenterApi from '@/api/sys/user-center-api'
	import CallbackState from "@/enum/callback-state"
	
	const { proxy } = getCurrentInstance()
	const props = defineProps({
		formField: {
			type: Object,
			required: true
		},
		formFieldDisable:{
			type: Boolean,
			default: null,
			required:false
		},
		formData: {
			type: Object,
			required: true
		},
		useDefault: {
			type: Boolean,
			default: false,
			required: false
		}
	})
	
	
	if(props.useDefault){
		// 默认值处理
		if(['input','textarea','number',].includes(props.formField.type)){
			props.formData[props.formField.name] = props.formField.options.defaultValue
		}else if(['radio','checkbox',].includes(props.formField.type)){
			props.formData[props.formField.name] = props.formField.options.defaultValue
		}else if(['select',].includes(props.formField.type)){
			if(props.formField.options.isMultiple){
				props.formData[props.formField.name] = [props.formField.options.defaultValue]
			}else{
				props.formData[props.formField.name] = props.formField.options.defaultValue
			}
		}else if(['date',].includes(props.formField.type)){
			if(props.formField.options.range){
				props.formData[props.formField.name] = props.formField.options.rangeDefaultValue
			}else{
				props.formData[props.formField.name] = props.formField.options.defaultValue
			}
		}else if(['time',].includes(props.formField.type)){
			props.formData[props.formField.name] = props.formField.options.defaultValue
		}else if(['rate',].includes(props.formField.type)){
			props.formData[props.formField.name] = props.formField.options.defaultValue
		}else if(['slider',].includes(props.formField.type)){
			props.formData[props.formField.name] = props.formField.options.defaultValue
		}else if(['switch',].includes(props.formField.type)){
			props.formData[props.formField.name] = props.formField.options.defaultValue
		}
	}
	
	
	// 获取日期时间字段的类型
	const getDatetimePickerType = (range, showTime) => {
		if(range){
			if(showTime){
				return 'datetimerange'
			}else{
				return 'daterange'
			}
		}else{
			if(showTime){
				return 'datetime'
			}else{
				return 'date'
			}
		}
	}
	
	// 传递用户选择器需要的API
	const selectorFunction = {
		// 用户
		user: {
			getOptData: async ({ pageNo, pageSize, keyword }, callback) => {
				const parameter = { current: pageNo, size: pageSize, searchKey: keyword }
				const data = await processApi.processUserSelector(parameter)
				callback({ state: CallbackState.SUCCESS, data: data?.records })
			},
			getSelData: async (curSelDataKey, callback) => {
				if (uni.$snowy.tool.isNotEmpty(curSelDataKey)) {
					if(!props.formField.options.isMultiple){
						const data = await userCenterApi.userCenterGetUserListByIdList({
							idList: [curSelDataKey]
						})
						callback({ state: CallbackState.SUCCESS, data: data[0] })
						return
					}
					if(!!props.formField.options.isMultiple){
						const data = await userCenterApi.userCenterGetUserListByIdList({
							idList: curSelDataKey
						})
						callback({ state: CallbackState.SUCCESS, data: data })
						return
					}
					
				}
			}
		},
	}
	
	// 表单校验
	const formListValidate = () => {
		if(props.formField.type === 'batch'){
			const promiseList = []
			if(props.formData[props.formField.name]){
				props.formData[props.formField.name].forEach((item, index)=>{
					promiseList.push(new Promise((resolve, reject) => {
						proxy.$refs[`batch-form-ref-${ props.formField.name }-${ index }`][0].validate().then(result => {
							resolve(result)
						}).catch(err => {
							reject(err)
						})
					}))
				})
			}
			return new Promise((resolve, reject) => {
				Promise.all(promiseList).then((result) => {
					resolve(result)
				}).catch(err=>{
					reject(err)
				})
			})
		}
	}
	defineExpose({
		formListValidate
	})
</script>

<style lang="scss">
	.uni-input {
		height: 50rpx;
		padding: 15rpx 25rpx;
		line-height:50rpx;
		font-size:28rpx;
		background:#FFF;
		flex: 1;
	}
	.input-value-border {
		border: 1px solid $uni-border-2;
		border-radius: 5upx;
	}
</style>
