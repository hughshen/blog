<!-- title:php.ini 配置可修改范围 -->
<!-- keywords:PHP -->

今天在修改 PHP 配置值 upload_max_filesize 时发现使用 ini_set 并不能生效，而有时候修改 display_errors 却能成功，觉得很困惑，Google 之后才知道原来 PHP 配置有可被设定范围。

简单的说，我们平常修改的配置值 display_errors 属于 PHP_INI_ALL 模式，表明可以在任何地方设定，而 upload_max_filesize 属于 PHP_INI_PERDIR 模式，只能在特定的情况下才能被设定

PHP_INI_* 模式的定义，具体看这里 ([配置可被设定范围](https://secure.php.net/manual/zh/configuration.changes.modes.php))

> PHP_INI_USER 可在用户脚本 (例如 ini_set()) 或 Windows 注册表 (自 PHP 5.3 起) 以及 .user.ini 中设定

> PHP_INI_PERDIR 可在 php.ini，.htaccess 或 httpd.conf 中设定

> PHP_INI_SYSTEM 可在 php.ini 或 httpd.conf 中设定

> PHP_INI_ALL 可在任何地方设定

[php.ini 配置选项列表 ](https://secure.php.net/manual/zh/ini.list.php)