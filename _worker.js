addEventListener(
  'fetch',event => {
     let url=new URL(event.request.url);
     url.hostname='argochat.uptek.top';
     if(url.protocol == 'https:') {
        url.protocol='http:'
     }
     let request=new Request(url,event.request);
     if(request.headers.has("Origin")) {
       request.headers.delete("Origin");
     }
     event.respondWith(
          fetch(request)
    )
  }
)
