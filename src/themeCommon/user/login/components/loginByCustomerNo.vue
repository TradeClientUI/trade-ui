<template>
    <div class='loginByCustomerNo'>
        <van-divider>用户编号登录测试</van-divider>
        <van-form @submit='onSubmit'>
            <van-cell-group inset>
                <van-field v-model='username' label='用户编号' name='username' placeholder='用户编号' :rules="[{ required: true, message: '请填写用户名' }]" />
                <van-field
                    v-model='password'
                    autocomplete='off'
                    label='密码'
                    name='pwd'
                    placeholder='密码'
                    :rules="[{ required: true, message: '请填写密码' }]"
                    type='password'
                />
            </van-cell-group>
            <div style='margin: 16px;'>
                <van-button block native-type='submit' round type='primary'>
                    提交
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import { ref } from 'vue'
import { Divider, Form, Field, CellGroup } from 'vant'
import md5 from 'js-md5'
export default {
    components: {
        [Divider.name]: Divider,
        [Form.name]: Form,
        [Field.name]: Field,
        [CellGroup.name]: CellGroup,
    },
    emits: ['submit'],
    setup (props, { emit }) {
        const username = ref('')
        const password = ref('')
        const onSubmit = (values) => {
            const params = {
                type: 3,
                loginName: values.username,
                device: 1,
                loginPwd: md5(values.pwd),

            }
            emit('submit', params)
        }

        return {
            username,
            password,
            onSubmit,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.loginByCustomerNo {
    margin-top: rem(120px);
}
</style>
