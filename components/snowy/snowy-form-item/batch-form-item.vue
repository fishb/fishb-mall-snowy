<template>
	<snowy-form-item :formField="batchFormField" :formData="batchFormData" :formFieldDisable="formFieldDisable" :useDefault="useDefault" />
</template>
<script setup>
	import { nextTick, reactive, ref, watch, getCurrentInstance } from "vue"
	const { proxy } = getCurrentInstance()
	const props = defineProps({
		batchFormField: {
			type: Object,
			required: true
		},
		batchFormData: {
			type: Object,
			required: true
		},
		formFieldDisable: {
			type: Boolean,
			default: null,
			required: false
		},
		useDefault: {
			type: Boolean,
			default: false,
			required: false
		}
	})
</script>
<style lang="scss">
</style>