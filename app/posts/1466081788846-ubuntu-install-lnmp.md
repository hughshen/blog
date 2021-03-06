<!-- title:Ubuntu 1604 搭建 LNMP 环境-->
<!-- keywords:Ubuntu, LNMP, Linux, MySQL, Nginx, phpMyAdmin -->

每次重装系统都要搭建 LNMP 环境，作个记录 (Ubuntu 1604)

## 安装 Nginx

```bash
sudo apt-get update
sudo apt-get install nginx
```

安装完之后访问 localhost，看到 Welcome 的信息说明安装成功

## 安装 MySQL

```bash
sudo apt-get install mysql-server
```

过程中会要求输入 root 管理员密码，安装完之后进行一些基本的安全设置

```bash
sudo mysql_secure_installation
```

同样会要求输入密码，其他可以默认回车

## 安装 PHP

默认是 7.0 版本

```bash
sudo apt-get install php-fpm php-mysql
```

安装完之后修改 cgi.fix_pathinfo 的值，因为

> This is an extremely insecure setting because it tells PHP to attempt to execute the closest file it can find if the requested PHP file cannot be found. This basically would allow users to craft PHP requests in a way that would allow them to execute scripts that they shouldn't be allowed to execute.

```bash
sudo vim /etc/php/7.0/fpm/php.ini
```

找到 cgi.fix_pathinfo 取消注释并把值改为0

## 配置 PHP 与 Nginx

修改 nginx 站点配置文件

```bash
sudo vim /etc/nginx/sites-available/default
```

只需要把一些语句取消注释就行，下面是修改之后的文件

```bash
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	root /var/www/html;

	index index.php index.html;

	server_name _;

	location / {
		try_files $uri $uri/ =404;
	}

	location ~ \.php$ {
		include snippets/fastcgi-php.conf;
		fastcgi_pass unix:/run/php/php7.0-fpm.sock;
	}

	location ~ /\.ht {
		deny all;
	}
}
```

重启 Nginx

```bash
sudo service nginx restart
```

然后新建 info 文件来进行测试

> 多站点配置

复制 /etc/nginx/sites-available/default，例如 /etc/nginx/sites-available/example，修改的内容不多，下面是修改后的内容

```bash
server {
	# 把 default_server 去掉
	listen 80;
	listen [::]:80;

	# 修改目录
	root /var/www/html/example.com;

	index index.php index.html;

	# 添加域名
	server_name example.com www.example.com;

	location / {
		try_files $uri $uri/ =404;
	}

	location ~ \.php$ {
		include snippets/fastcgi-php.conf;
		fastcgi_pass unix:/run/php/php7.0-fpm.sock;
	}

	location ~ /\.ht {
		deny all;
	}
}
```

建立软链接并重启 Nginx 使配置生效，

```bash
sudo ln -s /etc/nginx/sites-available/example /etc/nginx/sites-enabled/example
sudo service nginx restart
```

修改 hosts 文件，把 example.com 指向 127.0.0.1

```bash
sudo vim /etc/hosts
```

添加记录

```bash
127.0.0.1	example.com
127.0.0.1	www.example.com
```

重启网络

```bash
sudo service networking restart
```

接下来访问 http://example.com/，应该可以看到域名生效了:)

## 安装 phpMyAdmin

```bash
sudo apt-get install phpmyadmin
```

建立软链接

```bash
sudo ln -s /usr/share/phpmyadmin/ /var/www/html/
```

---

当然也遇到了一些问题:(

> The mbstring extension is missing. Please check your PHP configuration

安装好扩展就行

```bash
sudo apt-get install php-mbstring
sudo apt-get install php-gettext
```

> phpMyAdmin登录成功之后跳转到根目录

问题: 访问 http://localhost/phpmyadmin/ ，登录之后跳转到 http://localhost/index.php?token={token}，再次访问 http://localhost/phpmyadmin/，则能正常使用。

解决: 找到文件 /var/www/html/phpmyadmin/libraries/config.default.php ，并修改 $cfg['PmaAbsoluteUri'] 的值

```php
// http://www.your_web.net/path_to_your_phpMyAdmin_directory/
$cfg['PmaAbsoluteUri'] = 'localhost/phpmyadmin';
```

---

## 参考

[How To Install Linux, Nginx, MySQL, PHP (LEMP stack) in Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-in-ubuntu-16-04)
