<template>
    <centerViewDialog>
        <div>
            <Top
                back
                left-icon='arrow-left'
                show-center
            />
            <div class='page-wrap'>
                <Loading :show='loading' />
                <div v-if='kycList && kycList.length === 0' class='empty-data'>
                    <van-empty :description='$t("auth.noRequired")' image='/images/empty.png' />
                </div>
                <div v-else>
                    <p class='title'>
                        {{ $t('auth.authComplete') }}
                    </p>
                    <div class='auth-list'>
                        <div v-for='(item,index) in kycList' :key='index' class='auth-item'>
                            <img alt='' class='auth-img' :src="require('@/themes/plans/images/'+ item.levelCode +'.png')" />
                            <div class='content'>
                                <p class='t1'>
                                    {{ kycMap[item.levelCode] }}
                                </p>
                                <p class='t2'>
                                    {{ $t('auth.authPass') }} [{{ item.businessNameList.toString() }}]
                                </p>
                            </div>
                            <div v-if='item.preLevelObj && item.preLevelObj.status !== 2'>
                                <span class='notice'>
                                    {{ $t('auth.executeAuth', [kycMap[item.preLevelObj.levelCode]]) }}
                                </span>
                            </div>
                            <div v-else class='btn'>
                                <van-button
                                    v-if='[0,3].includes(Number(item.status))'
                                    class='pc_kyc_unverified_ga'
                                    plain
                                    round
                                    size='small'
                                    @click='handleNext(item)'
                                >
                                    <template #default>
                                        <span class='unverified' @click='handleNext(item)'>
                                            {{ kycAuditStatus[item.status] }}
                                            <van-icon :color='style.fallColor' name='arrow' />
                                        </span>
                                    </template>
                                </van-button>
                                <span v-else class='state'>
                                    {{ kycAuditStatus[item.status] }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import Top from '@/components/top'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { findAllBizKycList } from '@/api/user'
import { useStore } from 'vuex'
import { toRefs, reactive, computed, onBeforeMount } from 'vue'
import { getArrayObj } from '@/utils/util'
import { useI18n } from 'vue-i18n'

export default {
    name: 'Authentication',
    components: {
        centerViewDialog,
        Top
    },
    setup (props, { emit, attrs }) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const style = computed(() => store.state.style)
        const { t, tm } = useI18n({ useScope: 'global' })
        const state = reactive({
            list: [],
            loading: false,
        })

        const kycMap = {
            level_1: t('common.kycLevel1'),
            level_2: t('common.kycLevel2'),
            level_3: t('common.kycLevel3'),
        }
        const kycList = computed(() => store.state._user.kycList)
        const kycState = computed(() => store.state._user.kycState)
        const kycAuditStatus = tm('kycAuditStatus')

        const getAuthCondition = () => {
            state.loading = true
            store.dispatch('_user/findAllBizKycList').then(res => {
                state.loading = false
            })
        }

        const handleNext = (item) => {
            if (Number(item.status) === 0 || Number(item.status) === 3) {
                router.push({
                    path: route.path.slice(0, -15) + '/authForm',
                    query: {
                        levelCode: item.levelCode,
                        businessCode: route.query.businessCode
                    }
                })
            }
        }

        const back = () => {
            router.replace('/')
        }

        onBeforeRouteLeave((to, from) => {
            if ((Number(kycState.value) === 0 || Number(kycState.value) === 3) && to.path.indexOf('/authForm') === -1) {
                store.dispatch('_user/logout').then(() => {
                    return router.push('/login')
                }).then(() => {
                    location.reload()
                })
            }
        })

        onBeforeMount(() => {
            getAuthCondition()
        })

        return {
            kycState,
            handleNext,
            back,
            style,
            kycMap,
            kycAuditStatus,
            kycList,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    overflow: auto;
    background: var(--bgColor);
    .empty-data {
        padding-top: rem(200px);
    }
    .title {
        padding: 0 rem(25px);
        color: var(--minorColor);
        line-height: rem(80px);
        border-bottom: solid 1px var(--lineColor);
    }
    .auth-list {
        padding: 0 rem(30px);
        background: var(--contentColor);
        .auth-item {
            display: flex;
            align-items: center;
            padding: rem(45px) 0;
            border-bottom: solid 1px var(--lineColor);
            .auth-img {
                width: rem(60px);
                height: rem(100px);
                margin-right: rem(30px);
            }
            .content {
                flex: 1;
                .t1 {
                    color: var(--color);
                    font-weight: bold;
                    font-size: rem(28px);
                    line-height: rem(49px);
                }
                .t2 {
                    color: var(--color);
                    font-weight: 500;
                    font-size: rem(24px);
                    line-height: rem(49px);
                }
            }
            .van-button {
                padding: 0 rem(30px);
                // background: var(--primaryAssistColor);
                .btn-text {
                    padding-right: rem(6px);
                    color: var(--color);
                    vertical-align: middle;
                }
                .van-icon {
                    vertical-align: middle;
                }
            }
            .notice {
                color: var(--minorColor);
                font-size: rem(24px);
            }
        }
        .btn {
            :deep(.van-button) {
                background: var(--primaryAssistColor);
            }
            .unverified {
                color: var(--fallColor);
            }
            .state {
                color: var(--minorColor);
                font-size: rem(24px);
            }
            .van-icon-arrow {
                vertical-align: -1px !important;
            }
        }
    }
}
</style>
