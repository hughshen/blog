<!-- title:Nginx + Google Analytics 配置 -->
<!-- keywords:Nginx, Google Analytics -->

网站添加 Google Analytics 一般是在页面中添加 Tracking Code，而加载进来的 analytics.js 脚本有 11 KB 的大小，如今我每个页面的大小大概是 5 KB 左右，相对来说有点大了，另外还有一些问题，比如在大陆要加载分析脚本很慢，而且容易给一些插件给屏蔽掉等，无意中找到一篇文章说可以利用 Nginx 来做转发，详情看 [Nginx 内配置 Google Analytics 指南](https://darknode.in/network/nginx-google-analytics/)。

另外我又找了一些文章 ([本博客零散优化点汇总](https://imququ.com/post/summary-of-my-blog-optimization.html))，作者也是利用服务端来进行转发的 (这个博客真的好快)。

大概总结一下，实现方式可以分为两种

1. 服务端对每次请求进行转发
2. 服务端与客户端结合进行转发，首先在浏览器对每次访问添加统计请求 (可以自定义统计数据)，再由服务端进行转发

这两种方式虽然都是由 Nginx 作转发，但还是有一点点不同，第一种获取不了浏览器的一些信息，比如屏幕尺寸，文档标题等等，而第二种则依赖于 JavaScript，如果浏览器禁用了 JavaScript 的话，就不会发送统计请求了，本文使用的是第二种，关于第一种可以参考这篇文章：[使用Nginx将请求转发至Google Analytics实现后端统计](https://eason-yang.com/2016/11/04/google-analytics-via-nginx/)，里面写得很详细。

### 客户端

请求地址是 ga.html，代码段摘自 [JerryQu 的小站](https://imququ.com)

```javascript
;!function(a,b,c){var d=a.screen,e=encodeURIComponent,f=["dt="+e(b.title),"dr="+e(b.referrer),"ul="+(c.language||c.browserLanguage),"sd="+d.colorDepth+"-bit","sr="+d.width+"x"+d.height],g="?"+f.join("&");a.__ga_img=new Image,a.__ga_img.src="/ga.html"+g}(window,document,navigator,location);
```

### 服务端

有几点需要注意

* map 指令要写在 server 外，即 http 块中 (nginx.conf)
* 使用 [ngx_http_userid_module](https://nginx.org/en/docs/http/ngx_http_userid_module.html) 生成唯一用户 ID
* ga.html 要禁止缓存，这样在点击后退的时候就能实时统计了 (也可以在后面追加一个时间戳参数来刷新，例如 &_=new Date)
* 有时候转发地址会使用 ipv6，可以在 resolver 中关掉

**2017-06-12**

使用 `valid_referers` 代替正则。

```
map $http_user_agent $limit_bots {
    default 0;
    ~*(google|bing|yandex|msnbot) 1;
    ~*(AltaVista|Slurp|BlackWidow|Bot|ChinaClaw|Custo|DISCo|Download|Demon|eCatch|EirGrabber|EmailSiphon|EmailWolf|SuperHTTP|Surfbot|WebWhacker) 1;
    ~*(Express|WebPictures|ExtractorPro|EyeNetIE|FlashGet|GetRight|GetWeb!|Go!Zilla|Go-Ahead-Got-It|GrabNet|Grafula|HMView|Go!Zilla|Go-Ahead-Got-It) 1;
    ~*(rafula|HMView|HTTrack|Stripper|Sucker|Indy|InterGET|Ninja|JetCar|Spider|larbin|LeechFTP|Downloader|tool|Navroad|NearSite|NetAnts|tAkeOut|WWWOFFLE) 1;
    ~*(GrabNet|NetSpider|Vampire|NetZIP|Octopus|Offline|PageGrabber|Foto|pavuk|pcBrowser|RealDownload|ReGet|SiteSnagger|SmartDownload|SuperBot|WebSpider) 1;
    ~*(Teleport|VoidEYE|Collector|WebAuto|WebCopier|WebFetch|WebGo|WebLeacher|WebReaper|WebSauger|eXtractor|Quester|WebStripper|WebZIP|Wget|Widow|Zeus) 1;
    ~*(Twengabot|htmlparser|libwww|Python|perl|urllib|scan|Curl|email|PycURL|Pyth|PyQ|WebCollector|WebCopy|webcraw) 1;
    ~*(qihoobot|Baiduspider|Googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|Adsbot-Google|Feedfetcher-Google|Yahoo!.*Slurp|Yahoo!.*Slurp.*China|YoudaoBot|Sosospider|Sogou.*spider|Sogou.*web.*spider|MSNBot|ia_archiver|Tomato.*Bot|YiSou.*Spider) 1;
}

userid on;
userid_name cid;
userid_domain imhugh.com;
userid_path /;
userid_expires max;

location @tracker {
    internal;
    resolver 8.8.8.8 8.8.4.4 ipv6=off;
    proxy_method GET;
    proxy_pass https://www.google-analytics.com/collect?v=1&tid=UA-xxxxxxxx-1&$uid_set$uid_got&t=pageview&je=0&uip=$remote_addr&dl=$http_referer&$args&z=$msec;
    proxy_set_header User-Agent $http_user_agent;
    proxy_pass_request_headers off;
    proxy_pass_request_body off;
}

location ~ /ga.html {
    valid_referers server_names *.imhugh.com;
    set $post_flag "0";
    if ($limit_bots = 0) {
        set $post_flag "${post_flag}1";
    }
    if ($invalid_referer != "1") {
        set $post_flag "${post_flag}2";
    }
    if ($post_flag = "012") {
        post_action @tracker;
        add_header      Cache-Control "no-store, must-revalidate, max-age=0";
        add_header      Expires "Mon, 26 Jul 1997 05:00:00 GMT";
        add_header      Pragma no-cache;
        return 204;
    }
    return 444;
}
```

---

## 参考

[本博客零散优化点汇总](https://imququ.com/post/summary-of-my-blog-optimization.html)

[Create GUID / UUID in JavaScript?](https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript)

[Blocking all bots except a few with Nginx](https://stackoverflow.com/questions/19337662/blocking-all-bots-except-a-few-with-nginx)

[Nginx 内配置 Google Analytics 指南](https://darknode.in/network/nginx-google-analytics/)

[使用Nginx将请求转发至Google Analytics实现后端统计](https://eason-yang.com/2016/11/04/google-analytics-via-nginx/)

[Measurement Protocol 参考](https://developers.google.com/analytics/devguides/collection/protocol/v1/reference)

[Nginx 做代理，如何实现先立即返回空内容并结束请求...](https://www.v2ex.com/t/280364)
