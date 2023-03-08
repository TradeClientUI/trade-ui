<template>
    <div class='trustedBy'>
        <h2 class='h2title'>
            {{ $t('JG_newHome.trustedBy') }}
        </h2>
        <div class='cont'>
            <img alt='' class='item' src='../../../images/home/logo/1.png' />
            <img alt='' class='item' src='../../../images/home/logo/2.png' />
            <img alt='' class='item' src='../../../images/home/logo/3.png' />
            <img alt='' class='item' src='../../../images/home/logo/4.png' />
            <img alt='' class='item' src='../../../images/home/logo/5.png' />
            <img alt='' class='item' src='../../../images/home/logo/6.png' />
            <img alt='' class='item' src='../../../images/home/logo/7.png' />
            <img alt='' class='item' src='../../../images/home/logo/8.png' />
            <img alt='' class='item' src='../../../images/home/logo/9.png' />
            <!-- <img alt='' class='item' src='../../../images/home/logo/10.png' /> -->
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.trustedBy{
    margin-top: rem(8px);
    padding: rem(60px) rem(30px);
    background: var(--contentColor);
}
.h2title{
    font-size: rem(48px);
    font-weight: bold;
    text-align: center;
    padding-bottom: rem(64px);
}
.cont{
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    .item{
        width: 32%;
    }
}

</style>
