前几天新同事啊企在安装一个低版本的 OpenCart(1.5.6) 主题时，由于版本较低，安装不成功，因为连接数据库使用的还是 mysql_connect 函数，而现在的 PHP 版本一般都在 5.5 以上，在 7.0 以上更是不支持这个函数了。

在安装完之后，显示 mysql_connect 被废弃的信息

```
PHP Deprecated:  mysql_connect(): The mysql extension is deprecated and will be removed in the future: use mysqli or PDO instead in rootpath\system\database\mysql.php on line 6
```

平常遇到这种情况的话，直接在 config 文件把连接数据库的方式改为 mysqli 就可以了 (上面的并不是报错，该安装的信息还是写进数据库了)。

但是这次却不行了，改完之后页面显示 MySQLi 类重复定义，找到文件看了下 (system\database\mysqli.php)，额，看到这样的代码

```
final class MySQLi {
	/* code */
}
```

这与默认的 mysqli 类有冲突，不知道是不是买的主题出问题了还是这个版本的问题，于是乎改了类名，修改调用代码 (index.php) 但是又有一堆报错。。。而且后台在输入账号密码登录之后，也有一些错误信息，大概就是 session_start headers already sent 的错误，然后页面就是空白。

最后老严出马，鼓捣了一下之后说把错误信息禁止看下，然后修改了一点点代码 (system\database\mysql.php)

```
$this->link = @mysql_connect($hostname, $username, $password)
```

最后，清静了。

有点懵逼的感觉，弄了半天，只修改这一行代码就解决了。。。事后想了一下，既然都提示了 headers already sent 这样的信息，说明在调用 session_start 前面肯定有输出，而输出就是这个了 PHP Deprecated:  mysql_connect()，当时没注意到这个输出也会影响到后面的代码

如果是 7.0 版本以上的话，还是重写个 MySQLi 的封装吧，或者用 2.x 版本的 OpenCart

---

PS: PHP 还提供了 mysqli_connect 函数，是不是换成这样也可以呢？

```
$this->link = mysqli_connect($hostname, $username, $password)
```