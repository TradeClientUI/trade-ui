<template>
    <div class='wrapper'>
        <component
            :is='el.component'
            v-for='(el,index) in moduleList'
            :key='el.id'
            :data='el.data'
            @click.native='moduleClick(el, $event)'
            @openurl='openurl'
        >
            <div v-if='el.data.bindComp && el.data.bindComp.length'>
                <component :is='el.component' v-for='(el,i) in el.data.bindComp' :key="index+''+i+el.id" :data='el.data' />
            </div>
        </component>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        data: {
            type: Array,
            default: []
        },
    },
    computed: {
        ...mapGetters(['accountGroupId']),
        moduleList () {
            const { name, params } = this.$route
            const pageCode = name + '_' + (params.id || '')
            let list = this.data.map((item) => {
                const itemEl = JSON.parse(JSON.stringify(item))
                const { style, linkComp, linkCompPosition } = itemEl.data
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
                itemEl.data.styleObj = styleObj
                itemEl.data.moduleId = pageCode + '_' + itemEl.id
                const newItem = Object.assign({}, itemEl, { component: require(`../modules/${itemEl.tag}/${itemEl.tag}.vue`).default })
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
    },
    created () {
        this.subscriptProducts()
    },
    methods: {
        moduleClick () {
            console.log('moduleClick')
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
            console.log('subscriptProducts products', products)
            this.$ws.send_addSubscription_proList(products)
        }
    },
}
</script>

<style lang="scss"
       scoped>
.wrapper {
    &>div{
        background: #fff;
        position: relative;
    }
}
</style>
