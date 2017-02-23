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

---

## 参考

[PHPMailer: SMTP Error: Could not connect to SMTP host](https://stackoverflow.com/questions/3477766/phpmailer-smtp-error-could-not-connect-to-smtp-host#answer-36405556)

[PHP 5.6 certificate verification failure](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting#php-56-certificate-verification-failure)