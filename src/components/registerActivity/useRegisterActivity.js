import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { getServiceDate } from '@/components/registerActivity'
import { REGISTER_ACTIVITY_OPEN_STATUS } from './registerActivityUtils'
/**
 * `useRegisterActivity` 获取开户赠金活动信息和是否开启
 * @param {Boolean} - mutateActivity 是否需要重新获取活动信息
 * @returns 具有以下属性的对象：
 * - `activityTime`：一个计算属性，返回用户完成活动的剩余时间。
 * - `activityInfo`：包含活动信息的对象。
 * - `countdownAvailable`：一个计算属性，返回一个布尔值，活动倒计时是否打开。
 * - `indexBannerText`：一个计算属性，返回要在主页页面banner上显示的文本。
 * - `registerBannerText`：一个计算属性，返回要在注册页面banner上显示的文本。
 * - `activityFinishStatus`：一个计算属性，返回客户完成活动状态。
 * - `activityStatusIsOpen`：一个计算属性，返回活动开启状态。
 */
export const useRegisterActivity = (mutateActivity) => {
    const store = useStore()
    const { t } = useI18n()
    // 活动信息
    const info = computed(() => store.state._activity.info)

    // 活动完成状态，null:未参与 1:待完成 3:已结束
    const activityFinishStatus = computed(() => store.state._activity.finishStatus)

    // 活动状态等于2开启活动
    const activityStatusIsOpen = computed(() => store.state._activity.info.status === REGISTER_ACTIVITY_OPEN_STATUS)

    // 是否显示充值倒计时和提示
    const countdownAvailable = computed(() => {
        if (store.state._user.customerInfo) {
            // 用户登录需要判断是否在充值活动rechargeGapHour以内，并且活动已经开启,用户未参与活动
            return activityTime.value > 0
        }
        return activityStatusIsOpen.value
    })

    // 首次充值倒计时时间
    const activityTime = computed(() => {
        // 注册完成在多少小时以内充值的小时
        const rechargeGapHour = info.value.rechargeGapHour
        // 注册时间
        const registerTime = store.state._user.customerInfo.registerTime
        // 服务器时间
        const responseDateValue = new Date(getServiceDate()).valueOf()

        // 注册时间小于活动开启时间
        if (registerTime < info.value.beginTime) return null

        // 判断活动已开启并且用户未参与，显示倒计时，activityFinishStatus.value === null 用户未参与，
        if (!rechargeGapHour || !activityStatusIsOpen.value || activityFinishStatus.value !== null) return null

        // 注册时间加上活动充值间隔减去服务器时间等于充值倒计时时间
        const diffTime = registerTime + rechargeGapHour * 60 * 60 * 1000 - responseDateValue

        if (diffTime <= 0) {
            console.warn('注册超过24小时')
            return null
        }

        return diffTime
    })

    /** 首页活动文案 */
    const indexBannerText = computed(() => t('registerActivity.openAccountReward', {
        rewardAmount: info.value.rewardAmount
    }))

    /** 注册成功活动文案 */
    const registerBannerText = computed(
        () => t('registerActivity.registerBannerText', {
            rechargeAmount: info.value.rechargeAmount, rewardAmount: info.value.rewardAmount, rechargeGapHour: info.value.rechargeGapHour
        }),
    )

    /** 活动期间未完成活动点击提现提示文案 */
    const withdrawTips = computed(
        () => t('registerActivity.withdrawTips', {
            rechargeAmount: info.value.rechargeAmount, rewardAmount: info.value.rewardAmount
        }),
    )

    onMounted(() => {
        // 判断是否需要重新获取活动信息
        if (mutateActivity) {
            store.dispatch('_activity/getEnableAct')
            store.dispatch('_activity/getActFinishStatus')
        }
    })

    return { activityTime, activityStatusIsOpen, activityFinishStatus, activityInfo: info, countdownAvailable, indexBannerText, registerBannerText, withdrawTips }
}

export default useRegisterActivity
