<!-- title:PHP 实现 301 重定向 -->
<!-- keywords:PHP -->

PHP 中实现 301 重定向挺简单的，代码也不复杂，无非就是对域名进行判断，不是新域名就使用 header 函数进行跳转，但是中途也出现一些问题，在此做个记录。

```php
$host = 'www.new.com'; // 要跳转的域名
$query = $_SERVER['REQUEST_URI']; // 查询字段
$query2 = $_SERVER['SCRIPT_NAME'].$SERVER['QUERY_STRING']; // 也可以这样获取查询字段
// 判断访问的是否是跳转的域名，不是则进行跳转
if (strpos($_SERVER['HTTP_HOST'], $host) === false) {
	header('HTTP/1.1 301 Moved Permanently');
	header('Location: http://'.$host.$query);
}
```

情况是这样的，有两个域名 (例如 www.ab.com，www.cd.com)，都是使用同一个 ftp，即 ping 的返回 ip 是一样的，一开始直接使用 header 进行跳转时一直是重定向循环，然后在网上找到一段重定向代码，发现需要对 $_SERVER['HTTP_HOST'] 进行判断，而调试输出 $_SERVER 之后发现两个域名的 HTTP_HOST 是一样的 (例如两个域名的 HTTP_HOST 都是 www.cd.com，这样不管怎样跳转都是重定向循环)，叫客户在域名面板配置好(具体操作不知道)，在输出 $_SERVER 之后两个域名的 HTTP_HOST 不一样了，终于可以进行判断并跳转了，本来很简单的一个重定向，却因为域名没有设置好，弄了半天。

还有另一个方法是使用 .htaccess 文件，其实之前有试过，但是也是因为 HTTP_HOST 问题出现重定向循环，更改域名设置后应该可以了。

```
RewriteEngine On
RewriteCond %{HTTP_HOST} !www.old.com$ [NC]
RewriteRule ^(.*)$ http://www.new.com/$1 [R=301,L]
```

注意要确定 .htaccess 文件可用 (新建 .htaccess 文件随便输入点东西，看看有没有报错)

---

## 参考

[php完美实现多个域名指向同一网站的301转向](http://www.lseventt.com/archives/986.html)

[多个绑定多域名的PHP代码](http://www.williamlong.info/archives/372.html)

[.htaccess 301重定向详细教程](http://www.111cn.net/phper/apache/42188.htm)

[PHP: $_SERVER](http://php.net/manual/zh/reserved.variables.server.php)
