最近配置好了服务器，也买了域名，顺便也把 HTTPS 部署好，反正以后都是要部署的。

网上找了不少关于这方面的教程，选择了 [Let's Encrypt](https://letsencrypt.org/) 这个免费好用的证书签发服务，而证书申请并没有使用官方的 [Certbot](https://certbot.eff.org/) 工具，而是使用了 [acme-tiny](https://github.com/diafygi/acme-tiny)，部署过程依照 [Let's Encrypt，免费好用的 HTTPS 证书](https://imququ.com/post/letsencrypt-certificate.html)，一路下来没什么问题 (中间粗心造成个小问题)，最后也部署成功。

感谢作者写的这篇文章，这里只是作个记录，并没有新的内容。[文章链接](https://imququ.com/post/letsencrypt-certificate.html)

## 目录说明

假设当前用户名是 user

```
# 创建以下两个目录
/home/user/www/ssl/ # ssl 生成文件目录
/home/user/www/challenges/ # 存放验证文件目录
```

## 生成证书等

切换到 `/home/user/www/ssl/` 目录

```bash
# 创建账号，用于 Let's Encrypt 识别身份
openssl genrsa 4096 > account.key
# 创建域名私钥，选择了 RSA 私钥
openssl genrsa 4096 > domain.key
# 根据私钥文件，生成 CSR 文件，在 CSR 中推荐至少把域名带 www 和不带 www 的两种情况都加进去，其它子域可以根据需要添加 (目前一张证书最多可以包含 100 个域名)，注意 openssl 配置文件是否存在
openssl req -new -sha256 -key domain.key -subj "/" -reqexts SAN -config <(cat /etc/ssl/openssl.cnf <(printf "[SAN]\nsubjectAltName=DNS:yoursite.com,DNS:www.yoursite.com")) > domain.csr
```

## 配置验证服务

切换到 `/home/user/www/challenges/` 目录

修改 nginx 配置

```bash
server {
    server_name www.yoursite.com yoursite.com;

    # 优先找验证文件
    location ^~ /.well-known/acme-challenge/ {
        alias /home/user/www/challenges/;
        try_files $uri =404;
    }

    location / {
    	# 如果配置了路由的话，可能要修改下配置
        rewrite ^/(.*)$ https://yoursite.com/$1 permanent;
    }
}
```

可以试下验证文件目录是不是能访问，比如新建 index.html 文件，我当时把 `/home/user/www/challenges/` 写成 `/home/user/www/challenges`，最后漏了斜线，不能访问该目录 (返回 404)，以至于后面验证的时候不能找到验证文件。

服务器配置好了，重启 nginx，回到 `/home/user/www/ssl/` 目录，开始获取网站证书。

```bash
# 保存 acme-tiny 到 ssl 目录
wget https://raw.githubusercontent.com/diafygi/acme-tiny/master/acme_tiny.py
# 指定账户私钥、CSR 以及验证目录，执行脚本
python acme_tiny.py --account-key ./account.key --csr ./domain.csr --acme-dir ~/www/challenges/ > ./signed.crt
# 网站证书获取成功后，下载 Let's Encrypt 的中间证书
wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > intermediate.pem
# 合并网站证书与中间证书
cat signed.crt intermediate.pem > chained.pem
# 为了后续能顺利启用 OCSP Stapling，获取根证书并与中间证书合在一起
wget -O - https://letsencrypt.org/certs/isrgrootx1.pem > root.pem
cat intermediate.pem root.pem > full_chained.pem
# 证书添加完了之后，nginx 添加证书配置并 reload
ssl_certificate     /home/user/www/ssl/chained.pem;
ssl_certificate_key /home/user/www/ssl/domain.key;
```

这里可能会出现域名无法解析的情况。

## 证书自动更新

Let's Encrypt 签发的证书只有 90 天有效期，创建 `renew_cert.sh` 并通过 `chmod a+x renew_cert.sh` 赋予执行权限来定期更新。

脚本文件内容

```bash
#!/bin/bash

cd /home/user/www/ssl/
python acme_tiny.py --account-key account.key --csr domain.csr --acme-dir /home/user/www/challenges/ > signed.crt || exit
wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > intermediate.pem
cat signed.crt intermediate.pem > chained.pem
echo "your_password" | sudo -S service nginx reload
```

添加定时任务，使用 `crontab -e` 命令，选择好编辑器之后，清除文件内容后加上以下语句，`Ctrl + x` 然后回车就行。

```bash
0 0 1 * * /home/user/www/ssl/renew_cert.sh >/dev/null 2>&1
```

添加完之后，可以使用 `crontab -l` 来查看是否添加成功，还有不知道要不要重启 (`sudo service cron restart`)。

有个小问题，重载 nginx 配置需要 root 权限才能执行，所以上面的 reload 语句换了，不知道有没有更好的办法。

最后附上完整的 nginx 配置

```bash
server {
    # SSL configuration
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

    ssl on;
    ssl_certificate         /home/user/www/ssl/chained.pem;
    ssl_certificate_key     /home/user/www/ssl/domain.key;

    root /var/www/html;

    index index.html;

    server_tokens off;

    server_name yoursite.com www.yoursite.com;

    if ($host != 'yoursite.com') {
        rewrite     ^/(.*)$ https://yoursite.com/$1 permanent;
    }

    location / {
        try_files $uri /index.html =404;
    }

    # cache
    location ~* ^.+\.(html|js)$ {
        expires 1h;
    }
}

server {
    listen 80;
    listen [::]:80;

    server_tokens off;

    server_name yoursite.com www.yoursite.com;

    access_log      /dev/null;

    # ssl challenge
    location ^~ /.well-known/acme-challenge/ {
        alias /home/shen/www/challenges/;
        try_files $uri =404;
    }

    location / {
        rewrite     ^/(.*)? https://yoursite.com/$1 permanent;
    }
}
```

---

## 参考

[Let's Encrypt，免费好用的 HTTPS 证书](https://imququ.com/post/letsencrypt-certificate.html)