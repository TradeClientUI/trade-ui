<template>
    <router-view />
    <div class='quote'>
        <!-- <TopModule /> -->
        <Ranking />
        <Content />
    </div>
</template>

<script setup>
import TopModule from './components/TopModule'
import Content from './components/Content'
import Ranking from './ranking'
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.quote{
    width: 1200px;
    margin: 40px auto;
}
</style>
