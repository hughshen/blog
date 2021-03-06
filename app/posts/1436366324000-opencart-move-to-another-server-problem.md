<!-- title:OpenCart 从本地上传到服务器 -->
<!-- keywords:OpenCart -->

一般都要进行的几步

> 导出本地数据库

> 在本地调试好的目录上传到服务器

> 导入本地数据库 (在导入前可能需要把 sql 文件里有关 localhost 的信息替换成 server 的，还有数据库名称)

> 修改 config 文件 (根目录与 admin 目录)

```php
<?php
// HTTP
// 直接填写网站地址就行
define('HTTP_SERVER', 'http://www.test.com/');
define('HTTP_IMAGE', 'http://www.test.com/image/');
define('HTTP_ADMIN', 'http://www.test.com/admin/');

// HTTPS
// 一样填写网站地址
define('HTTPS_SERVER', 'http://www.test.com/');
define('HTTPS_IMAGE', 'http://www.test.com/image/');

// DIR
// 注意这里是填写物理地址
// 可以使用 php 输出服务器的物理地址
// echo $_SERVER['DOCUMENT_ROOT']
define('DIR_APPLICATION', '/var/www/public_html/catalog/');
define('DIR_SYSTEM', '/var/www/public_html/system/');
define('DIR_DATABASE', '/var/www/public_html/system/database/');
define('DIR_LANGUAGE', '/var/www/public_html/language/');
define('DIR_TEMPLATE', '/var/www/public_html/view/template/');
define('DIR_CONFIG', '/var/www/public_html/system/config/');
define('DIR_IMAGE', '/var/www/public_html/image/');
define('DIR_CACHE', '/var/www/public_html/system/cache/');
define('DIR_DOWNLOAD', '/var/www/public_html/download/');
define('DIR_LOGS', '/var/www/public_html/system/logs/');

// DB
// 数据库信息，没什么好说的
define('DB_DRIVER', 'mysql');
define('DB_HOSTNAME', 'localhost');
define('DB_USERNAME', 'database_name');
define('DB_PASSWORD', 'database_pass');
define('DB_DATABASE', 'opencart');
define('DB_PREFIX', 'oc_');
?>
```

## 服务器目录与文件权限

按照官方 Installation，这几个文件需要可写权限

```
system/cache/
system/logs/
image/
image/cache/
image/data/
download/
```

做完这几步后，打开首页，一看全是 fopen、fwrite、permission deny 的错误，直接把根目录全改为 777，清净了(不建议这么做)；中途也遇到了两个问题

> 上传完毕后，打开首页或者 admin 全是空白的

在 index.php 文件加上

```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

> 显示错误，发现不能读取到 system/startup.php

config.php 中的 DIR 配置填写的是网站地址，改为物理地址就可以了

> Error: Could not load database driver type mysql!

还是 config.php 文件，database 目录配置错误，找到这一行

```php
define('DIR_DATABASE', '/var/www/public_html/database/');
//改为
define('DIR_DATABASE', '/var/www/public_html/system/database/');
```
