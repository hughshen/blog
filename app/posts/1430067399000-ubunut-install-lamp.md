<!-- title:Ubuntu 下安装 LAMP -->
<!-- keywords:Ubuntu, LAMP, Linux, Apache, MySQL, phpMyAdmin -->

服务器版本 Ubuntu 1404

> 安装 Apache2

```bash
sudo apt-get install apache2
```

在浏览中输入 localhost，显示 It's works! 表示成功。

> 安装 PHP5

```bash
sudo apt-get install php5 libapache2-mod-php5
```

在 /var/www/html/ 建立一个测试文件，查看 PHP 与 Apache 是否一起工作。

> 安装 Mysql

```bash
sudo apt-get install mysql-server #一般会要求输入密码
mysql -u root -p #测试 mysql 是否安装成功
show databases;
```

> 配置 PHPMyadmin

```bash
sudo apt-get install libapache2-mod-auth-mysql php5-mysql phpmyadmin
```

*建立 phpmyadmin 软链接*

```bash
sudo ln -s /usr/share/phpmyadmin/ /var/www/html/
```

*PHP 的一些扩展*

```bash
sudo apt-get install php5 php5-cgi php5-mysql php5-curl php5-gd php5-idn php-pear php5-imagick php5-imap php5-mcrypt php5-memcache php5-mhash php5-ming php5-pspell php5-recode php5-snmp php5-tidy php5-xmlrpc php5-sqlite php5-xsl
```

## 中途遇到的问题

> Could not reliably determine the server's fully qualified domain name, using 127.0.1.1. Set the 'ServerName' directive globally to suppress this message

```bash
sudo vim /etc/apache2/apache2.conf
```

在 ServerRoot 下面添加 ServerName 127.0.0.1

> 缺少 mcrypt 扩展。请检查 PHP 配置。

注: mcrypt 是 php 里面重要的加密支持扩展库，可以实现加密解密功能，就是既能将明文加密，也可以密文还原

在 /etc/php5/apache2/conf.d/ 文件夹下

```bash
sudo apt-get install php5-mcrypt #安转了的话就不用
sudo ln -s ../../mods-available/mcrypt.ini 20-mcrypt.ini 
```

注意 ini 文件下的 ;priority 值

> 设置首页运行 index.html index.php 的顺序

编辑文件 /etc/apache2/sites-available/000-default.conf

```
<Directory /xxx>
DirectoryIndex index.php index.html
</Directory>
```

不成功的话需要编辑 /etc/apache2/apache2.conf

---

## 参考

[Ubuntu下安装LAMP及phpmyadmin](http://www.cnblogs.com/ubuntubox/archive/2011/04/07/2008258.html)

[在ubuntu上配置nginx+php+mysql+phpmyadmin](http://www.lvtao.net/server/499.html)
