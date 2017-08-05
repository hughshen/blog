<!-- title:Nginx location 配置笔记 -->
<!-- keywords:Nginx -->

对于 Nginx 的配置一直都是一知半解的，出问题总是弄半天，今天遇到了 add_header 不生效的问题，就顺便把一些常用配置做下记录吧。

## location 正则

* `=` 精确匹配，如果匹配，则停止
* `~` 正则匹配，区分大小写
* `~*` 正则匹配，不区分大小写
* `^~` 普通字符匹配，如果匹配，则不匹配别的规则，一般用来匹配目录
* `@` 命名 location，使用在内部定向时，例如 error_page, try_files

例子

```
location = / {
    # 只匹配 "/"
    [ configuration A ]
}
location / {
    # 匹配任何请求，因为所有请求都是以 "/" 开始
    # 但是更长字符匹配或者正则表达式匹配会优先匹配
    # 例如 "/post/test.html"
    [ configuration B ]
}
location ^~ /images/ {
    # 匹配任何以 /images/ 开始的请求，并停止匹配
    # 例如 "/images/test.jpg"
    [ configuration C ]
}
location ~* \.(gif|jpg|jpeg)$ {
    # 匹配以 gif，jpg，jpeg 结尾的请求
    # 但是所有 /images/ 目录的请求将由 [ configuration C ] 处理  
    # 例如 "/assets/test.jpg"
    [ configuration D ]
}
```

## location root & alias

对于这两个配置我一直都是很模糊的，还是直接看例子比较好

```
location ~ ^/post/ {
    root /path/html;
    # 例如请求为 "/post/test.html"，则返回 /path/html/post/test.html
    # 一般请求路径是 root + uri
    # 可以在 http、server、location、if 中使用
}
location ^~ /images/ {  
    alias /path/images/new/;
    # 例如请求为 "/images/2017/test.jpg"，则返回 /path/images/new/2017/test.jpg
    # 会把匹配到的路径去掉，例如这里会把 /images/ 去掉，只取 2017/test.jpg
    # 目录名后面一定要加 "/"
    # 只能在 location 中使用
}
```

## add_header

今天在配置 add_header 的时候一直不生效，下面是修改前的配置

```
# [location 1]
location ~* \.(html|js)$ {
    expires 30d;
}
# [location 2]
location / {
    try_files $uri /index.html =404;
    add_header      Cache-Control no-cache;
}
```

根据上面的正则匹配顺序，如果访问 /post/test.html 的话，则匹配 [location 1]，这时候，add_header 并没有作用，可以修改成下面的配置

```
location ~* \.(js)$ {
    expires 30d;
}
# 对 html 单独配置
location ~* \.html$ {
    expires 30d;
    add_header      Cache-Control no-cache;
}
location / {
    try_files $uri /index.html =404;
}
```

**2017-08-05**

子目录下配置 Rewrite 规则隐藏 index.php，作个记录。

```
location /wordpress/ {
    index index.php index.html;
    try_files $uri $uri/ /wordpress/index.php$is_args$args;
}
```

---

## 参考

[nginx location匹配规则](http://www.nginx.cn/115.html)

[nginx root&alias文件路径配置](http://www.ttlsa.com/nginx/nginx-root_alias-file-path-configuration/)

[Nginx rewrite in subfolder](https://stackoverflow.com/questions/17805576/nginx-rewrite-in-subfolder)