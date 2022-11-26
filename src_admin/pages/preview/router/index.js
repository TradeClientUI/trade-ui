import Vue from 'vue'
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Layout from '@index/views/Layout/Index.vue'

const routes = [
    {
        path: '',
        component: () => Layout,
        redirect: 'preview',
        children: [
            {
                path: 'preview',
                name: 'PreView',
                component: () =>
                    import(/* webpackChunkName: "Pages" */ '@preview/views/Preview.vue')
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: routes
})

export default router
