<template>
	<view class="tui-upload__container">
		<view class="tui-upload-box">
			<view class="tui-image-item" :style="{width:width+'rpx',height:height+'rpx',borderRadius:radius+'rpx'}" v-for="(item,index) in imageList" :key="index">
				<image class="item-img" :style="{width:width+'rpx',height:height+'rpx',borderRadius:radius+'rpx'}" :src="getImgSrc(item)" mode="aspectFill" @click.stop="openFile(item)"></image>
				<view v-if="!forbidDel" class="tui-img-del" :style="{background:getDelColor}" @tap.stop="delImage(index)">
				</view>
				<view v-if="statusArr[index]!=1" class="tui-upload-mask">
					<view class="tui-upload-loading" v-if="statusArr[index]==2"></view>
					<text class="tui-tips">{{statusArr[index]==2?'上传中...':'上传失败'}}</text>
					<view class="tui-mask-btn" v-if="statusArr[index]==3" @tap.stop="reUpLoad(index)" hover-class="tui-btn-hover" :hover-stay-time="150">重新上传</view>
				</view>
			</view>
			<view v-if="isShowAdd" class="tui-upload-add" :class="[borderColor!=='transparent'?'tui-upload__border':'tui-upload__unborder']" :style="{width:width+'rpx',height:height+'rpx',background:background,borderRadius:radius+'rpx',borderColor:borderColor,borderStyle:borderSytle}" @tap="chooseImage">
				<slot>
					<view class="tui-upload-icon tui-icon-plus" :style="{color:addColor,fontSize:addSize+'rpx'}"></view>
				</slot>
			</view>
		</view>
	</view>
</template>
<script setup>
	import { fileUploadDynamicReturnId, fileUploadReturnId, fileUploadAliyunReturnId, fileUploadTencentReturnId, fileDelete, fileDetail, fileDownload } from '@/api/dev/fileApi.js'
	import { ref, watch, computed } from "vue";
	import { prefixUrl } from "@/utils/apiAdaptive"
	import store from '@/store'
	import XEUtils from 'xe-utils'
	import { toast } from './utils'
	const emits = defineEmits(['update:modelValue', 'validateField'])
	const props = defineProps({
		modelValue: [String, Array],
		uploadType: {
			type: String,
			default: 'Dynamic' // Dynamic || Local || Aliyun || Tencent
		},
		paramAndReturnType: {
			type: String,
			default: 'idStr' // jsonStr || idStr(示例：'1693233360352231425,1693233646705754113') || urlStr || idArr || urlArr || objArr
		},
		map: {
			type: Object,
			default: {
				id: "id",
				name: "name",
				url: "url",
				ext: "ext"
			},
			required: false
		},
		//展示图片宽度
		width: {
			type: [Number, String],
			default: 200
		},
		//展示图片高度
		height: {
			type: [Number, String],
			default: 200
		},
		radius: {
			type: [Number, String],
			default: 0
		},
		background: {
			type: String,
			default: '#F7F7F7'
		},
		borderColor: {
			type: String,
			default: 'transparent'
		},
		//solid、dashed、dotted
		borderSytle: {
			type: String,
			default: 'dashed'
		},
		//2.3.0+
		delColor: {
			type: String,
			default: ''
		},
		//删除图片前是否弹框确认
		delConfirm: {
			type: Boolean,
			default: false
		},
		//禁用删除
		forbidDel: {
			type: Boolean,
			default: false
		},
		//2.3.0+
		addColor: {
			type: String,
			default: '#888'
		},
		//2.3.0+
		addSize: {
			type: [Number, String],
			default: 68
		},
		//禁用添加
		forbidAdd: {
			type: Boolean,
			default: false
		},
		//限制数
		limit: {
			type: Number,
			default: 9
		},
		//original 原图，compressed 压缩图，默认二者都有
		sizeType: {
			type: Array,
			default () {
				return ['original', 'compressed']
			}
		},
		//album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
		sourceType: {
			type: Array,
			default () {
				return ['album', 'camera']
			}
		},
		//可上传图片类型，默认为空，不限制  Array<String> ['jpg','png','gif']
		imageFormat: {
			type: Array,
			default () {
				return []
			}
		},
		//单张图片大小限制 MB
		size: {
			type: Number,
			default: 4
		},
	})
	//图片地址
	const imageList = ref([])
	//上传状态：1-上传成功 2-上传中 3-上传失败
	const statusArr = ref([])
	const isShowAdd = computed(() => {
		let isShow = true;
		if (props.forbidAdd || (props.limit && imageList.value.length >= props.limit)) {
			isShow = false;
		}
		return isShow
	})
	const getDelColor = computed(() => {
		return props.delColor || (uni && uni.$tui && uni.$tui.color.danger) || '#EB0909';
	})
	/**
	 * 根据modelValue获取id数组
	 */
	const getIdArr = () => {
		let idArr = []
		if (XEUtils.isEmpty(props.modelValue)) {
			return idArr
		}
		if (XEUtils.isString(props.modelValue)) {
			if ('jsonStr' === props.paramAndReturnType) {
				JSON.parse(props.modelValue).forEach(item => {
					idArr.push(item[props.map.id])
				})
			} else {
				props.modelValue.split(",").forEach(item => {
					if ('idStr' === props.paramAndReturnType) {
						idArr.push(item)
					}
					if ('urlStr' === props.paramAndReturnType) {
						idArr.push(XEUtils.parseUrl(item[props.map.url])?.searchQuery?.id)
					}
				})
			}
		}
		if (XEUtils.isArray(props.modelValue)) {
			props.modelValue.forEach(item => {
				if ('idArr' === props.paramAndReturnType) {
					idArr.push(item)
				}
				if ('urlArr' === props.paramAndReturnType) {
					idArr.push(XEUtils.parseUrl(item[props.map.url])?.searchQuery?.id)
				}
				if ('objArr' === props.paramAndReturnType) {
					// 优先取url中的id
					idArr.push(XEUtils.parseUrl(item[props.map.url])?.searchQuery?.id || item[props.map.id])
				}
			})
		}
		return idArr
	}
	/**
	 * 加载初始化数据
	 */
	const loadData = () => {
		const idArr = getIdArr()
		const promiseList = []
		imageList.value = []
		for (let i = 0; i < idArr.length; i++) {
			promiseList.push(new Promise((resolve, reject) => {
				statusArr.value.push("2")
				fileDetail({ id: idArr[i] }).then(res => {
					// #ifndef APP-PLUS
					imageList.value.push({
						[props.map.id]: res.data.id,
						[props.map.name]: res.data.name,
						[props.map.url]: res.data.downloadPath || `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/dev/')}file/download?id=${res.data.id}`,
						[props.map.ext]: res.data.suffix,
					})
					statusArr.value[i] = "1"
					resolve()
					// #endif
					// #ifdef APP-PLUS
					fileDownload(res.data.id).then(response => {
						imageList.value.push({
							[props.map.id]: res.data.id,
							[props.map.name]: res.data.name,
							[props.map.url]: response.tempFilePath,
							[props.map.ext]: res.data.suffix,
						})
						statusArr.value[i] = "1"
						resolve()
					})
					// #endif
				}).catch((e) => {
					reject(e)
				})
			}))
		}
		Promise.all(promiseList).then(() => {}).catch(err => {
			console.log(err)
		})
	}
	// 控制modelValue watch方法是否执行
	const modelValueWatchIsAct = ref(true)
	watch(() => props.modelValue, (newValue, oldValue) => {
		if(modelValueWatchIsAct.value){
			loadData()
		}
		modelValueWatchIsAct.value = true
	}, {
		deep: false,
		immediate: true
	})
	// loadData()
	/**
	 * 获取预览图片路径
	 */
	const getImgSrc = (item) => {
		if (['png', 'jpg', 'jpng', 'ico', 'gif', 'image/png'].includes(item[props.map.ext])) {
			return item[props.map.url]
		}
		if (['doc'].includes(item[props.map.ext])) {
			return store.getters.allEnv[store.getters.envKey].baseUrl + prefixUrl('/images/') + 'fileImg/docx.png'
		}
		if (['xls'].includes(item[props.map.ext])) {
			return store.getters.allEnv[store.getters.envKey].baseUrl + prefixUrl('/images/') + 'fileImg/xlsx.png'
		}
		if (['zip'].includes(item[props.map.ext])) {
			return store.getters.allEnv[store.getters.envKey].baseUrl + prefixUrl('/images/') + 'fileImg/zip.png'
		}
		if (['rar'].includes(item[props.map.ext])) {
			return store.getters.allEnv[store.getters.envKey].baseUrl + prefixUrl('/images/') + 'fileImg/rar.png'
		}
		if (['ppt'].includes(item[props.map.ext])) {
			return store.getters.allEnv[store.getters.envKey].baseUrl + prefixUrl('/images/') + 'fileImg/ppt.png'
		}
		if (['txt'].includes(item[props.map.ext])) {
			return store.getters.allEnv[store.getters.envKey].baseUrl + prefixUrl('/images/') + 'fileImg/txt.png'
		}
		if (['html'].includes(item[props.map.ext])) {
			return store.getters.allEnv[store.getters.envKey].baseUrl + prefixUrl('/images/') + 'fileImg/html.png'
		}
		return store.getters.allEnv[store.getters.envKey].baseUrl + prefixUrl('/images/') + 'fileImg/file.png'
	}
	/**
	 * 打开文件
	 */
	const openFile = (item) => {
		if (['png', 'jpg', 'jpng', 'ico', 'gif', 'image/png'].includes(item?.ext)) {
			uni.previewImage({
				current: item[props.map.url],
				loop: true,
				urls: [item[props.map.url]]
			})
		} else {
			// #ifdef H5
			self.location.href = item[props.map.url]
			// #endif
			// #ifndef H5
			fileDownload(item[props.map.id]).then(response => {
				uni.openDocument({
					filePath: response.tempFilePath,
					success: () => {}
				});
			})
			// #endif
		}
	}
	/**
	 * 获取返回modelData
	 */
	const getModelData = () => {
		if (props.paramAndReturnType === 'objArr') {
			return imageList.value
		}
		if (props.paramAndReturnType === 'jsonStr') {
			return JSON.stringify(imageList.value)
		}
		let modelData = null
		const tempData = []
		if (props.paramAndReturnType === 'idStr' || props.paramAndReturnType === 'idArr') {
			imageList.value.forEach(image => {
				tempData.push(image[props.map.id])
			})
		}
		if (props.paramAndReturnType === 'urlStr' || props.paramAndReturnType === 'urlArr') {
			imageList.value.forEach(image => {
				tempData.push(image[props.map.url])
			})
		}
		if (props.paramAndReturnType === 'idArr' || props.paramAndReturnType === 'urlArr') {
			modelData = tempData
		}
		if (props.paramAndReturnType === 'idStr' || props.paramAndReturnType === 'urlStr') {
			modelData = tempData.join(',')
		}
		return modelData
	}
	/**
	 * 选择图片
	 */
	const chooseImage = () => {
		uni.chooseImage({
			count: props.limit - imageList.value.length,
			sizeType: props.sizeType,
			sourceType: props.sourceType,
			success: function(e) {
				const promiseList = []
				for (let i = 0; i < e.tempFiles.length; i++) {
					let len = imageList.value.length;
					if (len >= props.limit) {
						toast(`最多可上传${props.limit}张图片`);
						break;
					}
					//过滤图片类型
					let path = e.tempFiles[i].path;
					if (props.imageFormat.length > 0) {
						let format = ""
						// #ifdef H5
						let type = e.tempFiles[i].type;
						format = type.split('/')[1]
						// #endif
						// #ifndef H5
						format = path.split(".")[(path.split(".")).length - 1];
						// #endif
						if (props.imageFormat.indexOf(format) == -1) {
							let text = `只能上传 ${props.imageFormat.join(',')} 格式图片！`
							toast(text);
							continue;
						}
					}
					//过滤超出大小限制图片
					let size = e.tempFiles[i].size;
					if (props.size * 1024 * 1024 < size) {
						let err = `单张图片大小不能超过：${props.size}MB`
						toast(err);
						continue;
					}
					statusArr.value.push("2")
					promiseList.push(uploadImage(e.tempFiles[i].path, statusArr.value.length - 1))
				}
				Promise.all(promiseList).then((result) => {
					// 更新数据
					modelValueWatchIsAct.value = false
					emits('update:modelValue', getModelData())
					// 校验字段
					emits('validateField')
				}).catch(err => {
					console.log(err)
				})
			}
		})
	}
	/**
	 * 文件上传api
	 */
	const uploadApi = (param) => {
		return new Promise((resolve, reject) => {
			if ('Local' == props.uploadType) {
				fileUploadReturnId(param).then(res => {
					resolve(res)
				}).catch((e) => {
					reject(e)
				})
			} else if ('Aliyun' == props.uploadType) {
				fileUploadAliyunReturnId(param).then(res => {
					resolve(res)
				}).catch((e) => {
					reject(e)
				})
			} else if ('Tencent' == props.uploadType) {
				fileUploadTencentReturnId(param).then(res => {
					resolve(res)
				}).catch((e) => {
					reject(e)
				})
			} else {
				fileUploadDynamicReturnId(param).then(res => {
					resolve(res)
				}).catch((e) => {
					reject(e)
				})
			}
		})
	}
	/**
	 * 上传图片
	 */
	const uploadImage = (path, index) => {
		return new Promise((resolve, reject) => {
			uploadApi({ filePath: path }).then(res => {
				fileDetail({ id: res.data }).then(response => {
					const image = {
						[props.map.id]: response.data.id,
						[props.map.name]: response.data.name,
						[props.map.url]: response.data.downloadPath || `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/dev/')}file/download?id=${response.data.id}`,
						[props.map.ext]: response.data.suffix
					}
					imageList.value.push(image)
					statusArr.value[index] = "1"
					resolve(image)
				}).catch((err) => {
					const image = {
						itemTempFilePath: path
					}
					imageList.value.push(image)
					statusArr.value[index] = "3"
					reject(err)
				})
			}).catch((err) => {
				const image = {
					// 存储临时变量（用于重新上传使用）
					itemTempFilePath: path
				}
				imageList.value.push(image)
				statusArr.value[index] = "3"
				reject(err)
			})
		})
	}
	/**
	 * 重新上传
	 */
	const reUpLoad = (index) => {
		// 开始上传
		statusArr.value[index] = "2"
		uploadApi({ filePath: imageList.value[index].itemTempFilePath }).then(res => {
			fileDetail({ id: res.data }).then(response => {
				imageList.value[index] = {
					[props.map.id]: response.data.id,
					[props.map.name]: response.data.name,
					[props.map.url]: response.data.downloadPath || `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/dev/')}file/download?id=${response.data.id}`,
					[props.map.ext]: response.data.suffix
				}
				statusArr.value[index] = "1"
			}).catch((err) => {
				statusArr.value[index] = "3"
			})
		}).catch((err) => {
			statusArr.value[index] = "3"
		})
	}
	/**
	 * 删除图片
	 */
	const delImage = (index) => {
		if (props.delConfirm) {
			uni.showModal({
				title: '提示',
				content: '确认删除该图片吗？',
				showCancel: true,
				cancelColor: "#555",
				confirmColor: "#eb0909",
				confirmText: "确定",
				success(res) {
					if (res.confirm) {
						callFileDelApi(index)
					}
				}
			})
		} else {
			callFileDelApi(index)
		}
	}
	/**
	 * 调用文件删除api
	 */
	const callFileDelApi = (index) => {
		fileDelete([{ id: imageList.value[index][props.map.id] }]).then(res => {
			imageList.value.splice(index, 1)
			statusArr.value.splice(index, 1)
			// 更新数据
			emits('update:modelValue', getModelData())
			// 校验字段
			emits('validateField')
		})
	}
</script>
<style lang="scss" scoped>
	@font-face {
		font-family: 'tuiUpload';
		src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAATcAA0AAAAAByQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEwAAAABoAAAAciR52BUdERUYAAASgAAAAHgAAAB4AKQALT1MvMgAAAaAAAABCAAAAVjxvR/tjbWFwAAAB+AAAAEUAAAFK5ibpuGdhc3AAAASYAAAACAAAAAj//wADZ2x5ZgAAAkwAAADXAAABAAmNjcZoZWFkAAABMAAAAC8AAAA2FpiS+WhoZWEAAAFgAAAAHQAAACQH3QOFaG10eAAAAeQAAAARAAAAEgwAACBsb2NhAAACQAAAAAwAAAAMAEoAgG1heHAAAAGAAAAAHwAAACABEgA2bmFtZQAAAyQAAAFJAAACiCnmEVVwb3N0AAAEcAAAACgAAAA6OMUs4HjaY2BkYGAAYo3boY/i+W2+MnCzMIDAzb3qdQj6fwPzf+YGIJeDgQkkCgA/KAtvAHjaY2BkYGBu+N/AEMPCAALM/xkYGVABCwBZ4wNrAAAAeNpjYGRgYGBl0GJgZgABJiDmAkIGhv9gPgMADTABSQB42mNgZGFgnMDAysDA1Ml0hoGBoR9CM75mMGLkAIoysDIzYAUBaa4pDA7PGJ9xMjf8b2CIYW5gaAAKM4LkANt9C+UAAHjaY2GAABYIVmBgAAAA+gAtAAAAeNpjYGBgZoBgGQZGBhBwAfIYwXwWBg0gzQakGRmYnjE+4/z/n4EBQksxSf6GqgcCRjYGOIeRCUgwMaACRoZhDwCiLwmoAAAAAAAAAAAAAAAASgCAeNpdjkFKw0AARf/vkIR0BkPayWRKQZtYY90ohJju2kOIbtz0KD1HVm50UfEmWXoAr9ADOHFARHHzeY//Fx8Ci+FJfIgdJFa4AhgiMshbrCuIsLxhFJZVs+Vl1bT1GddtbXTC3OhohN4dg4BJ3zMJAnccyfm468ZzHXddrH9ZKbHzdf9n/vkY/xv9sPQXgGEvBrHHwst5kTbXLE+YpYVPkxepPmW94W16UbdNJd6f3SAzo5W7m1jaKd+8ZZIvk5nlKw9SK6Wle7BLS3f/bTzQLmfAF2T1NsQAeNp9kD1OAzEQhZ/zByQSQiCoXVEA2vyUKRMp9Ailo0g23pBo1155nUg5AS0VB6DlGByAGyDRcgpelkmTImvt6PObmeexAZzjGwr/3yXuhBWO8ShcwREy4Sr1F+Ea+V24jhY+hRvUf4SbuFUD4RYu1BsdVO2Eu5vSbcsKZxgIV3CKJ+Eq9ZVwjfwqXMcVPoQb1L+EmxjjV7iFa2WpDOFhMEFgnEFjig3jAjEcLJIyBtahOfRmEsxMTzd6ETubOBso71dilwMeaDnngCntPbdmvkon/mDLgdSYbh4FS7YpjS4idCgbXyyc1d2oc7D9nu22tNi/a4E1x+xRDWzU/D3bM9JIbAyvkJI18jK3pBJTj2hrrPG7ZynW814IiU68y/SIx5o0dTr3bmniwOLn8owcfbS5kj33qBw+Y1kIeb/dTsQgil2GP5PYcRkAAAB42mNgYoAALjDJyIAOWMGiTIxMjMxsKak5qSWpbFmZiRmJ+QAmgAUIAAAAAf//AAIAAQAAAAwAAAAWAAAAAgABAAMABAABAAQAAAACAAAAAHjaY2BgYGQAgqtL1DlA9M296nUwGgA+8QYgAAA=) format('woff');
		font-weight: normal;
		font-style: normal;
	}

	.tui-upload-icon {
		font-family: "tuiUpload" !important;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		padding: 10rpx;
	}

	.tui-icon-delete:before {
		content: "\e601";
	}

	.tui-icon-plus:before {
		content: "\e609";
	}

	.tui-upload-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.tui-upload-add {
		font-weight: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		overflow: hidden;
		box-sizing: border-box;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.tui-upload__unborder {
		border-width: 0;
	}

	.tui-upload__border {
		border-width: 1px;
	}

	.tui-image-item {
		position: relative;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}

	.tui-image-item:nth-of-type(3n) {
		margin-right: 0;
	}

	.tui-item-img {
		display: block;
	}

	.tui-img-del {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		right: -12rpx;
		top: -12rpx;
		border-radius: 50%;
		color: white;
		font-size: 34rpx;
		z-index: 5;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.tui-img-del::before {
		content: '';
		width: 16rpx;
		height: 1px;
		position: absolute;
		left: 10rpx;
		top: 18rpx;
		background-color: #fff;
	}

	.tui-upload-mask {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx 0;
		box-sizing: border-box;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 3;
	}

	.tui-upload-loading {
		width: 28rpx;
		height: 28rpx;
		border-radius: 50%;
		border: 2px solid;
		border-color: #B2B2B2 #B2B2B2 #B2B2B2 #fff;
		animation: tui-rotate 0.7s linear infinite;
	}

	@keyframes tui-rotate {
		0% {
			transform: rotate(0);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.tui-tips {
		font-size: 26rpx;
		color: #fff;
	}

	.tui-mask-btn {
		padding: 4rpx 16rpx;
		border-radius: 40rpx;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		border: 1px solid #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-top: 26rpx;
	}

	.tui-btn-hover {
		opacity: 0.8;
	}
</style>