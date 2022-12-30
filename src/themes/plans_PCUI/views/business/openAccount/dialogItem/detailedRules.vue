<template>
    <div class='rules'>
        <p class='h1'>
            {{ $t('JG_referral.rulesH1') }}
        </p>
        <p class='desc'>
            {{ $t('JG_referral.rulesText1') }}
        </p>

        <p class='h1'>
            {{ $t('JG_referral.rulesH2') }}
        </p>
        <ul class='step'>
            <li class='desc'>
                <span class='number'>
                    01
                </span>
                <span class='text'>
                    {{ $t('JG_referral.step1') }}
                </span>
            </li>
            <li class='desc'>
                <span class='number'>
                    02
                </span>
                <span class='text'>
                    {{ $t('JG_referral.step2') }}
                </span>
            </li>
            <li class='desc'>
                <span class='number'>
                    03
                </span>
                <span class='text'>
                    {{ $t('JG_referral.step3') }}
                </span>
            </li>
        </ul>

        <p class='h1'>
            {{ $t('JG_referral.rulesH3') }}
        </p>
        <el-row class='table'>
            <el-col class='th' :span='12'>
                {{ $t('JG_referral.rulesTable1') }}
            </el-col>
            <el-col class='th' :span='12'>
                {{ $t('JG_referral.rulesTable2') }}
            </el-col>

            <el-col class='td' :span='12'>
                {{ $t('JG_referral.rulesTable3') }}
            </el-col>
            <el-col class='td' :span='12'>
                {{ $t('JG_referral.rulesTable4') }}
            </el-col>

            <el-col class='td' :span='12'>
                {{ $t('JG_referral.rulesTable5') }}
            </el-col>
            <el-col class='td' :span='12'>
                {{ $t('JG_referral.rulesTable6') }}
            </el-col>
        </el-row>
        <p class='h1'>
            {{ $t('JG_referral.rulesH4') }}
        </p>
        <ul>
            <li class='desc'>
                {{ $t('JG_referral.rulesText5') }}
            </li>
            <li class='desc'>
                {{ $t('JG_referral.rulesText6') }}
            </li>
            <li class='desc'>
                {{ $t('JG_referral.rulesText7') }}
            </li>
            <li class='desc'>
                {{ $t('JG_referral.rulesText8') }}
            </li>
            <li class='desc'>
                {{ $t('JG_referral.rulesText9') }}
            </li>
            <li class='desc'>
                {{ $t('JG_referral.rulesText10') }}
            </li>
        </ul>

        <p class='h1'>
            {{ $t('JG_referral.rulesH5') }}
        </p>
        <p class='desc'>
            {{ $t('JG_referral.rulesText11') }}
        </p>
    </div>
</template>

<script>
export default ({
    setup () {}
})
</script>

<style lang="scss" scoped>
.rules{
    max-height: 500px;
    overflow-y: scroll;
    &::-webkit-scrollbar {display:none}
    scrollbar-width: none; /* 隐藏导航条 兼容火狐 */
}
.h1{
    height: 66px;
    font-size: 20px;
    font-weight: 600;
    color: #EBB650;
    line-height: 66px;
}
.desc{
    font-size: 14px;
    color: #333333;
    line-height: 21px;
    margin-bottom: 12px;
}
.table{
    width: 100%;
    font-size: 14px;
    text-align: center;
    border: 1px solid #EBB650;
    border-radius: 5px;
    .td{
        height: 45px;
        line-height: 45px;
        border: 1px solid #EBB650;
        color: #333333;
    }
    .th{
        background-color: #EBB650;
        height: 53px;
        line-height: 53px;
        color: #FFFFFF;
    }
}
.step{
    .desc{
        color: #000;
        position: relative;
        &::before{
            content:'';
            display: block;
            width:16px;
            height:16px;
            background:#EBB650;
            border-radius: 50%;
            margin-right:6px;
            position: absolute;
            bottom: -3px;
            left: 3px;
        }
    }
    .number{
        position: absolute;
        font-size: 16px;
        font-weight: 600;
    }
    .text{margin-left: 28px;}
}
</style>
