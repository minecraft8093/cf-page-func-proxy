export default {
    async fetch(request, env) {
        let url = new URL(request.url);
        if (url.pathname.startsWith('/')) {
            // 自定义主机名
            url.hostname = "cc.444435.xyz";
            // 添加自定义端口，确保使用 HTTPS
            url.protocol = "https"; // 确保使用 HTTPS
            url.port = "44300"; // 如果你有其他 HTTPS 端口，也可以替换此端口

            // 创建新的请求并转发
            let new_request = new Request(url, request);
            return fetch(new_request);
        }
        // 否则，服务静态资源
        return env.ASSETS.fetch(request);
    }
};
