<!-- title:PHPMailer 在 SSL 配置失败时的解决方法 -->
<!-- keywords:PHP, PHPMailer -->

今天在使用 PHPMailer 发邮件时遇到一个问题，显示错误是 Could not connect to SMTP host，由于之前测试成功的服务器在香港，网站上线之后转到大陆服务器了，而且 smtp 的服务器也是在香港，所以以为是服务器的原因，但是在服务器上 ping smtp 服务器是有反应的，所以应该并不是不能连接 smtp 服务器的原因。

在网上找了下类似的问题，有人提到是因为没有开启 openssl 的原因，想想很有可能，因为正好使用的是 465 ssl 端口，但查看了下，发现 openssl 已经开启了，再对比下香港服务器的 PHP 配置信息，发现大陆服务器的设置中多了两个参数，分别是 openssl.cafile 和 openssl.capath，而这两个值是空的，再对比下版本，香港服务器的 PHP 版本是 5.5.x，而大陆的是 5.6.x。

最终在 stackoverflow 找到了解决方法，有人提到了 5.6 以上的版本中 openssl 证书验证失败时 PHPMailer 需要对 smtp 设置添加一些额外的参数，需要添加下面的一段代码：

```php
// PHPMailer Version: 5.2.16
$mail->SMTPOptions = [
	'ssl' => [
		'verify_peer' => false,
		'verify_peer_name' => false,
		'allow_self_signed' => true
	]
];
```

添加了之后，确实可以发送邮件了。

在 PHPMailer 官方 wiki 中有提到，openssl 失败时会返回以下信息，不过却没找到在哪里可以看到这段日志。

```
Warning: stream_socket_enable_crypto(): SSL operation failed with code 1.
OpenSSL Error messages: error:14090086:SSL routines:SSL3_GET_SERVER_CERTIFICATE:certificate verify failed`
```

需要注意的是，上面的解决办法也是临时的，并不建议。

**2017-04-27**

最近服务器 PHP 的版本升级到 5.6 了，个别网站的邮件功能受到了影响，那些把 PHPMailer 作为第三方引入的网站还好处理，但是有相当一部分网站使用的是 WordPress，其中 SMTP 设置使用的是这个插件：[WP Mail SMTP](https://wordpress.org/plugins/wp-mail-smtp/)，该插件很好用，代码也很简洁。本来还以为要移除插件来重新修改邮件功能，所幸插件作者提供了 PHPMailer 的额外参数设置钩子：`wp_mail_smtp_custom_options`，在 functions.php 中加入下面代码就行。

```php
add_filter('wp_mail_smtp_custom_options', 'my_wp_mail_smtp_custom_options');
function my_wp_mail_smtp_custom_options($phpmailer)
{
    $phpmailer->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );
    return $phpmailer;
}
```

**2017-07-21**

今天又遇到发邮件失败的情况了 :(

确定了是服务器的问题，PHP 版本 5.6，但是使用上面的方法并没有作用，下面是一些 debug 信息：

```
...
220-We do not authorize the use of this system to transport unsolicited,
220 and/or bulk e-mail.
...
SMTP Error: Could not authenticate
...
```

看起来不能验证账号，而 SMTP 服务器是能够连接的，也显示了密码验证的过程，但就是验证失败，觉得很奇怪，Google 找到说是 cPanel/WHM 的原因，试了下，竟然成功了，原因是 cPanel 开启了 `Restrict outgoing SMTP to root, exim, and mailman (FKA SMTP Tweak)`，关闭了就好。

登录到 cPanel 后台，定位到 Home » Server Configuration » Tweak Settings，修改以下几个配置项的值。

> Restrict outgoing SMTP to root, exim, and mailman (FKA SMTP Tweak) - **Off**

> Prevent “nobody” from sending mail - **On**

> Allow users to relay mail if they use an IP address through which someone has validated an IMAP or POP3 login within the last hour (Pop-before-SMTP)  - **On**

> Add X-PopBeforeSMTP header for mail sent via POP-before-SMTP - **On**

我只修改了第一个就好了，其他的没动。

查找了下，这个配置是由于垃圾邮件发送一般会通过远程连接邮件服务器，而 cPanel 默认会开启 `SMTP Restrictions` 来防止用户这样做，更多信息可以看 [这里](https://documentation.cpanel.net/display/ALD/SMTP+Restrictions)。

额外说下，如果出现 5.6 版本 SSL 验证失败的问题，可以试下 TLS 验证，今天使用 TLS 并没出现什么问题。

还有做个记录吧，如果 Gmail SMTP 不能使用的话，可以试下修改账号的两个设置：`google less secure apps` 和 `google unlock captcha`，Google 搜索这两个关键词，一般来说，设置了之后 SMTP 就能使用了。

---

## 参考

[PHPMailer: SMTP Error: Could not connect to SMTP host](https://stackoverflow.com/questions/3477766/phpmailer-smtp-error-could-not-connect-to-smtp-host#answer-36405556)

[PHP 5.6 certificate verification failure](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting#php-56-certificate-verification-failure)

[OpenSSL changes in PHP 5.6.x](https://secure.php.net/manual/en/migration56.openssl.php)

[TLS Peer Verification w/PHP 5.6 and WordPress SMTP Email plugin](http://www.roylindauer.com/2016/09/tls-peer-verification-php56-wordpress-smtp-email-plugin/)

[cPanel Restrict outgoing SMTP Error](http://amdtllc.com/blog/article/2)
