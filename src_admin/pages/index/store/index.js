import { createStore } from 'vuex'
import editor from './modules/editor'
import getters from './mockStore/getters'
import Base from '@/store/modules/base'
import User from '@/store/modules/user'
import Quote from '@/store/modules/quote'
import Trade from '@/store/modules/trade'

export default createStore({
    modules: {
        editor,
        _base: Base,
        _user: User,
        _quote: Quote,
        _trade: Trade,
    },
    getters,
    state: {},
    mutations: {},
    actions: { }
})
