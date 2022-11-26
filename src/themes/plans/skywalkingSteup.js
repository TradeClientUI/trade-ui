import ClientMonitor from 'skywalking-client-js'

const serviceVersion = 'v1.0.0'

// 计算skywalking的环境配置
function calculatConfig () {
    const { apiService, companyId } = JSON.parse(window.wp_SysSetting)
    const apiServiceDomain = apiService.split('//')[1]
    const isPre = apiServiceDomain.startsWith('pre')
    const collectorDomain = isPre ? 'https://preskyapi.cmfbl.com' : 'https://skyapi.cmfbl.com'
    const service = `${isPre ? 'pre' : 'prd'}-${companyId}`
    return { collectorDomain, service }
}

export function skywalkingRegister (router) {
    const { collectorDomain, service } = calculatConfig()
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
    const { collectorDomain, service } = calculatConfig()
    if (!collectorDomain) return false
    ClientMonitor.reportFrameErrors({
        collector: collectorDomain,
        service,
        pagePath: location.href,
        serviceVersion: 'v1.0.0',
    }, err)
}
