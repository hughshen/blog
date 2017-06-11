<!-- title:Nginx 用户认证 -->
<!-- keywords:Nginx -->


一般的 Web 服务器都提供了用户认证登录系统，用于限制用户访问某些路径，需要登录认证之后才能继续访问网站 (比如后台管理)，开启也很简单，以 Nginx 为例，做个记录。

### 创建用户密码文件

**通过 OpenSSL 创建**

```bash
# Add user
sudo echo -n 'admin:' >> /etc/nginx/.htpasswd
# Add an encrypted password
sudo openssl passwd -apr1 >> /etc/nginx/.htpasswd
# Password: (your password)
# Verifying - Password: (repeat your password)
# Check if added
cat /etc/nginx/.htpasswd
# Output admin(admin)
admin:$apr1$xpcwUTed$IOI18VsDIv3rmzIIJhXbk1
```

**通过 htpasswd 命令创建**

需要安装 `apache2-utils`。

```bash
sudo apt-get update
sudo apt-get install apache2-utils
# Add user
sudo htpasswd -c /etc/nginx/.htpasswd admin
# Will be asked to supply and confirm a password for the user.
# Check if added
cat /etc/nginx/.htpasswd
```

### Nginx 开启用户认证

```bash
sudo vim /etc/nginx/sites-available/default
```

修改配置：

```
server {
    # ...
    location / {
        try_files $uri $uri/ =404;

        auth_basic "Restricted Content";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

重启 Nginx：

```bash
sudo nginx -t
sudo service nginx restart
```

Nginx 用户认证只是提供了简单的验证功能，最好还是跟 SSL 加密一起使用。

---

## 参考

[How To Set Up Password Authentication with Nginx on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-password-authentication-with-nginx-on-ubuntu-14-04)
