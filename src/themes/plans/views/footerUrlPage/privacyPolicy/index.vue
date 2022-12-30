<template>
    <div class='privacyPolicy'>
        <PrivacyPolicy />
        <NewFooter />
    </div>
</template>

<script>
import PrivacyPolicy from '@/themeCommon/user/privacyPolicy'
import NewFooter from '../../../layout/layoutBottom'
import { onMounted } from 'vue'
export default {
    components: {
        PrivacyPolicy,
        NewFooter
    },
    setup () {
        onMounted(() => {
            window.scrollTo(0, 0)
        })
    }
}
</script>
