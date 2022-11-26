<template>
    <div class='ad-module auto-width'>
        <ul>
            <li>
                <img src='@planspc/images/home/ad-1.png' />
            </li>
            <li>
                <img src='@planspc/images/home/ad-2.png' />
            </li>
            <li>
                <img src='@planspc/images/home/ad-3.png' />
            </li>
            <li>
                <img src='@planspc/images/home/ad-4.png' />
            </li>
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.ad-module {
    margin-top: 90px;
    ul {
        display: flex;
    }
    li {
        margin-right: 16px;
        cursor: pointer;
        &:last-of-type {
            margin-right: 0;
        }
        img {
            display: block;
            width: 288px;
            height: 144px;
        }
    }
}
</style>
