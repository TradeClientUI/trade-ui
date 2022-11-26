<template>
    <div class='m-setting'>
        <el-row class='setting-header'>
            <!-- <el-col :span='12'>
                <div class='toPages'>
                    <i class='el-icon-back'></i>
                    <span @click='toPage'>
                        页面列表
                    </span>
                </div>
            </el-col> -->

            <el-col class='btns' :span='24'>
                <el-button-group>
                    <el-button
                        icon='el-icon-s-promotion'
                        :loading='submitLoading'
                        type='primary'
                        @click='submit'
                    >
                        {{ $t('channelSetting.save') }}
                    </el-button>

                    <el-button
                        :disabled='getLoading'
                        icon='el-icon-refresh'
                        type='primary'
                        @click='getPageConfig'
                    >
                        {{ $t('channelSetting.reset') }}
                    </el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <el-row>
            <el-col class='btns' :span='24'>
                <el-form ref='form' label-width='180px' :model='form' :rules='rules'>
                    <el-tabs v-model='optionName' type='border-card' @tab-click='changeTabs'>
                        <el-tab-pane class='tab' :label="$t('channelSetting.basicSetting')" name='first'>
                            <el-form-item
                                :label="$t('channelSetting.registerableCode')"
                                prop='registrable'
                            >
                                <el-select
                                    v-model='form.registrable'
                                    collapse-tags
                                    multiple
                                    :placeholder="$t('pleaseEnter')"
                                    value-key='id'
                                    @change='changeSupportArea'
                                >
                                    <el-option
                                        v-for='(item) in zoneList'
                                        :key='item.id'
                                        :label='item.name+" ("+item.country_code+")"'
                                        :value='item'
                                    />
                                </el-select>
                                <el-popover
                                    :content="$t('channelSetting.tip1')"
                                    placement='top-start'
                                    trigger='hover'
                                    :width='200'
                                >
                                    <template #reference>
                                        <img alt='' class='img-tip' src='../../../../imgs/tip.png' />
                                    </template>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                :label="$t('channelSetting.defaultAreaCode')"
                                prop='defaultZone'
                            >
                                <el-select
                                    v-model='form.defaultZone'
                                    :placeholder="$t('pleaseEnter')"
                                    value-key='country_code'
                                >
                                    <el-option
                                        v-for='(item) in otherZoneList'
                                        :key='item.id'
                                        :label='item.name+" ("+item.country_code+")"'
                                        :value='item'
                                    />
                                </el-select>
                            </el-form-item>

                            <el-form-item
                                v-for='(item,index) in form.registList'
                                :key='item.id'
                                :label='index === 0 ? $t("channelSetting.countryRegistration") : ""'
                                prop='registList'
                            >
                                <el-row>
                                    <el-col :span='6'>
                                        <el-select
                                            v-model='form.registList[index].registCountry'
                                            clearable
                                            :disabled='form.registList[index].registCountry?.isOther'
                                            filterable
                                            :placeholder="$t('channelSetting.selectCountry')"
                                            value-key='id'
                                            @focus='countryChange'
                                        >
                                            <el-option
                                                v-for='country in registZoneList'
                                                :key='country'
                                                :disabled='country.disabled'
                                                :label='country.name'
                                                :value='country'
                                            />
                                        </el-select>
                                    </el-col>
                                    <el-col :span='7'>
                                        <label class='label' for=''>
                                            {{ $t('channelSetting.customerGroup') }}
                                        </label>
                                        <el-select
                                            v-model='form.registList[index].customerGroupId'
                                            clearable
                                            :placeholder="$t('channelSetting.selectCustomerGroup')"
                                            @change='customerChange(index)'
                                        >
                                            <el-option
                                                v-for='el in accountTradeList'
                                                :key='el.id'
                                                :disabled='el.disabled'
                                                :label='el.name'
                                                :value='el.id'
                                            />
                                        </el-select>
                                        <el-popover
                                            :content="$t('channelSetting.content1')"
                                            placement='top-start'
                                            trigger='hover'
                                            :width='200'
                                        >
                                            <template #reference>
                                                <img alt='' class='img-tip' src='../../../../imgs/tip.png' />
                                            </template>
                                        </el-popover>
                                    </el-col>
                                    <el-col :span='6'>
                                        <!-- <el-button :disabled='form.registList[index].disabledSetCurrency' type='primary' @click='setPlans(item,index,1)'>
                                            {{ $t('channelSetting.setCurrency') }}
                                        </el-button> -->
                                        <el-button v-if='index === 0' type='primary' @click='addFormItem'>
                                            {{ $t('channelSetting.add') }}
                                        </el-button>
                                        <el-button v-else type='danger' @click='removeItem(index)'>
                                            {{ $t('editor.delete') }}
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>

                            <el-form-item :label="$t('channelSetting.spotAsWallet')">
                                <el-checkbox v-model='form.isWallet' class='checkBox' :indeterminate='false' label='' />
                                <el-popover
                                    :content="$t('channelSetting.content2')"
                                    placement='top-start'
                                    trigger='hover'
                                    :width='200'
                                >
                                    <template #reference>
                                        <img alt='' class='img-tip' src='../../../../imgs/tip.png' />
                                    </template>
                                </el-popover>
                            </el-form-item>

                            <!-- <el-form-item label='游客客户组'>
                                <el-row>
                                    <el-col :span='6'>
                                        <el-select
                                            v-model='form.customerGroupId'
                                            clearable
                                            placeholder='请选择客户组'
                                        >
                                            <el-option
                                                v-for='el in accountTradeList'
                                                :key='el.id'
                                                :label='el.name'
                                                :value='el.id'
                                            />
                                        </el-select>
                                    </el-col>
                                    <el-col :span='8'>
                                        <el-button type='primary' @click='setPlans(item,index,2)'>
                                            设置玩法别名
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item> -->

                            <el-form-item
                                :label="$t('channelSetting.h5SupportLang')"
                                prop='supportLanguage'
                            >
                                <el-select
                                    v-model='form.supportLanguage'
                                    multiple
                                    :placeholder="$t('pleaseEnter')"
                                    style='width: 500px;'
                                    value-key='val'
                                    @change='changeSupportLanguage'
                                >
                                    <el-option
                                        v-for='item in lang'
                                        :key='item.val'
                                        :label='item.name'
                                        :value='item'
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                :label="$t('channelSetting.h5DefaultLang')"
                                prop='language'
                            >
                                <el-select
                                    v-model='form.language'
                                    :placeholder="$t('pleaseEnter')"
                                    style='width: 500px;'
                                    value-key='name'
                                >
                                    <el-option
                                        v-for='item in filterLang'
                                        :key='item.val'
                                        :label='item.name'
                                        :value='item'
                                    />
                                </el-select>
                            </el-form-item>

                            <el-form-item v-if='configLoaded ' :label="$t('channelSetting.openAccountNotice1')" prop='instructions_zh'>
                                <Tinymce
                                    v-model='form.instructions_zh'
                                    :height='120'
                                    :toolbar="['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat hr', 'fullscreen bullist numlist link table forecolor backcolor fontsizeselect']"
                                    :width='800'
                                />
                            </el-form-item>
                            <el-form-item v-if='configLoaded ' :label="$t('channelSetting.openAccountNotice2')" prop='instructions_en'>
                                <Tinymce
                                    v-model='form.instructions_en'
                                    :height='120'
                                    :toolbar="['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat hr', 'fullscreen bullist numlist link table forecolor backcolor fontsizeselect']"
                                    :width='800'
                                />
                            </el-form-item>
                            <el-form-item v-if='configLoaded ' :label="$t('channelSetting.openAccountNotice3')" prop='instructions_hk'>
                                <Tinymce
                                    v-model='form.instructions_hk'
                                    :height='120'
                                    :toolbar="['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat hr', 'fullscreen bullist numlist link table forecolor backcolor fontsizeselect']"
                                    :width='800'
                                />
                            </el-form-item>
                            <el-form-item :label="$t('channelSetting.worthMentioning')">
                                <el-checkbox-group v-model='form.thirdLogin'>
                                    <el-checkbox label='google'>
                                        Google
                                    </el-checkbox>
                                    <el-checkbox label='facebook'>
                                        Facebook
                                    </el-checkbox>
                                    <el-checkbox disabled label='twitter'>
                                        Twitter
                                    </el-checkbox>
                                    <el-checkbox label='telegram'>
                                        Telegram
                                    </el-checkbox>
                                    <el-checkbox label='apple'>
                                        apple
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <!-- 支持手机、邮箱注册 -->
                            <!-- <el-form-item :label="$t('channelSetting.registerTypes')">
                                <el-checkbox-group v-model='form.registerTypes'>
                                    <el-checkbox label='mobile'>
                                        {{ $t('channelSetting.mobile') }}
                                    </el-checkbox>
                                    <el-checkbox label='email'>
                                        {{ $t('channelSetting.email') }}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-form-item> -->
                            <!-- <el-form-item class='registerBanner' label='注册页banner'>
                                <div class='upload' @click='uploadRegitserBannerFile()'>
                                    <div v-if='form.registerBanner' class='img-wrap'>
                                        <img alt='' :src='form.registerBanner' />
                                    </div>
                                    <div v-else>
                                        <i class='el-icon-plus'></i>
                                        <p>点击上传图片</p>
                                    </div>
                                </div>
                            </el-form-item> -->

                            <el-form-item v-if='!isPC' :label="$t('channelSetting.themeColor')" prop='themeColor'>
                                <el-color-picker v-model='form.themeColor' :predefine='predefineColors' />
                            </el-form-item>
                            <el-form-item :label="$t('channelSetting.buriedPointCode')">
                                <el-input
                                    v-model='form.googleAnalytics'
                                    :placeholder="$t('pleaseEnter')"
                                    row='10'
                                    type='textarea'
                                />
                            </el-form-item>
                            <el-form-item :label="$t('channelSetting.onlineCustomerAddress')">
                                <el-input
                                    v-model='form.onlineService'
                                    :placeholder="$t('pleaseEnter')"
                                    type='textarea'
                                />
                            </el-form-item>

                            <!-- <el-form-item label='H5地址'>
                                <el-input
                                    v-model='form.h5Address'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='H5预览地址'>
                                <el-input
                                    v-model='form.h5PreviewAddress'
                                    placeholder='请输入'
                                />
                            </el-form-item> -->
                        </el-tab-pane>
                        <el-tab-pane class='tab pay-channel-setting' :label="$t('channelSetting.paymentChannelIconSet')" name='second'>
                            <el-row :gutter='20'>
                                <el-col :offset='0' :span='24'>
                                    <el-tabs v-model='activeName'>
                                        <el-tab-pane v-for='(item,index) in pyamentList' :key='index' :label='item.paymentName'>
                                            <el-card class='box-card'>
                                                <template #header>
                                                    <span class='tip'>
                                                        {{ $t('channelSetting.tip2') }}
                                                    </span>
                                                </template>
                                                <div class='lang-wrap'>
                                                    <el-row v-for='(l, i) in lang' :key='i' align='middle' :gutter='20'>
                                                        <el-col :offset='0' :span='3'>
                                                            <h4>{{ l.name }}</h4>
                                                        </el-col>
                                                        <el-col :offset='0' :span='6'>
                                                            <div class='upload' @click='uploadFile(item,l)'>
                                                                <div v-if='form.paymentIconList[item.paymentCode+"_"+item.paymentType+"_"+item.merchantNo][l.val]?.imgUrl' class='img-wrap'>
                                                                    <img alt='' :src='form.paymentIconList[item.paymentCode+"_"+item.paymentType+"_"+item.merchantNo][l.val]?.imgUrl' />
                                                                </div>
                                                                <div v-else>
                                                                    <i class='el-icon-plus'></i>
                                                                    <p>{{ $t('channelSetting.clickUpload') }}</p>
                                                                </div>
                                                            </div>
                                                        </el-col>
                                                        <el-col :offset='0' :span='14'>
                                                            <el-form-item :label="$t('channelSetting.paymentChannelAlias')">
                                                                <el-input v-model='form.paymentIconList[item.paymentCode+"_"+item.paymentType+"_"+item.merchantNo][l.val].alias' class='alias-input' clearable :placeholder="$t('channelSetting.enterChannelAlias')" />
                                                                <el-button type='primary' @click='resetPayment(item,l)'>
                                                                    {{ $t('channelSetting.reset') }}
                                                                </el-button>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-divider />
                                                    </el-row>
                                                </div>
                                            </el-card>
                                        </el-tab-pane>
                                    </el-tabs>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane class='tab' :label="$t('channelSetting.interfaceSettings')" name='third'>
                            <amount-set ref='amountSet' />
                        </el-tab-pane>
                        <el-tab-pane v-loading='fourthLoading' class='tab' :label="$t('channelSetting.tradeTypeNameSetting')" name='fourth' style='padding-right: 100px;'>
                            <el-row :gutter='24' style='justify-content: flex-start;'>
                                <el-col :span='3'>
                                    <el-form-item />
                                </el-col>
                                <el-col v-for='(val,key,index) in tradeTypesTemplate' :key='index' :span='4'>
                                    <el-form-item label-width='0'>
                                        <p style='text-align: center;'>
                                            {{ $t('channelSetting.tradeTypes'+key) }}
                                        </p>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row v-for='(outVal,outKey,outIndex) in form.tradeTypesConfig' :key='outIndex' :gutter='24' style='justify-content: justify-content;'>
                                <el-col :span='3'>
                                    <p class='lang-label'>
                                        {{ outKey }}
                                    </p>
                                </el-col>
                                <el-col v-for='(innerVal,innerKey,innerIndex) in outVal' :key='innerIndex' :span='4'>
                                    <el-form-item label-width='0' :prop='innerVal'>
                                        <el-input
                                            v-model='form.tradeTypesConfig[outKey][innerKey]'
                                            :placeholder="$t('pleaseEnter')"
                                        />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
            </el-col>
        </el-row>
        <el-dialog
            v-model='plansDialogVisible'
            :title="$t('channelSetting.tradeType')"
            width='60%'
            @close='closeDialog'
        >
            <el-form
                label-position='right'
                label-width='110px'
            >
                <div v-for='item in tradeTypeAssets' :key='item.id' class='tradeType-row'>
                    <el-card :header='item.name' shadow='always'>
                        <template v-if='setPlansType === 1'>
                            <template v-if="['1','2'].indexOf(item.id)>-1">
                                <el-form-item :label="$t('channelSetting.tradeType')">
                                    <el-select
                                        v-model='checkedTradeType[item.id].allCurrency'
                                        clearable
                                        filterable
                                        :placeholder="$t('pleaseChoose')"
                                    >
                                        <el-option
                                            v-for='asset in item.assetsList'
                                            :key='asset.key'
                                            :label='`${asset.label}`'
                                            :value='asset.key'
                                        />
                                    </el-select>
                                    <p class='notice'>
                                        {{ Number(item.id) === 1 ? $t('channelSetting.tip3'): $t('channelSetting.tip4') }}
                                    </p>
                                </el-form-item>
                                <el-form-item label='' />
                            </template>
                            <template v-else>
                                <el-transfer
                                    v-model='checkedTradeType[item.id].allCurrency'
                                    :data='item.assetsList'
                                    :titles='[$t("channelSetting.optionalCurrency"), $t("channelSetting.selectedCurrency")]'
                                />
                            </template>
                        </template>

                        <!-- <el-form-item class='sort-row' label='玩法别名'>
                            <el-input
                                v-model='checkedTradeType[item.id].alias'
                                placeholder='请输入'
                                size='medium '
                                type='text'
                            />
                        </el-form-item>
                        <el-form-item class='sort-row' label='排序值(升序)'>
                            <el-input-number
                                v-model.number='checkedTradeType[item.id].sort'
                                controls-position='right'
                                placeholder='请输入'
                            />
                        </el-form-item>
                        <el-form-item v-if="item.id==='5'" class='sort-row' label='是否当钱包使用'>
                            <el-checkbox v-model='checkedTradeType[item.id].isWallet'>
                                是
                            </el-checkbox>
                        </el-form-item> -->
                    </el-card>
                </div>
            </el-form>
            <template #footer>
                <span class='dialog-footer'>
                    <el-button @click='plansDialogVisible = false'>
                        {{ $t('cancel') }}
                    </el-button>
                    <el-button type='primary' @click='handleSavePlans'>
                        {{ $t('sure') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { getAccountGroupTradeAssetsList, queryCountryList, getViChannel, saveViChannel, queryPaymentArray, tradeTypeAccountGroupSymbol } from '@index/Api/editor'
import { lang } from '../../config/lang'
import { getQueryString } from '@admin/utils'
import { cloneDeep, escape, unescape } from 'lodash'
import { isEmpty, localGet } from '@/utils/util'
import Tinymce from '@index/components/Tinymce'
// components
import amountSet from './components/amount-set.vue'

export default {
    name: 'ChannelSetting',
    components: {
        amountSet,
        Tinymce
    },
    data () {
        return {
            configLoaded: false,
            optionName: 'first', // 当前选项卡
            isPC: process.env.VUE_APP_theme === 'plans_PCUI',
            form: {
                tradeTypeCurrencyList: [],
                thirdLogin: [],
                registerTypes: [],
                // registerBanner: '',
                instructions_zh: '', // 开户须知
                instructions_en: '', // 开户须知
                instructions_hk: '',
                googleAnalytics: '',
                h5Address: '',
                h5PreviewAddress: '',
                defaultZone: {},
                themeColor: '#2B70AE',
                registList: [{}],
                onlineService: '',
                supportLanguage: [],
                customerGroupId: '',
                registrable: [],
                isWallet: false,
                paymentIconList: {}, // 支付通道图标列表
                tradeTypesConfig: {
                    'zh-CN': {},
                    'en-US': {},
                    'zh-HK': {}
                }
            },
            tradeTypesTemplate: {},
            accountTradeList: [],
            lang,
            filterLang: [],
            supportArea: [],
            zoneList: [],
            otherZoneList: [],
            registZoneList: [],
            plansDialogVisible: false,
            activeName: '0',
            tradeTypeList: [],
            checkedTradeType: {},
            tradeTypeAssets: [],
            submitLoading: false,
            pageId: '',
            curIndex: '', // 注册客户组当前操作项
            getLoading: false,
            setPlansType: 1, // 1 注册客户组玩法 2 游客客户组 3 非默认客户组
            pyamentList: [],
            payIcon: {},
            rules: {
                supportLanguage: [
                    {
                        required: true,
                        message: this.$t('channelSetting.error1'),
                        trigger: 'blur',
                    },

                ],
                language: [
                    {
                        required: true,
                        message: this.$t('channelSetting.error2'),
                        trigger: 'blur',
                    }
                ],
                registList: [
                    {
                        required: true,
                        message: this.$t('channelSetting.error3'),
                        trigger: 'blur',
                    }
                ],
            },
            predefineColors: [
                '#477fd3',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                'rgba(255, 69, 0, 0.68)',
                'rgb(255, 120, 0)',
                'hsv(51, 100, 98)',
                'hsva(120, 40, 94, 0.5)',
                'hsl(181, 100%, 37%)',
                'hsla(209, 100%, 56%, 0.73)',
                '#c7158577',
            ],
            fourthLoading: true
        }
    },
    computed: {
        currentLang () {
            return localGet('lang')
        }
    },
    async created () {
        // const locales = require.context('../../i18n', true, /[A-Za-z0-9-_,\s]+\.json$/i).keys()
        // console.log("locales",locales)

        this.pageId = await getQueryString('id')
        await this.queryCountryList()
        await this.queryAccountGroupTradeList()
        await this.getPageConfig()
        await this.getPaymentArray()
        await this.$refs['amountSet'].initData()
    },
    methods: {
        changeTabs (val) {
            if (val.index == 3) {
                this.getTradeTypeAccountGroupSymbol()
            }
        },
        getTradeTypeAccountGroupSymbol () {
            const that = this
            tradeTypeAccountGroupSymbol()
                .then(res => {
                    if (!res.success) {
                        this.fourthLoading = false
                        that.$message.error(res.message)
                        return
                    }
                    if (!res.data) {
                        this.fourthLoading = false
                        return
                    }
                    that.tradeTypesTemplate = {}
                    res.data.forEach(el => {
                        that.tradeTypesTemplate[el.id] = ''
                    })
                    // 根据获取到得玩法过滤回显得数据
                    const targetKeys = Object.keys(that.tradeTypesTemplate)
                    const langKeys = Object.keys(that.form.tradeTypesConfig)

                    // 动态添加语言对应的玩法别名
                    that.lang.forEach(el => {
                        if (!langKeys.includes(el.val)) {
                            that.form.tradeTypesConfig[el.val] = {}
                        }
                    })

                    that.lang.forEach(el => {
                        if (Object.keys(that.form.tradeTypesConfig[el.val]).length) {
                            // tradeTypesConfig中多于配置返回的玩法删除
                            for (const key in that.form.tradeTypesConfig[el.val]) {
                                if (!targetKeys.includes(key)) {
                                    delete that.form.tradeTypesConfig[el.val][key]
                                }
                            }
                            // tradeTypesConfig中没有的配置返回的玩法加上
                            const tradeTypesConfigChildKeys = Object.keys(that.form.tradeTypesConfig[el.val])
                            targetKeys.forEach(item => {
                                if (!tradeTypesConfigChildKeys.includes(item)) {
                                    that.form.tradeTypesConfig[el.val][item] = ''
                                }
                            })
                        } else {
                            that.form.tradeTypesConfig[el.val] = JSON.parse(JSON.stringify(that.tradeTypesTemplate))
                        }
                    })
                    this.fourthLoading = false
                })
                .catch(error => {
                    console.log(error)
                    this.fourthLoading = false
                })
        },
        getPageConfig () {
            this.getLoading = true
            const that = this
            getViChannel(this.pageId).then(res => {
                if (!res.success) {
                    that.$message.error(res.message)
                    return
                }
                that.configLoaded = true
                let content = res.data.content ? JSON.parse(res.data.content) : {}
                content = Object.prototype.toString.call(content) === '[object Object]' ? content : {}
                if (content.instructions_zh) {
                    content.instructions_zh = decodeURIComponent(content.instructions_zh)
                }
                if (content.instructions_en) {
                    content.instructions_en = decodeURIComponent(content.instructions_en)
                }
                if (content.instructions_hk) {
                    content.instructions_hk = decodeURIComponent(content.instructions_hk)
                }

                that.filterLang = content.supportLanguage
                console.log('渠道配置', content)

                // 设置存款数据
                this.$refs['amountSet'].setData(content)
                // this.$refs['editor'].setContent(content.instructions)
                const other = res.data.other && res.data.other.indexOf('{') === 0 ? JSON.parse(res.data.other) : {}
                that.form = Object.assign(that.form, content, { other })

                if (that.form.googleAnalytics) { that.form.googleAnalytics = window.unzip(that.form.googleAnalytics) }

                // 如果未保存，写入默认值
                if (!that.form.customerGroupId) {
                    that.form.customerGroupId = '2'
                }

                const defaultLang = this.lang.filter(el => el.isDefault)
                if (that.form.supportLanguage.length === 0) {
                    that.form.supportLanguage = defaultLang
                    that.filterLang = defaultLang
                }
                if (!that.form.language) {
                    that.form.language = defaultLang?.[0]
                }

                if (!that.form.registList[0].customerGroupId) {
                    that.form.registList[0].customerGroupId = '1'
                }

                that.otherZoneList = that.form.registrable
                this.registZoneList = that.otherZoneList.concat(
                    {
                        id: 9999,
                        isOther: true,
                        name: '全部',
                    }
                )
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.getLoading = false
            })
        },
        queryAccountGroupTradeList () {
            getAccountGroupTradeAssetsList().then(res => {
                if (res.success && res.data) {
                    Object.values(res.data).forEach(el => {
                        if (Number(el.id) === 2) {
                            el.disabled = true
                        }
                    })
                    this.accountTradeList = res.data
                    // console.log('this.accountTradeList', this.accountTradeList)
                }
            })
        },
        changeSupportLanguage (val) {
            this.filterLang = this.lang.filter(el => val.find(zo => zo.val === el.val))
        },
        changeSupportArea (val) {
            this.otherZoneList = this.zoneList.filter(el =>
                val.find(zo => zo.id === el.id)
            )
            this.registZoneList = this.otherZoneList.concat(
                {
                    id: 9999,
                    isOther: true,
                    name: '全部',
                }
            )
            this.form.defaultZone = ''
            // this.otherZoneList = this.zoneList.filter(el => val.includes(el.name + ' (' + el.country_code + ')'))
        },
        // 获取支付通道
        getPaymentArray () {
            const that = this
            queryPaymentArray().then(res => {
                if (res.success && res.data) {
                    that.pyamentList = res.data
                    if (that.pyamentList.length > 0) {
                        that.pyamentList.forEach(el => {
                            const uniqueKey = el.paymentCode + '_' + el.paymentType + '_' + el.merchantNo
                            console.log('that.form.paymentIconList====', that.form.paymentIconList)

                            if (isEmpty(that.form.paymentIconList[uniqueKey])) {
                                that.form.paymentIconList[uniqueKey] = {}
                                that.lang.forEach(lang => {
                                    that.form.paymentIconList[uniqueKey][lang.val] = {
                                        alias: '',
                                        imgUrl: ''
                                    }
                                })
                                console.log('paymentIconList====', that.form.paymentIconList)
                            } else {
                                // 动态添加语言对应的玩法别名
                                const langKeys = Object.keys(that.form.paymentIconList[uniqueKey])
                                that.lang.forEach(el => {
                                    if (!langKeys.includes(el.val)) {
                                        that.form.paymentIconList[uniqueKey][el.val] = {
                                            alias: '',
                                            imgUrl: ''
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            })
        },
        // 获取国家区号列表
        queryCountryList () {
            const that = this
            queryCountryList().then(res => {
                if (res.success && res.data?.length) {
                    const list = res.data.filter(el => el.country_code)
                    that.zoneList = list
                    // this.otherZoneList = list
                    if (that.form.registrable.length === 0) {
                        that.form.registrable = [list[0]]
                        this.form.defaultZone = that.form.registrable[0]

                        // 默认第一个是其它
                        if (!that.form.registList[0].registCountry) {
                            that.form.registList[0].registCountry =
                                {
                                    id: 9999,
                                    isOther: true,
                                    name: '全部',
                                }
                        }
                    }
                }
            })
        },
        setPlans (item, index, type) {
            this.setPlansType = type
            this.curIndex = index
            let data = []

            if (type === 1) {
                if (Number(item.customerGroupId) !== 1) {
                    // 只有默认客户组才可以设置币种
                    this.setPlansType = 3
                }
                if (item.registCountry && item.customerGroupId) {
                    this.plansDialogVisible = true
                    data = this.accountTradeList[item.customerGroupId]?.data
                    this.checkedTradeType = this.form.registList[index]?.plans
                    // 遍历选中的玩法币种
                    if (!isEmpty(this.checkedTradeType)) {
                        this.checkedTradeType.forEach(el => {
                            if ([3, 5, 9].includes(Number(el.id)) && typeof el.allCurrency === 'string') {
                                el.allCurrency = el.allCurrency.split(',')
                            }
                        })
                    }

                    this.getTradeTypeAssets(data)
                } else {
                    this.$message({
                        message: this.$t('channelSetting.error6'),
                        type: 'warning'
                    })
                }
            } else {
                if (isEmpty(this.form.customerGroupId)) {
                    return this.$message({
                        message: this.$t('channelSetting.error'),
                        type: 'warning'
                    })
                } else {
                    data = this.accountTradeList[this.form.customerGroupId]?.data
                    this.checkedTradeType = this.form.tradeTypeCurrencyList
                    this.getTradeTypeAssets(data)
                    this.plansDialogVisible = true
                }
            }
        },

        // 已填写的数据回填
        getTradeTypeAssets (data) {
            if (Array.isArray(data)) {
                this.tradeTypeList = data.map(el => ({ id: el.trade_type, name: el.trade_name }))
                console.log('this.tradeTypeList', this.tradeTypeList)
                const tempCheckedTradeType = {}

                this.tradeTypeList.forEach(el => {
                    tempCheckedTradeType[String(el.id)] = this.checkedTradeType?.find(item => item.id === el.id) ||
                        {
                            allCurrency: ['1', '2'].indexOf(String(el.id)) > -1 ? '' : [],
                            sort: 0,
                            alias: '',
                            isWallet: '',
                        }
                })

                this.checkedTradeType = tempCheckedTradeType
                this.tradeTypeAssets = data.map(item => {
                    let customerGroupAssets = []
                    if (Array.isArray(item.assets)) {
                        customerGroupAssets = item.assets.map(el => ({ key: el.code, label: el.code + '-' + el.name }))
                    }
                    return {
                        id: item.trade_type,
                        name: item.trade_name,
                        assetsList: customerGroupAssets
                    }
                })
            }
        },
        submit () {
            try {
                const that = this
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        console.log('error submit!!')
                        return false
                    } else {
                        // 表单验证通过
                        that.submitLoading = true
                        const _formData = cloneDeep(this.form)

                        if (_formData.instructions_zh) {
                            _formData.instructions_zh = encodeURIComponent(_formData.instructions_zh)
                        }
                        if (_formData.instructions_hk) {
                            _formData.instructions_hk = encodeURIComponent(_formData.instructions_hk)
                        }
                        if (_formData.instructions_en) {
                            _formData.instructions_en = encodeURIComponent(_formData.instructions_en)
                        }
                        if (_formData.registList.length > 0) {
                            _formData.registList.forEach(el => {
                                if (isEmpty(el.registCountry)) {
                                    that.$message({
                                        message: this.$t('channelSetting.error3'),
                                        type: 'warning'
                                    })
                                    that.submitLoading = false
                                    throw new Error('no-registCountry')
                                }
                                if (isEmpty(el.customerGroupId)) {
                                    that.$message({
                                        message: this.$t('channelSetting.error8'),
                                        type: 'warning'
                                    })
                                    that.submitLoading = false
                                    throw new Error('no-customerGroupId')
                                }
                                const customerGroupId = el.customerGroupId
                                const plans = that.accountTradeList[customerGroupId]?.data || []
                                const plansList = plans.map(item => {
                                    const { trade_type, trade_name, assets, } = item
                                    const allCurrency = assets.map(item => item.code).toString()
                                    return {
                                        isWallet: '',
                                        alias: '',
                                        name: trade_name,
                                        id: trade_type,
                                        tradeType: trade_type,
                                        allCurrency: allCurrency,
                                    }
                                })
                                el.plans = plansList
                            })
                        }

                        // 游客玩法如果没设置则取默认
                        if (that.form.tradeTypeCurrencyList.length === 0) {
                            const plans = []
                            that.accountTradeList[2].data.forEach(el => {
                                plans.push({
                                    id: el.trade_type,
                                    alias: '',
                                    isWallet: '',
                                    sort: 0,
                                    tradeType: el.trade_type,
                                    name: el.trade_name

                                })
                            })
                            _formData.tradeTypeCurrencyList = plans
                        }

                        // 设置存款数据

                        _formData.depositData = this.$refs['amountSet'].getData()

                        // _formData.paymentIconList = {}

                        _formData.googleAnalytics = window.zip(_formData.googleAnalytics)

                        // 获取默认客户组和游客组玩法列表
                        _formData.defaultPlans = {}
                        for (const key in that.accountTradeList) {
                            if (Object.hasOwnProperty.call(that.accountTradeList, key)) {
                                const element = that.accountTradeList[key]
                                if ([1, 2].includes(Number(element.id))) {
                                    _formData.defaultPlans[element.id] = element.data.map(el => {
                                        return {
                                            id: el.trade_type,
                                            tradeType: el.trade_type,
                                            name: el.trade_name
                                        }
                                    })
                                }
                            }
                        }
                        // const aa = '{\"tradeTypeCurrencyList\":[{\"id\":\"5\",\"alias\":\"\",\"isWallet\":\"\",\"sort\":0,\"tradeType\":\"5\",\"name\":\"现货\"},{\"id\":\"3\",\"alias\":\"\",\"isWallet\":\"\",\"sort\":0,\"tradeType\":\"3\",\"name\":\"杠杆\"},{\"id\":\"1\",\"alias\":\"\",\"isWallet\":\"\",\"sort\":0,\"tradeType\":\"1\",\"name\":\"合约全仓\"},{\"id\":\"2\",\"alias\":\"\",\"isWallet\":\"\",\"sort\":0,\"tradeType\":\"2\",\"name\":\"合约逐仓\"}],\"thirdLogin\":[],\"registerTypes\":[],\"instructions_zh\":\"<p>dsaf</p>\",\"instructions_en\":\"<p>dga</p>\",\"instructions_hk\":\"\",\"googleAnalytics\":\"H4sIAAAAAAAAAwMAAAAAAAAAAAA=\",\"h5Address\":\"\",\"h5PreviewAddress\":\"\",\"defaultZone\":{\"id\":\"2\",\"name\":\"阿富汗\",\"name_tw\":\"阿富汗\",\"name_en\":\"Afghanistan\",\"country_code\":\"+93\",\"national_code\":\"AF\",\"code\":\"AF\",\"extend\":\"\",\"create_time\":\"1618881547731\",\"update_time\":\"1618881547731\",\"status\":\"1\",\"enable\":\"0\",\"sync_time\":\"1646881363\"},\"themeColor\":\"#2B70AE\",\"registList\":[{\"registCountry\":{\"id\":9999,\"isOther\":true,\"name\":\"全部\"},\"customerGroupId\":\"1\",\"plans\":[{\"isWallet\":\"\",\"alias\":\"\",\"name\":\"现货\",\"id\":\"5\",\"tradeType\":\"5\",\"allCurrency\":\"USDT,BTC,ETH,ADA,AVAX,DOGE,EUR,USD,BNB,SOL,XRP6,LUNA,DOT,XRP,V10,qa001,XEC,qa002,cathytest\"},{\"isWallet\":\"\",\"alias\":\"\",\"name\":\"杠杆\",\"id\":\"3\",\"tradeType\":\"3\",\"allCurrency\":\"USDT,BTC,ETH,USD\"},{\"isWallet\":\"\",\"alias\":\"\",\"name\":\"合约全仓\",\"id\":\"1\",\"tradeType\":\"1\",\"allCurrency\":\"USDT\"},{\"isWallet\":\"\",\"alias\":\"\",\"name\":\"合约逐仓\",\"id\":\"2\",\"tradeType\":\"2\",\"allCurrency\":\"USDT\"}]}],\"onlineService\":\"\",\"supportLanguage\":[{\"name\":\"中文\",\"val\":\"zh-CN\",\"isDefault\":true},{\"name\":\"English\",\"val\":\"en-US\"},{\"name\":\"中文繁体\",\"val\":\"zh-HK\"}],\"customerGroupId\":\"2\",\"registrable\":[{\"id\":\"2\",\"name\":\"阿富汗\",\"name_tw\":\"阿富汗\",\"name_en\":\"Afghanistan\",\"country_code\":\"+93\",\"national_code\":\"AF\",\"code\":\"AF\",\"extend\":\"\",\"create_time\":\"1618881547731\",\"update_time\":\"1618881547731\",\"status\":\"1\",\"enable\":\"0\",\"sync_time\":\"1646881363\"}],\"isWallet\":false,\"paymentIconList\":{\"mdpay_bank_0001201701100001\":{\"zh-CN\":{\"alias\":\"\",\"imgUrl\":\"\"},\"zh-HK\":{\"alias\":\"\",\"imgUrl\":\"\"},\"en-US\":{\"alias\":\"\",\"imgUrl\":\"\"}},\"micropay_bank_6966696699\":{\"zh-CN\":{\"alias\":\"\",\"imgUrl\":\"\"},\"zh-HK\":{\"alias\":\"\",\"imgUrl\":\"\"},\"en-US\":{\"alias\":\"\",\"imgUrl\":\"\"}},\"coinbridge_coinbridge_aabd8071bff64b969d23b8fa3f7ae481\":{\"zh-CN\":{\"alias\":\"\",\"imgUrl\":\"\"},\"zh-HK\":{\"alias\":\"\",\"imgUrl\":\"\"},\"en-US\":{\"alias\":\"\",\"imgUrl\":\"\"}}},\"tradeTypesConfig\":{\"zh-CN\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"5\":\"\"},\"en-US\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"5\":\"\"},\"zh-HK\":{\"1\":\"\",\"2\":\"\",\"3\":\"\",\"5\":\"\"}},\"other\":{},\"language\":{\"name\":\"中文\",\"val\":\"zh-CN\",\"isDefault\":true},\"depositData\":{\"default\":{\"1\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}},\"2\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}},\"3\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}},\"4\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}},\"5\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}}},\"not\":{\"1\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}},\"2\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}},\"3\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}},\"4\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}},\"5\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}}},\"already\":{\"1\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}},\"2\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}},\"3\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}},\"4\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}},\"5\":{\"amount\":\"\",\"zh-CN\":{\"describe\":\"\"},\"en-US\":{\"describe\":\"\"},\"zh-HK\":{\"describe\":\"\"}}},\"isDefault\":false,\"isNot\":false,\"isAlready\":false},\"defaultPlans\":{\"1\":[{\"id\":\"5\",\"tradeType\":\"5\",\"name\":\"现货\"},{\"id\":\"3\",\"tradeType\":\"3\",\"name\":\"杠杆\"},{\"id\":\"1\",\"tradeType\":\"1\",\"name\":\"合约全仓\"},{\"id\":\"2\",\"tradeType\":\"2\",\"name\":\"合约逐仓\"}],\"2\":[{\"id\":\"5\",\"tradeType\":\"5\",\"name\":\"现货\"},{\"id\":\"3\",\"tradeType\":\"3\",\"name\":\"杠杆\"},{\"id\":\"1\",\"tradeType\":\"1\",\"name\":\"合约全仓\"},{\"id\":\"2\",\"tradeType\":\"2\",\"name\":\"合约逐仓\"}]}}'

                        saveViChannel({
                            content: JSON.stringify(_formData), // '{"supportLanguage":[{"name":"中文","val":"zh-CN","isDefault":true}]}', //
                            id: that.pageId,
                            other: '',
                        }).then(res => {
                            if (!res.success) {
                                return this.$message.error(res.message)
                            }
                            that.$message({
                                message: this.$t('channelSetting.success1'),
                                type: 'success'
                            })
                            that.getPageConfig()
                        }).catch(error => {
                            console.log(error)
                        }).finally(() => {
                            that.submitLoading = false
                        })
                    }
                })
            } catch (error) {
                console.log('error', error)
            }
        },
        customerChange (index) {
            this.curIndex = index
            const customerGroupId = this.form.registList[index].customerGroupId

            if (Number(customerGroupId) !== 1) {
                this.form.registList[index].disabledSetCurrency = true
                this.disabledSetCurrency = false
                const plans = []
                this.accountTradeList[customerGroupId].data.forEach(el => {
                    const allCurrency = el.assets.map(el => el.code) || ''
                    plans.push({
                        id: el.trade_type,
                        alias: '',
                        isWallet: '',
                        sort: 0,
                        allCurrency: allCurrency.toString(),
                        tradeType: el.trade_type,
                        name: el.trade_name

                    })
                })
                this.form.registList[index].plans = plans
            } else {
                this.form.registList[index].disabledSetCurrency = false
                // this.form.registList[index].plans = {}
                const plans = []
                this.accountTradeList[customerGroupId].data.forEach(el => {
                    plans.push({
                        id: el.trade_type,
                        alias: '',
                        isWallet: '',
                        sort: 0,
                        allCurrency: [],
                        tradeType: el.trade_type,
                        name: el.trade_name

                    })
                })
                this.form.registList[index].plans = plans
            }
        },
        addFormItem () {
            this.handleCountry()
            this.form.registList.push({ disabledSetCurrency: true })
        },
        countryChange () {
            this.handleCountry()
        },
        // 处理注册国家下拉框数据，不能重复选择国家
        handleCountry () {
            this.registZoneList.map(item => {
                const registIds = this.form.registList.map(el => el.registCountry?.id)
                item.disabled = false
                if (registIds.indexOf(item.id) > -1) {
                    item.disabled = true
                }
            })
        },
        removeItem (index) {
            if (index !== 0) {
                this.form.registList.splice(index, 1)
            }
        },

        handleSavePlans () {
            let assetFlag = true

            const plans = []

            // 非默认客户不设置币种。默认全部币种
            if (Number(this.setPlansType === 3)) {
                const curCustomerGroupId = this.form.registList[this.curIndex].customerGroupId
                if (Number(curCustomerGroupId) !== 1) {
                    this.accountTradeList[curCustomerGroupId].data && this.accountTradeList[curCustomerGroupId].data.forEach(el => {
                        const allCurrency = el.assets.map(item => item.code)
                        if ([3, 5, 9].includes(Number(el.trade_type))) {
                            this.checkedTradeType[el.trade_type].allCurrency = allCurrency
                        } else {
                            this.checkedTradeType[el.trade_type].allCurrency = allCurrency.toString()
                        }
                    })
                }
            }
            for (const key in this.checkedTradeType) {
                if (Object.hasOwnProperty.call(this.checkedTradeType, key)) {
                    const el = this.checkedTradeType[key]
                    if (!el.allCurrency) {
                        assetFlag = false
                    }

                    let allCurrency = el.allCurrency || ''
                    if ([3, 5, 9].includes(Number(key))) {
                        allCurrency = allCurrency.toString()
                    }

                    plans.push({
                        id: key,
                        alias: el.alias,
                        allCurrency,
                        isWallet: el.isWallet,
                        sort: el.sort,
                        tradeType: key,
                        name: this.tradeTypeList.find(a => Number(a.id) === Number(key)).name

                    })
                }
            }

            // 玩法排序
            plans.sort(function (a, b) {
                return a.sort - b.sort
            })

            if (!assetFlag && this.setPlansType === 1) {
                return this.$message({
                    message: this.$t('channelSetting.error10'),
                    type: 'warning'
                })
            }

            if (this.setPlansType === 2) {
                this.form.tradeTypeCurrencyList = plans
            } else {
                this.form.registList[this.curIndex].plans = plans
            }

            this.plansDialogVisible = false
        },
        closeDialog () {
            this.checkedTradeType = {}
            this.tradeTypeAssets = []
            // this.form.tradeTypeCurrencyList = []
        },
        // uploadRegitserBannerFile () {
        //     try {
        //         // 调用wp的方法上传图片
        //         if (window.tb_show) {
        //             window.tb_show('', 'media-upload.php?type=image&amp;TB_iframe=true')
        //             // 设置callBack
        //             window.send_to_editor = (html) => {
        //                 if (window.tb_remove) {
        //                     window.tb_remove()
        //                 }
        //                 console.log(html)
        //                 const _div = document.createElement('div')
        //                 _div.innerHTML = html
        //                 const imgUrl = _div.querySelector('img').src
        //                 this.form.registerBanner = imgUrl
        //             }
        //         } else {
        //             console.log('执行WordPress window.tb_show方法显示上传图片功能')
        //         }
        //     } catch (error) {
        //         console.log(error)
        //     }
        // },
        uploadFile (item, lang) {
            try {
                // 调用wp的方法上传图片
                if (window.tb_show) {
                    window.tb_show('', 'media-upload.php?type=image&amp;TB_iframe=true')
                    // 设置callBack
                    window.send_to_editor = (html) => {
                        if (window.tb_remove) {
                            window.tb_remove()
                        }
                        console.log(html)
                        const _div = document.createElement('div')
                        _div.innerHTML = html
                        const imgUrl = _div.querySelector('img').src
                        console.log('imgUrl', imgUrl)
                        const uniqueKey = item.paymentCode + '_' + item.paymentType + '_' + item.merchantNo
                        this.form.paymentIconList[uniqueKey][lang.val].imgUrl = imgUrl
                    }
                } else {
                    console.log('执行WordPress window.tb_show方法显示上传图片功能')
                }
            } catch (error) {
                console.log(error)
            }
        },
        resetPayment (item, lang) {
            const uniqueKey = item.paymentCode + '_' + item.paymentType + '_' + item.merchantNo
            this.form.paymentIconList[uniqueKey][lang.val].alias = ''
            this.form.paymentIconList[uniqueKey][lang.val].imgUrl = ''
        },
        toPage () {
            this.$router.push({
                name: 'Pages',
                query: {
                    id: this.pageId
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.m-setting {
    height: calc(100vh);
    overflow-y: scroll;
    .setting-header {
        padding: 20px;
        .btns {
            text-align: right;
        }
        .toPages {
            font-size: 14px;
            line-height: 40px;
            cursor: pointer;
            span {
                color: #2B70AE;
            }
        }
    }
    .row {
        padding-bottom: 30px;
    }
    .checkBox {
        vertical-align: middle;
    }
    .img-tip {
        width: 18px;
        margin-left: 10px;
        vertical-align: middle;
        cursor: pointer;
    }
    .tradeType-row {
        display: flex;
        align-items: center;
        margin-bottom: 50px;
        .choose-checkbox {
            margin: 0 50px;
        }
        .el-card {
            flex: 1;
            .el-transfer {
                margin-bottom: 20px;
            }
        }
        .notice {
            color: #F00;
        }
    }
    .label {
        margin-right: 5px;
        color: #606266;
    }
    .pay-channel-setting {
        .alias-input {
            width: 70%;
            margin-right: 30px;
        }
        .upload {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 180px;
            height: 180px;
            overflow: hidden;
            text-align: center;
            border: 1px dashed #D9D9D9;
            border-radius: 6px;
            cursor: pointer;
            &:hover {
                border: 1px dashed #477FD3;
            }
            .el-icon-plus {
                display: block;
                font-weight: bold;
                font-size: 14px;
                vertical-align: middle;
            }
            .img-wrap {
                padding: 10px;
                img {

                }
                .tip {
                    line-height: 30px;
                }
            }
        }
    }
    .box-card {
        .tip {
            color: red;
        }
    }
    .registerBanner {
        .upload {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 180px;
            height: 180px;
            overflow: hidden;
            text-align: center;
            border: 1px dashed #D9D9D9;
            border-radius: 6px;
            cursor: pointer;
            &:hover {
                border: 1px dashed #477FD3;
            }
            .el-icon-plus {
                display: block;
                font-weight: bold;
                font-size: 14px;
                vertical-align: middle;
            }
            .img-wrap {
                padding: 10px;
                img {

                }
                .tip {
                    line-height: 30px;
                }
            }
        }
    }
}
#pane-fourth {
    .lang-label {
        line-height: 40px;
        text-align: center;
    }
    .el-form-item {
        display: block;
        .el-form-item__content {
            margin-left: none;
        }
    }
}
</style>
