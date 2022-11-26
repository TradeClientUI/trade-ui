<template>
    <div class='previewWrapper' :class="{pc:isPC}">
        <p class='headerImg' v-if="!isPC">
            <img alt='' src='./images/phoneHeader.png' style='width: 100%;' />
        </p>
        <div class='phoneBody'>
            <component :is='defaultPageComp' v-if='defaultPageComp' />
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
                    <div @click='moduleClick(el, $event)'>
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

        <p class='footerImg' v-if="!isPC" >
            <img alt='' src='./images/phoneFooter.png' style='width: 100%;' />
        </p>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState, mapMutations } from 'vuex'
import { defineAsyncComponent } from 'vue'
import { getQuery } from '@utils/index'
export default {
    components: {
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
                const { style, linkComp, linkCompPosition, background } = itemEl.data
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
                    styleObj.background = `url(${background}) no-repeat`
                    styleObj.backgroundSize = '100% 100%'
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
            const urlParams = this.urlParams
            if (urlParams?.page_code?.toLowerCase() === 'SelfSymbolIndex'.toLowerCase()) {
                return require('./components/placeholder/selfSymbol.vue').default
            } else if (urlParams?.page_code?.toLowerCase() === 'PositionIndex'.toLowerCase()) {
                return require('./components/placeholder/position.vue').default
            } else if (urlParams?.page_code?.toLowerCase() === 'RegisterSuccess'.toLowerCase()) {
                return require('./components/placeholder/registerSuccess.vue').default
            } else if (urlParams?.page_code?.toLowerCase() === 'RegisterManul'.toLowerCase()) {
                return require('./components/placeholder/registerManul.vue').default
            }
            return require('./components/placeholder/registerManul.vue').default
        }
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
            console.log('onEnd', evt, arguments)
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
    >img {
        vertical-align: top;
    }
    .default-wrap{
        >img{
            width: 100%;
        }
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
    overflow: hidden;
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
