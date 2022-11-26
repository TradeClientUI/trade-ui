<template>
    <div class='m-product'>
        <el-form-item :label='config.label'>
            <div>
                <el-button v-for='trade in tradeTypeList' :key='trade.id' type='text' @click='showDialog(trade.id)'>
                    {{ trade.name }}
                </el-button>
                <!-- <el-input
                    :model-value='showNum'
                    placeholder='请选择'
                    readonly
                /> -->
            </div>
        </el-form-item>
        <el-drawer
            v-model='show'
            :before-close='handleClose'
            direction='rtl'
            show-close
            title='我是标题'
            :with-header='false'
            @opened='opened'
        >
            <div class='input'>
                <el-input
                    v-model='filterText'
                    clearable
                    placeholder='请输入关键字筛选'
                    @input='handleInput'
                />
            </div>
            <el-button-group class='bottoms'>
                <el-button type='primary' @click='checkAll'>
                    全选
                </el-button>
                <el-button
                    type='primary'
                    @click='cancelCheck'
                >
                    取消选择
                </el-button>
            </el-button-group>
            <el-scrollbar class='product-scrollbar'>
                <el-tree
                    ref='tree'
                    v-loading='treeLoading'
                    :check-on-click-node='true'
                    class='tree'
                    :data='tradeTypeAccountGroupProduct'
                    :filter-node-method='filterNode'
                    node-key='id'
                    :props='props'
                    show-checkbox
                />
            </el-scrollbar>
        </el-drawer>
    </div>
</template>

<script>
import { forOwn, forEach, isPlainObject, flatten } from 'lodash'
import { tradeTypeAccountGroupSymbol } from '@index/Api/editor'
export default {
    name: 'Product',
    props: {
        config: {
            type: Object,
            default () {
                return {}
            }
        },
        elementTag: {},
        activeBlock: {},
        blockIndex: {},
        selfSymbol: {},
        tradeTypeCollect: {},
        activeData: {
            type: Object,
        }
    },
    data () {
        return {
            props: {
                isLeaf: 'leaf',
                label: 'label',
                children: 'children',
                disabled (data, node) {
                    return !node.childNodes.length && !/[0-9]+_[0-9]+/.test(data.id)
                }
            },
            show: false,
            treeLoading: false,
            filterText: '',
            activeTradeType: '',
            treeDefaultOpenKeys: [],
            defaultCheckedKeys: [],
            tradeTypeAccountGroupProduct: [],
        }
    },
    computed: {
        tradeTypeList () {
            return this.$store.state.editor.tradeTypeList
        },
        accountGroupProduct () {
            return this.$store.state.editor.accountGroupProduct
        },
        tradeTypeProduct () {
            // console.log('--activeBlock---', this.activeBlock)
            return this.$store.state.editor.tradeTypeBlockProduct
        },
        getProducting () {
            return this.$store.state.editor.getProducting
        },
        showNum () {
            if (this.idsNum > 0) {
                return `已选择${this.idsNum}个产品`
            } else {
                return ''
            }
        },
        productIds () {
            const _ids = []
            for (const key in this.activeData) {
                if (this.activeData[key] && key !== 'tradeTypeCollect') {
                    this.activeData[key].forEach(item => {
                        _ids.push(key + '_' + item)
                    })
                }
            }
            return _ids
        },
        idsNum () {
            return this.productIds.length
        },
        activated () {
            return this.$store.state.editor.activated
        }
    },
    created () {
        this.initView()
    },
    methods: {
        cancelCheck () {
            this.$refs.tree.setCheckedKeys([])
        },
        checkAll () {
            this.$refs.tree.setCheckedKeys((this.tradeTypeProduct[this.activeTradeType] || []).map(item => (item.id)))
        },
        // async initView () {
        //     this.treeLoading = true
        //     if (this.accountGroupProduct.length <= 0 && !this.getProducting) {
        //         this.$store.commit('editor/UPDATE_GET_PRODUCTING', true)
        //         const groupList = await this.getAccountGroup()
        //         const symbolList = await querySymbolGroup()
        //         const productList = await this.getProductList(groupList.map(item => (item.id)).join(','))

        //         /*
        //         groupList.forEach(item => {
        //             item.children  = [...(symbolList.data || [])].map(e => {
        //                 return {
        //                     // ...e,
        //                     label: e.name,
        //                     id: item.id+ '.' + e.id,
        //                     rawId: e.id
        //                 }
        //             })
        //         })

        //         // 生成树
        //         for (let key in productList) {
        //             const otherProducts = []
        //             let dataList = productList[key]
        //             const matchGroup = groupList.find(e => e.id === key)

        //             if(matchGroup && dataList.length){
        //                 // 货币列表
        //                 dataList.forEach((item) => {
        //                     const symbolGroupIds = item.symbol_group_ids.split(',').filter(n => n)

        //                     const child = {
        //                         id: matchGroup.id + '_' + item.id,
        //                         label: `${item.name}[${item.id}](${item.code})`,
        //                         rawId: item.id,
        //                         leaf: true
        //                     }

        //                     if(symbolGroupIds.length){
        //                         // 产品类别
        //                         symbolGroupIds.forEach(sid => {
        //                             // 账户类别
        //                             const target = matchGroup.children.find(e=>e.rawId === sid)
        //                             if(target){
        //                                 (target.children || (target.children=[])).push(child)
        //                             }
        //                         })
        //                     } else {
        //                         otherProducts.push(child)
        //                     }
        //                 })
        //             }

        //             matchGroup.children.push({
        //                 label: '其他',
        //                 id: matchGroup.id+ '.' + 'other',
        //                 children: otherProducts
        //             })
        //         }

        //         // 过滤空产品组
        //         groupList.forEach(e => {
        //             e.children = e.children.filter(item => item.children)
        //         })
        //         */

        //         for (const key in productList) {
        //             const dataList = productList[key]
        //             const matchGroup = groupList.find(e => e.id === key)
        //             dataList.forEach((item) => {
        //                 if (!Array.isArray(matchGroup.children)) {
        //                     matchGroup.children = []
        //                 }
        //                 matchGroup.children.push({
        //                     id: matchGroup.id + '_' + item.id,
        //                     label: `${item.name}[${item.id}](${item.code})`,
        //                     rawId: item.id,
        //                     leaf: true
        //                 })
        //             })
        //         }

        //         this.$store.commit('editor/UPDATE_ACCOUNT_PRODUCT', groupList.filter(item => (item.children)))
        //         this.treeDefaultOpenKeys = groupList.map(item => (item.id))
        //     }
        //     this.treeLoading = false
        // },
        async initView () {
            this.treeLoading = true
            if (Object.keys(this.tradeTypeProduct).length === 0 && !this.getProducting) {
                this.$store.commit('editor/UPDATE_GET_PRODUCTING', true)
                // const groupList = await this.getAccountGroup()
                // const symbolList = await querySymbolGroup()
                const productList = await this.getProductList()
                // console.log('tradeTypeCollect---', this.tradeTypeCollect)
                /*
                groupList.forEach(item => {
                    item.children  = [...(symbolList.data || [])].map(e => {
                        return {
                            // ...e,
                            label: e.name,
                            id: item.id+ '.' + e.id,
                            rawId: e.id
                        }
                    })
                })

                // 生成树
                for (let key in productList) {
                    const otherProducts = []
                    let dataList = productList[key]
                    const matchGroup = groupList.find(e => e.id === key)

                    if(matchGroup && dataList.length){
                        // 货币列表
                        dataList.forEach((item) => {
                            const symbolGroupIds = item.symbol_group_ids.split(',').filter(n => n)

                            const child = {
                                id: matchGroup.id + '_' + item.id,
                                label: `${item.name}[${item.id}](${item.code})`,
                                rawId: item.id,
                                leaf: true
                            }

                            if(symbolGroupIds.length){
                                // 产品类别
                                symbolGroupIds.forEach(sid => {
                                    // 账户类别
                                    const target = matchGroup.children.find(e=>e.rawId === sid)
                                    if(target){
                                        (target.children || (target.children=[])).push(child)
                                    }
                                })
                            } else {
                                otherProducts.push(child)
                            }
                        })
                    }

                    matchGroup.children.push({
                        label: '其他',
                        id: matchGroup.id+ '.' + 'other',
                        children: otherProducts
                    })
                }

                // 过滤空产品组
                groupList.forEach(e => {
                    e.children = e.children.filter(item => item.children)
                })
                */
                const tradeTypeCustomerGroup = {}
                const tradeTypes = productList.map(el => ({ id: el.id, name: el.name }))
                forEach(productList, (value) => {
                    tradeTypeCustomerGroup[value.id] = Object.values(value.data).map((el) => {
                        const firstItem = Object.values(el)[0]
                        const { id, name, type, data } = firstItem

                        return {
                            id: id,
                            label: name,
                            type: type,
                            isGroup: true,
                            children: data.map(v => ({
                                id: id + '_' + v.symbolId,
                                label: `${v.name}[${v.symbolId}](${v.code})`,
                                rawId: v.id,
                                leaf: true
                            }))
                        }
                    })
                })
                this.$store.commit('editor/UPDATE_TRADETYPE_PRODUCT', tradeTypeCustomerGroup)
                this.$store.commit('editor/UPDATE_TRADETYPE_LIST', tradeTypes)
                // this.treeDefaultOpenKeys = groupList.map(item => (item.id))
            }
            this.treeLoading = false
        },
        filterNode (value, data) {
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },
        handleInput (val) {
            this.$refs.tree.filter(val)
        },
        // getAccountGroup () {
        //     return new Promise((resolve, reject) => {
        //         accountGroup()
        //             .then(res => {
        //                 if (!res.success) {
        //                     this.$message.error(res.message)
        //                     resolve([])
        //                     return
        //                 }
        //                 const groupList = (res.data || []).map(item => ({
        //                     id: item.id,
        //                     label: item.name,
        //                     type: item.type,
        //                     isGroup: true
        //                 }))
        //                 resolve(groupList)
        //             })
        //             .catch(error => {
        //                 console.log(error)
        //                 resolve([])
        //             })
        //     })
        // },
        getProductList (ids) {
            return new Promise((resolve, reject) => {
                // accountGroupSymbol(ids)
                //     .then(res => {
                //         if (!res.success) {
                //             this.$message.error(res.message)
                //             resolve({})
                //             return
                //         }
                //         if (!res.data) {
                //             resolve({})
                //             return
                //         }
                //         const _obj = {}
                //         res.data.forEach(item => {
                //             for (const key in item) {
                //                 if (item[key].length > 0) {
                //                     _obj[key] = item[key]
                //                 }
                //             }
                //         })
                //         resolve(_obj)
                //     })
                //     .catch(error => { console.log(error); resolve({}) })
                tradeTypeAccountGroupSymbol()
                    .then(res => {
                        if (!res.success) {
                            this.$message.error(res.message)
                            resolve({})
                            return
                        }
                        if (!res.data) {
                            resolve({})
                            return
                        }
                        resolve(res.data)
                    })
                    .catch(error => { console.log(error); resolve({}) })
            })
        },
        showDialog (type) {
            this.activeTradeType = type
            this.tradeTypeAccountGroupProduct = this.tradeTypeProduct[type]
            if (['selfSymbol', 'productsSwipe', 'productsTimeSharing', 'bannerProducts', 'productsWithIcon'].includes(this.elementTag)) {
                if (isPlainObject(this.selfSymbol[this.activated]?.[type])) {
                    const customerSelfSymbolIds = []
                    forOwn(this.selfSymbol[this.activated][type], (value, key) => {
                        customerSelfSymbolIds.push(value.map(v => (key + '_' + v)))
                    })
                    this.defaultCheckedKeys = flatten(customerSelfSymbolIds)
                } else {
                    this.defaultCheckedKeys = []
                }
            } else {
                if (isPlainObject(this.tradeTypeCollect[this.blockIndex]?.[type])) {
                    const customerGroupSymbolIds = []
                    forOwn(this.tradeTypeCollect[this.blockIndex][type], (value, key) => {
                        customerGroupSymbolIds.push(value.map(v => (key + '_' + v)))
                    })
                    this.defaultCheckedKeys = flatten(customerGroupSymbolIds)
                }
            }
            // store保存当前操作右侧表单的下标
            this.$store.commit('editor/UPDATE_ACTIVEINDEX', this.blockIndex)
            this.show = true
        },
        opened () {
            if (this.$refs.tree) {
                this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys)
            }
        },
        async handleClose (done) {
            // 计算出选中的结果
            const _data = this.$refs.tree.getCheckedKeys()
            const result = {}

            _data.forEach(id => {
                const match = id.match(/^([0-9]+)_([0-9]+)/)
                if (!match) {
                    return
                }
                const parentId = match[1]
                const productId = match[2]

                if (Array.isArray(result[parentId])) {
                    result[parentId].push(productId)
                } else {
                    result[parentId] = [productId]
                }
            })

            console.log('activeTradeType--', this.activeTradeType, this.activeBlock, this.tradeTypeCollect)
            this.$emit('formChange', result, this.activeTradeType)
            done()
        },
    }
}
</script>

<style lang="scss">
.m-product {
    height: 100%;
    .input {
        height: 60px;
        margin-top: 20px;
        padding: 20px;
        padding-bottom: 0;
    }
    .bottoms {
        padding: 20px;
    }
    .product-scrollbar {
        height: calc(100vh - 160px);
        padding: 0;
        overflow: hidden;
        .tree {
            min-height: 400px;
        }
    }
}

</style>
