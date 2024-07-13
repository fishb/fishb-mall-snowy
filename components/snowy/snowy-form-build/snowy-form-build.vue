<template>
	<uni-forms ref="dyFormRef" :model="formData" label-position="top" labelWidth="auto" validate-trigger="submit">
		<snowy-form-item v-for="(formField, formFieldIndex) in formFields" :ref="`form-item-ref-${ formFieldIndex }`" :key="`form-item-key${formFieldIndex}`" :index="`form-item-key${formFieldIndex}`" :formField="formField" :formData="formData" :useDefault="useDefault" />
	</uni-forms>
</template>
<script setup>
	import { nextTick, reactive, ref, watch, getCurrentInstance } from "vue"
	const { proxy } = getCurrentInstance()
	const props = defineProps({
		formData: {
			type: Object,
			default: {},
			required: false
		},
		formFields: {
			type: Array,
			default: [],
			required: true
		},
		useDefault: {
			type: Boolean,
			default: false,
			required: false
		}
	})
	const dyFormRef = ref()
	const formListEmitAndValidate = () => {
		const promiseList = []
		props.formFields.forEach((item, index) => {
			if (item.type === 'batch') {
				promiseList.push(new Promise((resolve, reject) => {
					// 验证多个batch字段
					proxy.$refs[`form-item-ref-${ index }`][0].formListValidate().then(result => {
						resolve(result)
					}).catch(err => {
						reject(err)
					})
				}))
			}
		})
		return new Promise((resolve, reject) => {
			Promise.all(promiseList).then((result) => {
				dyFormRef.value.validate().then(res => {
					resolve(props.formData)
				})
			}).catch(err => {
				reject(err)
			})
		})
	}
	defineExpose({
		formListEmitAndValidate
	})
</script>
<style lang="scss">
</style>