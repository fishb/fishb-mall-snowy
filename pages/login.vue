<template>
	<view class="login-container">
		<view class="logo-content" @tap="logoTap">
			<image style="width: 100rpx;height: 100rpx;" :alt="sysBaseConfig.SNOWY_SYS_NAME" :src="sysBaseConfig.SNOWY_SYS_LOGO" mode="widthFix">
			</image>
			<text class="title">{{sysBaseConfig.SNOWY_SYS_NAME}} {{sysBaseConfig.SNOWY_SYS_VERSION}}</text>
		</view>
		<view class="login-form-content">
			<view class="input-item">
				<uv-icon class="icon" name="account-fill" size="20" color="#999"></uv-icon>
				<input v-model="loginForm.account" class="input" type="text" placeholder="请输入账号" maxlength="30" />
			</view>
			<view class="input-item">
				<uv-icon class="icon" name="lock-fill" size="20" color="#999"></uv-icon>
				<input v-model="loginForm.password" type="password" class="input" placeholder="请输入密码" maxlength="20" />
			</view>
			<view class="input-item" v-if="sysBaseConfig.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN === 'true'">
				<uv-icon class="icon" name="empty-permission" size="20" color="#999"></uv-icon>
				<input v-model="loginForm.validCode" type="text" class="input" placeholder="请输入验证码" maxlength="4" />
				<image :src="validCodeBase64" @click="loginCaptcha" class="login-code-img"></image>
			</view>
			<view>
				<button @click="handleLogin" class="login-btn" type="primary">登录</button>
			</view>
		</view>
	</view>
</template>
<script setup>
	import { ref, reactive, getCurrentInstance, computed } from 'vue'
	import { getPicCaptcha } from '@/api/login'
	import store from '@/store'
	import onFeedTap from '@/utils/feedTap'
	const { proxy } = getCurrentInstance()
	const logoTap = () => {
		uni.$snowy.tab.reLaunch('/pages/config/index')
	}
	const sysBaseConfig = computed(() => {
		return store.getters.sysBaseConfig
	})
	const validCodeBase64 = ref("")
	const loginForm = reactive({
		account: 'superAdmin',
		password: '123456',
		validCode: '',
		validCodeReqNo: '',
	})
	// 获取图形验证码
	const loginCaptcha = () => {
		getPicCaptcha().then(res => {
			validCodeBase64.value = res.data.validCodeBase64
			loginForm.validCodeReqNo = res.data.validCodeReqNo
		})
	}
	if (sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN) {
		loginCaptcha()
	}
	// 登录方法
	const handleLogin = async () => {
		if (loginForm.account === "") {
			uni.$snowy.modal.msgError("请输入账号")
		} else if (loginForm.password === "") {
			uni.$snowy.modal.msgError("请输入密码")
		} else if (loginForm.validCode === "" && sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN === 'true') {
			uni.$snowy.modal.msgError("请输入验证码")
		} else {
			pwdLogin()
		}
	}
	// 密码登录
	const pwdLogin = async () => {
		store.dispatch('Login', loginForm).then(() => {
			// 所有异步请求结束之后才能够进行下一步操作
			Promise.all([
				store.dispatch('GetUserLoginMenu'),
				store.dispatch('GetUserInfo'),
				store.dispatch('GetDictTypeTreeData'),
			]).then((result) => {
				// #ifdef H5
				const { searchQuery, hashQuery } = uni.$xeu.parseUrl(location.href)
				if (searchQuery.redirect) {
					uni.$snowy.tab.reLaunch(searchQuery.redirect)
				} else if(hashQuery.redirect){
					uni.$snowy.tab.reLaunch(hashQuery.redirect)
				} else {
					// #endif
					uni.$snowy.tab.reLaunch('/pages/home/index')
					// #ifdef H5
				}
				// #endif
			}).catch(err => {
				onFeedTap()
				if (sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN) {
					loginCaptcha()
					loginForm.validCode = ""
				}
			})
		}).catch(err => {
			onFeedTap()
			if (sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN) {
				loginCaptcha()
				loginForm.validCode = ""
			}
		})
	}
</script>
<style lang="scss" scoped>
	page {
		background-color: #ffffff;
	}

	.login-container {
		width: 100%;

		.logo-content {
			width: 100%;
			font-size: 21px;
			text-align: center;
			padding-top: 15%;
			align-items: center;
			justify-content: center;
			display: flex;

			image {
				border-radius: 4px;
				width: 100upx;
				height: 100upx;
			}

			.title {
				margin-left: 15upx;
			}
		}

		.login-form-content {
			text-align: center;
			margin: 20px auto;
			margin-top: 15%;
			width: 80%;

			.input-item {
				margin: 20px auto;
				background-color: #f5f6f7;
				height: 45px;
				border-radius: 20px;
				display: flex;
				align-items: center;

				.icon {
					font-size: 38rpx;
					margin-left: 10px;
					color: #999;
				}

				.input {
					width: 100%;
					font-size: 14px;
					line-height: 20px;
					text-align: left;
					padding-left: 15px;
				}

				.login-code-img {
					border: 1px solid var(--border-color-split);
					cursor: pointer;
					width: 70%;
					height: 45px
				}
			}

			.login-btn {
				margin-top: 40px;
				height: 45px;
				background-color: $uni-primary;
				border-radius: 1000upx;
				color: #ffffff;
			}
		}
	}

	.login-code-img {
		border: 1px solid var(--border-color-split);
		cursor: pointer;
		width: 70%;
		height: 45px
	}
</style>