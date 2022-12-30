<template>
    <div class='buyNow-module'>
        <h2 class='title'>
            The perfect time to buy crypto funds in batches
        </h2>
        <div class='cont'>
            <img class='echarts_icon' src='../../../images/home/new_version/echarts_icon.png' />
            <p class='black'>
                The long-term trend indicator is based on the total cost of the market and reflects the overall profitability of the market.
            </p>
            <p class='grey'>
                When the indicator is greater than 6, it is the fund selling range;
            </p>
            <p class='grey'>
                When the indicator is less than 2, it is the fund buying range;
            </p>
            <p class='grey Underline'>
                The current indicator is an excellent purchase range.
            </p>
            <p class='bottom'>
                --Information comes from Glassnode
            </p>
            <p class='bottom'>
                Does not constitute investment advice. Reference only.
            </p>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.buyNow-module {
    width:100%;
    margin:0 auto;
    padding:  0 rem(32px);
    font-weight: 500;
    .title {
        color:#111;
        line-height: rem(56px);
        font-size: rem(48px);
        font-weight: bold;
        text-align: center;
        padding: rem(96px) 0;
    }
    .cont {
        .echarts_icon {
            display: block;
            width:100%;
            // border:1px dotted #999;
        }
        .black{
            font-size: rem(32px);
            font-weight: 600;
            color: #111;
            margin: rem(40px) 0 rem(32px);
        }
        .grey{
            font-size: rem(28px);
            font-weight: 400;
            color: #333;
            margin-bottom: rem(16px);
            line-height: rem(33px);
            &.Underline{
                font-weight: 600;
                // text-decoration: underline;
                margin-bottom: rem(96px);
            }
        }
        .bottom {
            color:#666;
            margin-bottom: rem(16px);
            font-size: rem(24px);
            font-weight: 400;
            line-height: rem(28px);
            &:last-child{
                margin-bottom: rem(32px);
            }
        }
    }

}
</style>
