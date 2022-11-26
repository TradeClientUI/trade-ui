<template>
    <div class='pageComp'>
        <component
            :is='el.component'
            v-for='(el,index) in moduleList'
            :key="el.id+'_'+index"
            :data='el.data'
            :module-id='el.id'
            @click.capture='moduleClick(el, $event)'
            @openUrl='openUrl'
        >
            <div v-if='el.data.bindComp && el.data.bindComp.length'>
                <component :is='el.component' v-for='(o,i) in o.data.bindComp' :key="index+''+i+o.id" :data='o.data' :module-id='o.id' />
            </div>
        </component>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { defineAsyncComponent } from 'vue'
export default {
    props: {
        data: {
            type: Array,
            default () { return [] }
        },
    },
    computed: {
        ...mapGetters(['accountGroupId']),
        moduleList () {
            const { name, params } = this.$route
            const pageCode = name + '_' + (params.id || '')
            let list = this.data.map((item) => {
                const itemEl = JSON.parse(JSON.stringify(item))

                const { style, linkComp, linkCompPosition, background,moduleAlign,height } = itemEl.data
                const styleObj = {}
                for (const key in style) {
                    if (style.hasOwnProperty(key)) {
                        styleObj[key] = Number(style[key]) + 'px'
                    }
                }
                if (linkComp && linkCompPosition) {
                    Object.assign(styleObj, {
                        position: 'absolute',
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
                if(moduleAlign==='center'){
                    styleObj.width = '1200px';
                    styleObj.marginLeft = 'auto !important';
                    styleObj.marginRight = 'auto !important';
                }
                if(height){
                    styleObj.height = height.includes('px') ? height: height+'px';
                }
                itemEl.data.styleObj = styleObj
                itemEl.data.moduleId = pageCode + '_' + itemEl.id
                const newItem = Object.assign({}, itemEl, { component: defineAsyncComponent(() => import(`../modules/${itemEl.tag}/${itemEl.tag}.vue`)) })
                // const newItem = Object.assign({}, itemEl, { component: require(`../modules/${itemEl.tag}/${itemEl.tag}.vue`).default })

                return newItem
            })
            // 将绑定的组件插入到对应的模块下面
            const linkCompList = list.filter(el => el.data.linkComp).map(el => {
                const parentComp = list.find(item => item.id === el.data.linkComp)
                if (!parentComp) return el
                if (parentComp.data.bindComp) {
                    parentComp.data.bindComp.push(el)
                } else {
                    parentComp.data.bindComp = [el]
                }
                return el
            })
            // 过滤出没有绑定的组件，给页面遍历生成模块
            list = list.filter(el => !el.data.linkComp)
            return list
        },
    },
    created () {
        // this.subscriptProducts();
    },
    methods: {
        moduleClick (data, $event) {
            if (typeof (this.$parent.moduleClick) === 'function') {
                this.$emit('moduleClick', data, $event)
                $event.stopPropagation()
            }
            // console.log('moduleClick',data, $event)
        },
        // 订阅产品
        subscriptProducts () {
            if (this.data.length === 0) return false
            const products = []
            const accountGroupId = this.accountGroupId
            this.data.forEach(el => {
                if (el.tag === 'quote') {
                    let p = el.data.product || {}
                    p = p[accountGroupId]
                    if (!p || !accountGroupId) return
                    const arr = p.map(q => Number(q))
                    products.push(...arr)
                }
            })

            if (products.length) console.log('pageComp subscriptProducts', products), this.$ws.send_addSubscription_proList(products)
        },

    },
}
</script>

<style lang="scss"
       scoped>
.pageComp {
    &>div {
        position: relative;
        background: var(--contentColor);
    }
}
</style>
