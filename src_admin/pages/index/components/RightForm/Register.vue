<template>
    <div class='m-register'>
        {{ activeData }}
        <el-form-item label='字段名'>
            <el-select v-model='activeData.name' clearable placeholder='请选择'>
                <el-option
                    v-for='item in nameList'
                    :key='item.value'
                    :label='item.label'
                    :value='item.value'
                />
            </el-select>
        </el-form-item>
        <el-form-item label='label'>
            <el-input
                v-model='activeData.label'
                placeholder='请输入'
            />
        </el-form-item>
        <el-form-item v-if="activeData.name === 'code'" label='绑定字段'>
            <el-select v-model='activeData.bindName' clearable placeholder='请选择'>
                <el-option
                    v-for='item in bindList'
                    :key='item.value'
                    :label='item.label'
                    :value='item.value'
                />
            </el-select>
        </el-form-item>
        <template v-if="activeData.name !=='submit'">
            <el-form-item label='placeholder'>
                <el-input
                    v-model='activeData.placeholder'
                    placeholder='请输入'
                />
            </el-form-item>
            <el-form-item label='验证器'>
                <el-input
                    v-model='activeData.validator'
                    placeholder='请输入'
                    type='textarea'
                />
            </el-form-item>
        </template>
    </div>
</template>

<script>
export default {
    name: 'Register',
    props: {
        config: {
            type: Object,
            default () {
                return {}
            }
        },
        activeData: {
            type: Object,
        }
    },
    data () {
        return {
            nameList: [
                { value: 'phone', label: '手机号' },
                { value: 'email', label: '邮箱' },
                { value: 'code', label: '验证码' },
                { value: 'pwd', label: '密码' },
                { value: 'submit', label: '提交按钮' }
            ],
            bindList: [
                { value: 'phone', label: '手机号' },
                { value: 'email', label: '邮箱' }
            ]
        }
    },
    mounted () {

    },
    methods: {

    }
}
</script>

<style lang="scss">
</style>
