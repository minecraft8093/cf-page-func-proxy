export default {
    async fetch(request, env) {
        let url = new URL(request.url);
        if (url.pathname.startsWith('/')) {
            // 自定义主机名
            url.hostname = "argochat.uptek.top";

            let new_request = new Request(url, request);
            return fetch(new_request);
        }
        // 否则，服务静态资源
        return env.ASSETS.fetch(request);
    }
};
