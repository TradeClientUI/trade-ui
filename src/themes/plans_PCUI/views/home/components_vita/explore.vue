<template>
    <div class='explore'>
        <h2 class='h2title'>
            {{ $t('JG_explore.text1') }}
        </h2>
        <div class='cont'>
            <div class='item'>
                <img alt='' src='/images/threeStep_img2.png' />
                <p class='text'>
                    {{ $t('JG_explore.text2') }}
                </p>
                <p class='more'>
                    <span @click="goPage('/earning')">
                        {{ $t('JG_explore.text3') }}
                        <i class='el-icon-arrow-right'></i>
                    </span>
                </p>
            </div>
            <div class='item'>
                <img alt='' src='/images/threeStep_img3.png' />
                <p class='text'>
                    {{ $t('JG_explore.text4') }}
                </p>
                <p class='more'>
                    <span @click="goPage('/indexFunds')">
                        {{ $t('JG_explore.text3') }}
                        <i class='el-icon-arrow-right'></i>
                    </span>
                </p>
            </div>
            <div class='item'>
                <img alt='' src='/images/threeStep_img4.png' />
                <p class='text'>
                    {{ $t('JG_explore.text5') }}
                </p>
                <p class='more'>
                    <span @click="goPage('/fundV10/join')">
                        {{ $t('JG_explore.text3') }}
                        <i class='el-icon-arrow-right'></i>
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goPage = (url) => {
    router.push({ path: url })
}
</script>

<style lang="scss" scoped>
.explore{
    margin-top: 20px;
    padding: 50px 0;
    background: var(--contentColor);
}
.h2title{
    font-family: "Microsoft Yahei";
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 20px;
}
.cont{
    display: flex;
    width: 1200px;
    margin: 0 auto;
    padding: 40px 16px 16px;
    align-items: center;
    justify-content: space-between;
    .item{
        color: #333;
        text-align: center;
        font-size: 20px;
        img{
            width: 128px;
        }
        .text{
            margin: 15px 0;
        }
        .more{
            text-align: end;
            color: #999;
            font-size: 16px;
            cursor: pointer;
            &:hover{
                color: var(--primary);
            }
        }
    }
}

</style>
