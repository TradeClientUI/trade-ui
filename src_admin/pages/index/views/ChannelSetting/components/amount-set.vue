<template>
    <div>
        <el-form ref='form' class='form-module' label-width='200px'>
            <el-tabs v-model='depositStatus'>
                <el-tab-pane v-for='item in statusList' :key='item.label' :label='item.name' :name='item.label' />
            </el-tabs>
            <el-form-item :label="$t('channelSetting.settingOrder')">
                <el-row :gutter='gutter'>
                    <el-col v-for='(item, key) in depositData[depositStatus]' :key='depositStatus + key' class='sort-col' :span='span'>
                        <span class='label'>
                            {{ key }}
                        </span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item :label="$t('channelSetting.fixedAmount')">
                <el-row :gutter='gutter'>
                    <el-col v-for='(item, key) in depositData[depositStatus]' :key='depositStatus + key' :span='span'>
                        <el-input
                            v-model='item.amount'
                            clearable
                            maxlength='7'
                            :placeholder='placeholder_1'
                            type='number'
                        />
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item v-for='lang in langList' :key='lang.val' :label="$t('channelSetting.amountDescription')+ lang.name +')'">
                <el-row :gutter='gutter'>
                    <el-col v-for='(item, key) in depositData[depositStatus]' :key='depositStatus + key' :span='span'>
                        <el-input
                            v-model='item[lang.val].describe'
                            clearable
                            maxlength='15'
                            :placeholder='placeholder_2'
                        />
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { lang } from '@index/config/lang.js'
import { cloneDeep } from 'lodash'

export default {
    data () {
        return {
            // 语言列表
            langList: lang,
            // 每列间距
            gutter: 20,
            // 每列占位
            span: 3,
            // 占位符提示
            placeholder_1: this.$t('channelSetting.placeholder_1'),
            placeholder_2: this.$t('channelSetting.placeholder_2'),
            // 存款状态选项数据
            statusList: [
                { label: 'default', name: this.$t('channelSetting.default'), alias: 'isDefault' },
                { label: 'not', name: this.$t('channelSetting.undeposited'), alias: 'isNot' },
                { label: 'already', name: this.$t('channelSetting.deposited'), alias: 'isAlready' }
            ],
            // 当前存款状态
            depositStatus: '',
            // 存款数据
            depositData: {},
            // 固定金额输入框个数
            fixedNum: 5
        }
    },
    mounted () {
        // 初始化数据
        // this.initData()
    },
    methods: {
        // 初始化数据
        initData () {
            const data = {}
            const statusList = this.statusList
            const item = {}
            for (let i = 1; i <= this.fixedNum; i++) {
                item[i] = { amount: '' }
                lang.map(elem => {
                    item[i][elem.val] = { describe: '' }
                })
            }
            statusList.map(elem => {
                data[elem.label] = cloneDeep(item)
            })
            this.depositStatus = statusList[0].label
            this.depositData = cloneDeep(data)
        },

        // 设置存款数据
        setData (content) {
            const that = this
            if (content.depositData) {
                // 判断是否有新加语言
                for (const key in content.depositData) {
                    if (Object.hasOwnProperty.call(content.depositData, key)) {
                        if (['already', 'default', 'not'].includes(key)) {
                            const element = content.depositData[key]
                            for (const el in element) {
                                if (Object.hasOwnProperty.call(element, el)) {
                                    const obj = element[el]
                                    that.langList.forEach(lang => {
                                        if (!obj.hasOwnProperty(lang.val)) {
                                            obj[lang.val] = {
                                                describe: ''
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    }
                }

                this.depositData = cloneDeep(content.depositData)
            }
        },

        // 获取存款数据
        getData () {
            const depositData = this.depositData
            this.statusList.map(elem => {
                depositData[elem.alias] = false
                for (const key in depositData[elem.label]) {
                    const item = depositData[elem.label][key]
                    if (item.amount !== '') {
                        depositData[elem.alias] = true
                        break
                    }
                }
            })

            return depositData
        }
    }
}
</script>

<style lang="scss" scoped>
.form-module {
    .sort-col {
        text-align: center;
        .label {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            color: #FFF;
            background-color: #0D84FF;
            border-radius: 50%;
        }
    }
}

</style>>
