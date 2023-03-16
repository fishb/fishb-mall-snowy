<template>
	<view class="snowy-org-picker">
		<view class="input" @click="handleInput">
			<view class="input-value" :class="{ 'input-value-border': props.border }">
				<!-- 单选 -->
				<view v-if="!isMultiple && curSelOrgId && curSelOrgId !== ''">
					{{ curSelOrg.name }}
				</view>
				<!-- 多选 -->
				<view class="multiple" v-else-if="!!isMultiple && curSelOrgId && curSelOrgId.length > 0"
					v-for="(item, key, index) in curSelOrg" :key="index">
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

			<!-- 面包屑 -->
			<view class="crumb">
				<text v-for="(item, index) in allClickSelOrg" :key="index" @click="clickOrgCru(item, index)"
					:class="index === (allClickSelOrg.length-1) ? 'uni-secondary-color' : 'uni-primary'">
					{{ item.name + (index === (allClickSelOrg.length-1) ? '' : ' | ') }}
				</text>
			</view>
			<!-- 已选择 -->
			<view class="choiced" v-show="!!curSelOrgId && (!isMultiple? true : curSelOrgId.length > 0)"
				:style="{maxHeight:!isMultiple?'5vh':'20vh', overflowY: 'scroll'}">
				<!-- 单选已选择 -->
				<view class="single" v-if="!isMultiple">
					<view class="name" @click="delOrg(curSelOrg)">
						{{ curSelOrg.name }}
					</view>
					<uni-icons type="trash-filled" @click="delOrg(curSelOrg)" color="#e43d33" size="20"></uni-icons>
				</view>
				<!-- 多选已选择 -->
				<view class="multiple" v-if="!!isMultiple" v-for="(item, index) in curSelOrg">
					<view class="name" @click="delOrg(item)">
						{{ item.name }}
					</view>
					<uni-icons type="trash-filled" @click="delOrg(item)" color="#e43d33" size="20"></uni-icons>
				</view>
			</view>
			<!-- 部门 -->
			<view class="org">
				<uni-list>
					<uni-list-item v-for="(item, index) in curClickSelOrg" :key="index">
						<!-- 选择icon -->
						<template v-slot:header>
							<view>
								<uni-icons
									v-show="!isMultiple ? item.id != curSelOrgId: curSelOrgId.indexOf(item.id) == -1"
									type="circle" :size="25" @click="selOrg(item, index)"></uni-icons>
								<uni-icons
									v-show="!isMultiple ? item.id == curSelOrgId: curSelOrgId.indexOf(item.id) != -1"
									type="checkbox-filled" :size="25" color="#2979ff" @click="delOrg(item, index)">
								</uni-icons>
							</view>
						</template>
						<!-- 名称 -->
						<template v-slot:body>
							<text class="name" @click="clickOrg(item, index)">{{ item.name }}</text>
						</template>
						<!-- 右侧icon -->
						<template v-slot:footer>
							<uni-icons type="right" @click="clickOrg(item, index)" v-if="item.children? true : false">
							</uni-icons>
						</template>
					</uni-list-item>
				</uni-list>
			</view>

		</uni-popup>
	</view>
</template>

<script setup>
	import {
		orgTree
	} from '@/api/biz/bizOrgApi'

	import {
		reactive,
		ref,
		getCurrentInstance,
		watch,
		inject
	} from "vue";
	import XEUtils from 'xe-utils'

	const emits = defineEmits(['update:modelValue', 'cancel', 'confirm'])

	const props = defineProps({
		// value: [String, Array],
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
			default: "请选择机构",
			required: false
		},
		isTopLevel: {
			type: Boolean,
			default: false,
			required: false
		}
	})
	// 数据类型校验
	// if (props.value) {
	// 	if (!props.isMultiple && typeof props.value !== "string") {
	// 		console.error("单选所传value值应为字符串")
	// 	}
	// 	if (!!props.isMultiple && !Array.isArray(props.value)) {
	// 		console.error("多选所传value值应为数组")
	// 	}
	// }
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

	// 当前选中的机构id及机构
	let curSelOrgId = !props.isMultiple ? ref("") : ref([])
	let curSelOrg = !props.isMultiple ? ref({}) : ref([])

	// 所有点击选中机构【页面数据】
	let allClickSelOrg = ref([])
	// 当前点击选中机构【页面数据】
	let curClickSelOrg = ref([])

	// 监听函数
	// watch(() => props.value, (newValue, oldValue) => {
	// 	curSelOrgId.value = newValue
	// }, {
	// 	deep: false,
	// 	immediate: false
	// })
	watch(() => props.modelValue, (newValue, oldValue) => {
		// curSelOrgId.value = XEUtils.clone(newValue, true)
		loadData()
	}, {
		deep: false,
		immediate: false
	})

	const loadData = () => {
		orgTree().then(res => {
			if (props.isTopLevel) {
				// 含有顶级
				curClickSelOrg.value = [{
					id: '0',
					parentId: '-1',
					name: '顶级',
					children: res.data
				}]
				allClickSelOrg.value = [{
					id: '-1',
					name: '全部',
					children: [{
						id: '0',
						parentId: '-1',
						name: '顶级',
						children: res.data
					}]
				}]
			} else {
				// 不含有顶级
				curClickSelOrg.value = res.data
				allClickSelOrg.value = [{
					id: '0',
					parentId: '-1',
					name: '全部',
					children: res.data
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

	// 初始化数据
	loadData()


	// 点击输入框
	const handleInput = () => {
		// 重新初始化数据，防止数据更新
		loadData()
		popupRef.value.open('bottom')
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
		loadData()
		popupRef.value.close()
	}

	const confirm = () => {
		// 更新数据
		emits('update:modelValue', curSelOrgId.value)
		// 调用父组件方法
		emits('confirm', {
			curSelOrgId: curSelOrgId.value,
			curSelOrg: curSelOrg.value
		})
		popupRef.value.close()
	}
</script>

<style lang="scss">
	.snowy-org-picker {
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

			.org {
				width: 100vw;
				height: 40vh;
				overflow-y: scroll;

				.name {
					flex: 1;
					font-size: 30upx;
					margin: 2upx 20upx;
				}
			}
		}
	}
</style>
