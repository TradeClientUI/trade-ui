<template>
    <div class='startInvestment-module'>
        <h2 class='title'>
            Start your first trade with these 3 steps
        </h2>
        <div class='step-wrap'>
            <ul class='step'>
                <li class='step-item'>
                    <p class='step-icon'>
                        1
                    </p>
                    <p>Register for a new account</p>
                </li>
                <li class='line-icon'></li>
                <li class='step-item'>
                    <p class='step-icon'>
                        2
                    </p>
                    <p>Deposit into your account</p>
                </li>
                <li class='line-icon'></li>
                <li class='step-item'>
                    <p class='step-icon'>
                        3
                    </p>
                    <p>Start investing in funds</p>
                </li>
            </ul>
        </div>
        <!-- <div class='activate'>
            <div class='activate-cont'>
                <div class='cont-left'>
                    <p class='left-title'>
                        Activate novice rewards
                    </p>
                    <p>Now register and recharge up to 150 usdt for new users!</p>
                </div>
                <p class='btn' @click="$router.push('/faqs')">
                    Activate now
                </p>
            </div>
        </div> -->
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.startInvestment-module {
    @include globalFont();
    font-weight: 500;
    .title {
        padding: 48px 0;
        color:#111;
        line-height: 56px;
        text-align: center;
        font-size: 48px;
        font-weight: 700;
    }
    .step-wrap{
        @include pagePadding();
    }
    .step {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 64px;
        height: 60px;
        @include pagePadding();
        &-item {
            display: flex;
            align-items: center;
            flex-direction: column;
            font-weight: 600;
            color: #111;
            font-size: 16px;
            .step-icon {
                text-align: center;
                font-size: 20px;
                color:var(--color);
                line-height: 44px;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                border: 2px solid #333333;
                margin-bottom: 8px;
            }
            .right{
                margin-left: 24px;
            }
        }
        .line-icon {
            width:90px;
            height:1px;
            background: #999;
        }
    }
    .activate {
        background-color: #F2F4F8;
        @include pagePadding();
        &-cont {
            margin:0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
           @include pagePadding();
           padding-top:32px !important;
           padding-bottom: 32px !important;
            .cont-left {
                background: url('../../../images/home/new_version/activate_icon.png') left center no-repeat;
                color:#666;
                font-size: 16px;
                font-weight: 400;
                padding:16px 0 16px 148px;
                .left-title {
                    font-size: 24px;
                    color:#111;
                    font-weight: 600;
                    line-height: 28px;
                }
            }
            .btn {
                text-align: center;
                font-size: 20px;
                width: 170px;
                line-height: 58px;
                background: var(--primary);
                border-radius: 8px;
                color:#fff;
                cursor: pointer;
                @include hover();
            }
        }
    }
}
</style>
