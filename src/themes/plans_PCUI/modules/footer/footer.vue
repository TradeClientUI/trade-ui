<template>
    <div class='footer-nav' :style='data.styleObj'>
        <div class='footer-auto'>
            <div class='nav-left'>
                <img v-if='data.logo' class='footerLogo' :src='data.logo' />
                <p class='year'>
                    {{ data.copyRight }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: '',
                }
            }
        },
        moduleId: {
            type: String,
            default: ''
        },
    },
    setup () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.footer-nav {
    position: relative;
    min-width: 1200px;
    padding: 40px 0;
    text-align: center;
    background: #15191E !important;
    // .footer-auto {
    //     display: flex;
    //     justify-content: space-between;
    // }
    .nav-left {
        .year {
            margin-top: 18px;
            color: #9293A3;
            font-size: 12px;
        }
    }
    .nav-right {
        padding-top: 90px;
        ul {
            display: flex;
        }
        li {
            margin-right: 110px;
            &:last-of-type {
                margin-right: 0;
            }
            .title {
                color: #515366;
                font-size: 14px;
            }
            .name {
                margin-top: 10px;
                a {
                    color: #9293A3;
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
