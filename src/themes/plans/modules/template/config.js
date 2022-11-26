export default {
    title: 'VUE模板',//'VUE模板',
    tag: 'template',
    // exclude:['nav'],   // 排除的页面code
    tagIcon: 'el-icon-star-on',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config:[
        {
            name:'content',
            label: '文本内容',
            type: 'Textarea',
            default: `<div class="template" ><p>您好：{{$store.getters.accountNo}}，</p>
                <p>您的账户余额是：<span style="color:#f00;" >{{$store.getters.balance}} {{$store.getters.accountCurrency}}</span></p>
                <p>您的未读消息数是：<span style="color:#f00;" >{{$store.getters.totalMsgNum}}</span></p>
            </div>`
        },
    ]
}
