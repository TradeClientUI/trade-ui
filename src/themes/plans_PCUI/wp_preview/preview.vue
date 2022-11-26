<template>
    <div class='previewWrapper' :class="{pc:isPC}">
        <div v-if="urlParams.page_code==='Home'" >
            <div :class='{ active: fullBannerData.id === activated }'>
                <FullBanner :data="fullBannerData.data" @click.stop="moduleClick(fullBannerData, $event)"></FullBanner>
            </div>
            <div :class='{ active: bannerProductsData.id === activated }'>
                <BannerProducts :data="bannerProductsData.data" @click.stop="moduleClick(bannerProductsData, $event)"></BannerProducts>
            </div>
            <div :class='{ active: homeNoticeData.id === activated }'>
                <HomeNotice :data="homeNoticeData.data" @click.stop="moduleClick(homeNoticeData, $event)"></HomeNotice>
            </div>
        </div>
        <div class='phoneBody'>
            <!-- <component :is='defaultPageComp' v-if='defaultPageComp' /> -->
            <!-- <p>{{moduleList}}</p> -->
            <draggable
                ref='draggable'
                v-model='moduleList'
                :animation='340'
                class='drawing-board '
                group='componentsGroup'
                :item-key='e=>e.id'
                @end='onEnd'
                @start='onStart'
            >
                <template #item='{ element:el, index }'>
                    <div @click='moduleClick(el, $event)' v-if="!el.listHidden">
                        <component
                            :is='el.component'
                            :class='{ active: el.id === activated }'
                            :data='el.data'

                        >
                            <div v-if='el.data.bindComp && el.data.bindComp.length'>
                                <component
                                    :is='item.component'
                                    v-for='(item,i) in el.data.bindComp'
                                    :key="index+''+i+item.id"
                                    :class='{ active: item.id === activated }'
                                    :data='item.data'
                                    @click.stop='moduleClick(item, $event)'
                                />
                            </div>
                        </component>
                    </div>
                </template>
            </draggable>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState, mapMutations } from 'vuex'
import { defineAsyncComponent } from 'vue'
import FullBanner from '../modules/fullBanner/fullBanner'
import BannerProducts from '../modules/bannerProducts/bannerProducts'
import HomeNotice from '../modules/homeNotice/homeNotice'
import FooterComp from '../modules/footer/footer'
import { getQuery } from '@utils/index'
export default {
    components: {
        FullBanner,
        HomeNotice,
        BannerProducts,
        FooterComp,
        draggable,
    },
    data () {
        return {
            isPC:process.env.VUE_APP_theme==='plans_PCUI',
            myArray: [
                {
                    tag: 'img',
                    title: 'module111',
                },
                {
                    tag: 'text',
                    title: 'module222',
                }
            ]
        }
    },
    computed: {
        ...mapState({
            activated: state => state.editor.activated,
        }),
        urlParams () {
            const hash = location.hash
            const hashSearch = hash.includes('?') ? hash.slice(hash.indexOf('?')) : '?t=1'
            const urlParams = getQuery(hashSearch)
            return urlParams
        },
        moduleList () {
            // return []
            let list = this.$store.state.editor.elementList
            list = list.map((item) => {
                const itemEl = JSON.parse(JSON.stringify(item))
                const { style, linkComp, linkCompPosition, background, moduleAlign, height } = itemEl.data
                const styleObj = {}
                for (const key in style) {
                    if (style.hasOwnProperty(key)) {
                        styleObj[key] = Number(style[key]) + 'px'
                    }
                }
                if (linkComp && linkCompPosition) {
                    Object.assign(styleObj, {
                        position: 'absolute',
                        zIndex: 1,
                        left: 0
                    })
                    switch (linkCompPosition) {
                        case 'top':
                            styleObj.top = 0
                            styleObj.left = 0
                            styleObj.right = 0
                            break
                        case 'bottom':
                            styleObj.bottom = 0
                            styleObj.left = 0
                            styleObj.right = 0
                            break
                        case 'bottom-left':
                            styleObj.bottom = 0
                            styleObj.left = 0
                            break
                        case 'bottom-right':
                            styleObj.bottom = 0
                            styleObj.right = 0
                            break
                        case 'top-right':
                            styleObj.top = 0
                            styleObj.right = 0
                            break
                        case 'top-left':
                            styleObj.top = 0
                            styleObj.left = 0
                            break
                    }
                }
                if (background) {
                    styleObj.background = `url(${background}) no-repeat center`
                    styleObj.backgroundSize = '100% 100%'
                }
                if (moduleAlign === 'center') {
                    styleObj.width = '1200px'
                    styleObj.marginLeft = 'auto !important'
                    styleObj.marginRight = 'auto !important'
                }
                if (height) {
                    styleObj.height = height.includes('px') ? height : height + 'px'
                }
                itemEl.data.styleObj = styleObj
                itemEl.data.moduleId = itemEl.id
                const newItem = Object.assign({}, itemEl, { component: defineAsyncComponent(()=> import(`@h5/modules/${itemEl.tag}/${itemEl.tag}.vue`)) })
                // const newItem = Object.assign({}, itemEl, { component: require(`@h5/modules/${itemEl.tag}/${itemEl.tag}.vue`).default })
                return newItem
            })
            list = list.filter(el => {
                if (el.data.linkComp) {
                    const parentComp = list.find(item => item.id === el.data.linkComp)
                    if (!parentComp) return false
                    if (parentComp.data.bindComp) {
                        parentComp.data.bindComp.push(el)
                    } else {
                        parentComp.data.bindComp = [el]
                    }
                }
                return !el.data.linkComp
            })
            return list
        },
        // 某些页面的默认模块
        defaultPageComp () {
            // const urlParams = this.urlParams
            // if (urlParams?.page_code?.toLowerCase() === 'Home'.toLowerCase()) {
            //     return require('../modules/fullBanner/fullBanner.vue').default
            // } else if (urlParams?.page_code?.toLowerCase() === 'PositionIndex'.toLowerCase()) {
            //     return require('./components/placeholder/position.vue').default
            // } else if (urlParams?.page_code?.toLowerCase() === 'RegisterSuccess'.toLowerCase()) {
            //     return require('./components/placeholder/registerSuccess.vue').default
            // } else if (urlParams?.page_code?.toLowerCase() === 'RegisterManul'.toLowerCase()) {
            //     return require('./components/placeholder/registerManul.vue').default
            // }
            // return require('./components/placeholder/registerManul.vue').default
        },
        // 首页全屏banner数据
        fullBannerData(){
            const empty = {
                data:{
                    items:[{
                        src:'',
                        href:''
                    }]
                }
            };
            const fullBanner = this.moduleList.find(el=>el.tag==='fullBanner')
            return fullBanner ? fullBanner : empty
        },
        // 首页全屏banner下的产品数据
        bannerProductsData(){
            const empty = {
                data:{
                    items:[{
                        src:'',
                        href:''
                    }]
                }
            };
            const module = this.moduleList.find(el=>el.tag==='bannerProducts')
            return module ? module : empty
        },
        // 首页HomeNotice下的产品数据
        homeNoticeData(){
            const empty = {
                data:{
                    items:[{
                        src:'',
                        href:''
                    }]
                }
            };
            const module = this.moduleList.find(el=>el.tag==='homeNotice')
            return module ? module : empty
        },
    },
    mounted () {
        window['preview'] = this
    },
    methods: {
        ...mapMutations({
            CHANGE_ACTIVATED: 'editor/CHANGE_ACTIVATED'
        }),
        onStart () {
            console.log('onStart', arguments)
        },
        onEnd (evt) {
            console.log('onEnd preview', evt, arguments)
            this.$store.commit('editor/CHANGE_INDEX_ELEMENT', {
                oldIndex: evt.oldIndex,
                newIndex: evt.newIndex,
            })

            // 修复notice组件被重新排序后内容不滚动的问题
            const noticeArr = this.$refs.draggable.$children && this.$refs.draggable?.$children.filter(el => el.$el.classList.contains('notice'))
            if(noticeArr){
                 noticeArr.forEach(el => {
                    el.refresh()
                })
            }
        },
        moduleClick (item, e) {
            console.log('click', item)
            e.preventDefault()
            this.CHANGE_ACTIVATED(item.id)
            return false
        }
    },
}
</script>

<style lang="scss">
@import '~@h5/style.scss';
@import '~@h5/font/iconfont.css';
@import '~@/sass/mixin.scss';
.headerImg,
.footerImg {
    margin: 0;
    vertical-align: top;
    filter: brightness(0.97);
}
.phoneBody {
    padding: 0 9px;
    background: url(./images/phoneBg.png) repeat-y;
    background-size: 100%;
    p {
        margin: 0;
        line-height: 1.4;
    }
}
.previewWrapper {
    width: 375px;
    margin: 0 auto;
    overflow-x: hidden;
    font-size: 12px;
    background: #F1F1F1;
    &.pc{
        position: relative;
        width: 100%;
        // transform: scale(.8);
        transform-origin: center top;
        .phoneBody{
            background: #fff;
        }
    }
    img {
        vertical-align: top;
    }
}
.active {
    position: relative;
    &::after {
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border: 2px solid rgba($color: #155BD4, $alpha: 0.5);
        content: '';
    }
}
.riseColor {
    color: #10B873 !important;
}
.fallColor {
    color: #E3525C !important;
}
.drawing-board>div {
    position: relative;
    min-height: 15px;
    &::after {
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        content: '';
    }
}
</style>
