export default {
    async fetch(request, env) {
        let url = new URL(request.url);

        // 缓存的有效期
        const CACHE_TTL = 3600; // 1小时

        if (url.pathname.startsWith('/')) {
            // 自定义主机名
            url.hostname = "chat.uptek.top";

            let new_request = new Request(url, request);

            // 尝试从缓存中获取响应
            let cache = caches.default;
            let cachedResponse = await cache.match(new_request);

            if (cachedResponse) {
                // 如果缓存中有响应，则返回缓存的响应
                return cachedResponse;
            } else {
                // 否则，获取新的响应并将其缓存
                let response = await fetch(new_request);

                // 将新的响应克隆，以便缓存和返回
                let responseToCache = response.clone();
                
                // 设置缓存选项
                let cacheOptions = {
                    ttl: CACHE_TTL,
                    bypassCache: false // 不绕过缓存
                };

                // 将响应放入缓存
                event.waitUntil(cache.put(new_request, responseToCache, cacheOptions));

                return response;
            }
        }
        // 否则，服务静态资源
        return env.ASSETS.fetch(request);
    }
};
