<template>
    <div class='buyNow-module'>
        <h2 class='title'>
            The perfect time to buy crypto funds in batches
        </h2>
        <div class='cont'>
            <div class='left'>
                <img class='echarts_icon' src='../../../images/home/new_version/echarts_icon.png' />
            </div>

            <div class='right'>
                <p class='dd'>
                    The long-term trend indicator is based on the total cost of the market and reflects the overall profitability of the market.
                </p>
                <p>
                    When the indicator is greater than 6, it is the fund selling range;
                </p>
                <p>
                    When the indicator is less than 2, it is the fund buying range;
                </p>
                <p class='text'>
                    The current indicator is an excellent purchase range.
                </p>
                <div class='right-btm'>
                    <p>--Information comes from Glassnode </p>
                    <p>Does not constitute investment advice. Reference only.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.buyNow-module {
    @include pagePadding();
    @include globalFont();
    font-weight: 500;
    .title {
        padding: 48px 0;
        line-height: 56px;
        text-align: center;
        font-size: 48px;
        font-weight: 700;
        color:#111;
    }
    .cont {
        display: flex;
        justify-content: space-between;
        // align-items: center;
        .left {
            flex: 1;
            .echarts_icon {
                flex:1;
                height:444px;
                margin-right:56px;
            }
        }

        .right {
            flex:1;
            color:var(--color);
            font-size: 16px;
            line-height: 20px;
            font-weight: 400;
            display:flex;flex-direction:column;
            padding-top:80px;
            .dd {
                color:#111;
                font-size: 20px;
                line-height:24px;
                margin-bottom: 24px;
                font-weight: 600;
            }
            p {
                margin-bottom: 8px;
            }
            .text {
                font-weight: 600;
                // text-decoration: underline;
            }
            .right-btm {
                // text-align: right;
                color:#666;
                font-size: 12px;
                line-height: 14px;
                margin-top: 48px;
                margin-bottom: 64px;
                font-weight: 400;
            }
        }
    }

}
</style>
