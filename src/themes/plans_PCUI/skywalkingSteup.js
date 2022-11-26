import ClientMonitor from 'skywalking-client-js'

const isDev = process.env.NODE_ENV === 'development'
const collectorDomain = window['isPRD'] && !isDev ? 'https://skyapi.cmfbl.com' : 'https://preskyapi.cmfbl.com'
const service = 'test-ui'
const serviceVersion = 'v1.0.0'

export function skywalkingRegister (router) {
    if (!collectorDomain) return false
    // 注册skywalking
    ClientMonitor.register({
        collector: collectorDomain,
        service,
        pagePath: location.href,
        serviceVersion,
        noTraceOrigins: ['https://abcn.displore.com.cn', 'https://aben.displore.com.cn', 'https://abin.displore.com.cn', 'https://prodin.displore.com.cn', 'https://proden.displore.com.cn', 'https://prodcn.displore.com.cn'],
        // enableSPA: true,
    })

    // 路由变化追踪
    router.afterEach((to, from) => {
        ClientMonitor.setPerformance({
            collector: collectorDomain,
            service,
            serviceVersion,
            pagePath: location.href,
            useFmp: true
        })
    })
}

export function skywalkingRreportErrors (err) {
    if (!collectorDomain) return false
    ClientMonitor.reportFrameErrors({
        collector: collectorDomain,
        service: 'cats2-h5',
        pagePath: location.href,
        serviceVersion: 'v1.0.0',
    }, err)
}
