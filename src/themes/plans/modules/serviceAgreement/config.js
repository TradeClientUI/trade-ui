export default {
    title: '开户须知',//'开户须知',
    tagIcon: 'el-icon-check',
    // tagIcon: 'el-icon-basketball',
    tag: 'serviceAgreement',
    include: ['mine'], // 包含的页面code
    config: [
        {
            name: 'agreement_html',
            label: '协议内容',
            filterName: 'name',
            include: ['agreement'],
            default: '',
            type: 'Tinymce'
        }
    ]
}
