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
    margin-top: 4px;
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
    padding: 40px 0;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
}

</style>
