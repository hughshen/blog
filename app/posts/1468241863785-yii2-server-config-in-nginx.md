<!-- title:Yii2 在 Nginx 下的配置 -->
<!-- keywords:Yii2, Nginx -->

这些都是 Yii2 在 Nginx 的一些基础配置，做个记录 (WNMP 环境，Linux 下类似)

直接在配置文件里添加 (自定义域名: example.com)

```bash
# Yii2
server {
    listen       80;
    server_name  example.com www.example.com;

    # Linux下需要绝对路径
    root html/yii/frontend/web;
    index index.php index.html;

    # 先配置后台路径(其实是想rewrite这一步直接省略的，但没找到解决方法)
    location ^~ /backend {
        rewrite ^/backend(.*)$ /backend/web$1 last;
    }

    location ^~ /backend/web {
        root html/yii;
 
        location ~ \.php$ {
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            include        fastcgi_params;
        }
    }

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }

    location / {
        try_files $uri $uri/ 404;
    }

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    location ~ \.php$ {
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
}
```

---

## 参考

[Yii 2.0: yii2-app-advanced on single domain (Apache, Nginx)](http://www.yiiframework.com/wiki/799/yii2-app-advanced-on-single-domain-apache-nginx/)
