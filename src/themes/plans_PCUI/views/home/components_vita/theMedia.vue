<template>
    <div class='theMedia'>
        <h2 class='h2title'>
            {{ $t('JG_newHome.theMedia') }}
        </h2>
        <div class='cont'>
            <img alt='' class='item' src='../../../images/home/logo/11.png' />
            <img alt='' class='item' src='../../../images/home/logo/12.png' />
            <img alt='' class='item' src='../../../images/home/logo/13.png' />
            <img alt='' class='item' src='../../../images/home/logo/14.png' />
            <img alt='' class='item' src='../../../images/home/logo/15.png' />
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.theMedia{
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
