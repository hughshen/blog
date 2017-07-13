<!-- title:Windows 搭建 WNMP 环境 -->
<!-- keywords:WNMP -->

最近安装 Ubuntu 都是一卡一卡的，决定还是回到 Windows 的怀抱了

## 建立环境目录并下载

[Nginx](http://nginx.org/en/download.html): D:\wnmp\nginx

[PHP](http://windows.php.net/download/): D:\wnmp\php7

[MySQL](https://dev.mysql.com/downloads/mysql/): D:\wnmp\mysql

PHP 通过 FastCGI 来执行，所以选择 Non Thread Safe 的版本就行，下载好之后解压到相应目录，最后就是添加环境变量，PHP是 D:\wnmp\php7，MySQL是 D:\wnmp\mysql\bin，之后运行 nginx.exe，浏览器 localhost 查看是否出现 "Welcome to nginx!"

## 安装 MySQL

由于下载的是 zip 格式文件，需要手动去安装，到 D:\wnmp\mysql 建立 my.ini 文件 (复制 my-default.ini 就行)，修改 basedir 和 datadir (目录不存在的要手动创建目录)

```bash
basedir = D:\wnmp\mysql
datadir = D:\wnmp\mysql\data
```

> 初始化 data 目录

```bash
mysqld --initialize
mysqld --initialize-insecure
```

上面两条语句执行其中一条就行

如果是第一条的话，注意 root 密码是随机生成的，可以在 D:\wnmp\mysql\data\用户.err 里面找到 (用户是指本机用户名)，大概是这么一句话 "A temporary password is generated for root@localhost:" 后面的就是密码，不要漏了 .; 等字符

如果是第二条的话，会出现这样的警告 "Warning] root@localhost is created with an empty password ! Please
consider switching off the --initialize-insecure option."，密码为空

> 启动 MySQL (可能需要管理员权限执行 cmd)

```bash
#安装
mysqld –-install
#删除
mysqld –-remove

#启动
net start mysql
```

> 修改 root 密码

```bash
#--initialize
mysql -u root -p
Enter password: (enter the random root password here)

#--initialize-insecure
mysql -u root --skip-password

#修改root密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
```

## 安装 PHP

其实 PHP 配置好环境目录之后，启动 FastCGI 就行

> 修改 php.ini 文件 (php.ini-development 复制一份并修改为 php.ini)

对以下配置修改或取消注释

```bash
extension_dir = "D:\wnmp\php7\ext"
date.timezone = Asia/Shanghai
cgi.fix_pathinfo=1
#extension
extension=php_curl.dll
extension=php_gd2.dll
#phpMyAdmin 需要用到 mbstring
extension=php_mbstring.dll
extension=php_mysqli.dll
#composer 需要用到 ssl
extension=php_openssl.dll
extension=php_pdo_mysql.dll
#cgi 配置可选
enable_dl = On
cgi.force_redirect = 0
fastcgi.impersonate = 1
cgi.rfc2616_headers = 1
#可选
```

> 运行 FastCGI，最好使用 RunHiddenConsole 来后台运行，以免关闭 cmd 窗口后退出 CGI，[这里下载](https://www.nginx.com/resources/wiki/start/topics/examples/phpfastcgionwindows/)

```bash
path_to\RunHiddenConsole.exe D:\wnmp\php7\php-cgi.exe -b 127.0.0.1:9000 -c D:\wnmp\php7\php.ini
```

## Nginx 调用 PHP

下面的是 nginx 服务的一些命令

```bash
#启动
start nginx
#停止
nginx -s stop
#重新加载配置文件
nginx -s reload
#退出
nginx -s quit
```

修改 nginx 配置文件，修改的地方的不多

```bash
location / {
	#root 好像不改成绝对路径也行？
    root   html;
    #添加index.php
    index  index.php index.html;
}
#取消注释就行
location ~ \.php$ {
    root           html;
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_index  index.php;
    #这里要把 /scripts 改成 $document_root
    fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    include        fastcgi_params;
}
```

接下来建立 `phpinfo();` 来进行测试是否成功

需要 phpMyAdmin 的话直接[下载](https://www.phpmyadmin.net/downloads/)解压到 D:\wnmp\nginx\html 就行。

WNMP 基本已经搭建完成了，剩下的例如配置多个域名的以后再搞:)

**2017-07-13**

发现 Nginx 并没有记录 404 错误日志，在配置文件中开启 debug 日志记录。

```bash
server {
    # ...
    error_log /path/to/log debug;
    # ...
}
```

---

## 参考

[Initializing the Data Directory Manually Using mysqld](https://dev.mysql.com/doc/refman/5.7/en/data-directory-initialization-mysqld.html)

[PHP-FastCGI on Windows](https://www.nginx.com/resources/wiki/start/topics/examples/phpfastcgionwindows/)

[windows下WNMP(windows+nginx+mysql+php)配置](http://blog.csdn.net/gsls200808/article/details/49661505)

[wnmp(windows+nginx+mysql+php)环境搭建和配置](http://www.cnblogs.com/Li-Cheng/p/4399149.html)

[A debugging log](https://nginx.org/en/docs/debugging_log.html)
