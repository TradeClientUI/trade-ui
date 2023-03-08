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
