<!-- title:PHP 调试追踪 -->
<!-- keywords:PHP -->

今天有个 WordPress 的网站不能登录后台，打开页面显示下面的错误的信息：

```
Fatal error: Call to undefined function wp_get_current_user() in /public_html/wp-includes/user.php on line 209
```

看了下代码，发现网站的 WordPress 版本才 3.5.1，现在最新版本为 4.7.4，对比下错误文件 209 行，发现新的版本里面已经对 `wp_get_current_user` 有了 `function_exists` 的判断，由于网站最开始的代码不是我们写的，版本也比较旧，不好随便升级，再查看了下插件，发现有一些插件有过改动，也许是插件升级带来的问题 (这里可以直接在数据库停用所有插件来测试 `UPDATE wp_options SET option_value = '' WHERE option_name = 'active_plugins'`)，看下能不能找出是哪个插件调用了未定义函数。

PHP 提供了 `debug_backtrace` 函数来获取回溯跟踪信息，这里刚好可以使用，在 209 行前添加：

```php
print_r(debug_backtrace());
```

这时候应该会输出一个数组变量，里面包含了调用过程的文件路径，代码调用行数，函数名等信息，这时候很明显就看到了某个插件的文件调用了 `wp_get_current_user`，但是此时该函数并没有定义，所以就报错了，停止该插件之后，果然可以正常登录了，这个就不知道是插件还是 WordPress 的 Bug 了，下面是简略数组信息：

```
Array
(
    [0] => Array
        (
            [file] => /public_html/wp-content/plugins/some-plugin/some-plugin.php
            [line] => 484
            [function] => get_current_user_id
            [args] => Array
                (
                )

        )

    [1] => Array() ...
)
```

以前不知道有 `debug_backtrace` 这个函数，感觉还是挺实用的，在接手别人代码调试时应该不错 :)

---

## 参考

[debug_backtrace](https://secure.php.net/manual/en/function.debug-backtrace.php)

[Caller function in PHP 5?](https://stackoverflow.com/questions/190421/caller-function-in-php-5)
