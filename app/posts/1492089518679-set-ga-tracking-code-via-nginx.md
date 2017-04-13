<!-- title:通过 Nginx 添加谷歌分析代码 -->
<!-- keywords:Nginx, Google Analytics -->

一般谷歌分析代码是加到 `</head>` 或者 `</body>` 中的，正常来说添加到公用文件即可，这样全站都能使用，但是如果有的项目是独立的或者都是静态文件，这样子就不好添加了，而且修改起来也会变得麻烦，幸好 Nginx 提供了 `sub_filter` 方法，可以在响应正文前对一些字符进行过滤替换，使用很简单，做个记录。

```
server {
    # ...
    set $ga_tracking_js '<script>console.log("Your tracking code");</script>';

    location / {
        # ...
        if (!-f $request_filename) {
            set $ga_tracking_js '';
        }

        sub_filter '</body>' "${ga_tracking_js}</body>";
    }
}
```

我这里只对请求存在的文件进行替换，对于 404 或者 50x 不进行记录，如果要记录的话，可以看下这篇文章，里面有介绍方法：[Sending Nginx-logs to Google Analytics](http://developers-club.com/posts/260553/)。

PS：本来是想把 `sub_filter` 写到 `if` 里面的，不过语法并不支持。

---

## 参考

[Add Google Analytics tracking code to HTML via nginx](https://gist.github.com/jirutka/5279057)

[Module ngx_http_sub_module](https://nginx.org/en/docs/http/ngx_http_sub_module.html)