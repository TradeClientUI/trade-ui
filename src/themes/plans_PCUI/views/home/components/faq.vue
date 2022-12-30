<template>
    <div class='faq-module'>
        <div class="faq-module-warp">
            <h2 class='title'>
                <span class='text'>
                    {{ $t('homeJD.faqs') }}
                </span>
            </h2>
            <el-collapse v-model='activeName' accordion>
                <template v-for="(item, index) in list" :key='index'>
                    <el-collapse-item>
                        <template #title>
                            {{ item.title }}
                        </template>
                        <div class='desc'>
                            {{ item.desc }}
                        </div>
                    </el-collapse-item>
                </template>
            </el-collapse>
            <!-- <p class='more-btn' @click="$router.push('/faqs')">
                View all
            </p> -->
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
const activeName = ref('1')

const list = ref([
    { title: t('homeJD.faqs1'), desc: t('homeJD.faqs1Desc') },
    { title: t('homeJD.faqs2'), desc: t('homeJD.faqs2Desc') },
    { title: t('homeJD.faqs3'), desc: t('homeJD.faqs3Desc') },
    { title: t('homeJD.faqs4'), desc: t('homeJD.faqs4Desc') },
    { title: t('homeJD.faqs5'), desc: t('homeJD.faqs5Desc') },
])

</script>

<style lang="scss">
.faq-module {
    .el-collapse {
        border: none;
    }
    .el-collapse-item {
        border: 1px solid var(--lineColor);
        margin-bottom: 32px;
        border-radius: 16px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-collapse-item__content {
        padding-bottom: 24px;
        margin: 0 48px;
    }
    .el-collapse-item__header {
        color: var(--mainColor);
        font-size: 20px;
        font-weight: 600;
        background: url('../../../images/home/new_version/wenhao_icon.png') 24px center no-repeat;
        padding-left: 48px;
        height: 78px;
        padding-right: 20px;
        border: none;
        &.is-active {
            height: 70px;
        }
    }
    .is-active {
        color: #111;
        font-weight: 600;
    }
    .el-collapse-item__arrow.is-active {
        color: var(--primary);
    }
    .el-collapse-item__wrap {
        border: none;
        border-radius: 0 0 16px 16px;
    }
}

</style>

<style lang="scss" scoped>
.faq-module {
    @include pagePadding();
    .faq-module-warp {
        margin: 0 auto;
        font-weight: 500;
        width: 886px;
        margin-bottom: 8px;
        padding-bottom: 64px;
    }
    .title {
        text-align: center;
        color: var(--color);
        font-size: 32px;
        line-height: 38px;
        font-weight: 600;
        margin-bottom: 32px;
        margin-top: 48px;
        border-bottom: 2px solid var(--lineColor);
        .text {
            position: relative;
            display: inline-block;
            padding-bottom: 12px;
        }
    }
    .desc {
        color: var(--color);
        font-size: 16px;
        font-weight: 400;
        line-height: 30px;
    }
    .more-btn {
        width: 140px;
        height: 44px;
        line-height: 44px;
        color: var(--primary);
        font-size: 16px;
        text-align: center;
        border-radius: 12px;
        border: 2px solid rgba(0, 0, 0, 0.1);
        margin: 40px auto;
        &:hover {
            cursor: pointer;
            border-color: var(--primary);
        }
    }
}
body.night {
    .faq-module {
        border-bottom: 1px solid var(--lineColor);
        .title {
            margin-top: 30px;
        }
        .el-collapse-item {
            &:hover {
                border-color: #FFF;
            }
        }
        :deep(.el-collapse-item__header) {
            filter: brightness(100);
        }
        :deep(.el-collapse-item__wrap) {
            background: var(--bgColor);
        }
    }
}
</style>
