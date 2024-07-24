export default {
    async fetch(request, env) {
        let url = new URL(request.url);
        let servers = [
            { hostname: "chat,uptek.top", healthy: true, responseTime: Infinity },
            { hostname: "argochat.uptek.top", healthy: true, responseTime: Infinity },
        ];

        // 健康检查和响应时间测试函数
        async function healthCheck(server) {
            try {
                let start = Date.now();
                let response = await fetch(`https://${server.hostname}/health`);
                let end = Date.now();
                if (response.ok) {
                    server.responseTime = end - start;
                    return true;
                } else {
                    server.responseTime = Infinity;
                    return false;
                }
            } catch (error) {
                server.responseTime = Infinity;
                return false;
            }
        }

        // 更新服务器的健康状态和响应时间
        for (let server of servers) {
            server.healthy = await healthCheck(server);
        }

        // 过滤掉不健康的服务器
        let healthyServers = servers.filter(server => server.healthy);

        if (healthyServers.length === 0) {
            return new Response('No healthy servers available', { status: 503 });
        }

        // 按响应时间升序排序，选择响应时间最短的服务器
        healthyServers.sort((a, b) => a.responseTime - b.responseTime);
        url.hostname = healthyServers[0].hostname;

        // 否则，服务静态资源
        return env.ASSETS.fetch(request);
    }
};
