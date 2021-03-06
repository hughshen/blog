<!-- title:PHP 下子域名共享 Cookies -->
<!-- keywords:PHP -->

PHP 在子域名下共享 Cookies，比如登录信息。

直接使用 PHP 来处理

```php
ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', '.domain.com');
```

在 Yii2 下，需要在组件中对 session 与 user 进行设置

```php
'components' => [
    'session' => [
        // ...
        'cookieParams' => [
            'path' => '/',
            'domain' => ".domain.com",
        ],
    ],
    'user' => [
        // ...
        'identityCookie' => [
            'name' => '_identity',
            'path' => '/',
            'domain' => ".domain.com",
        ],
    ],
    'request' => [ // 非必需
        // ...
        'csrfCookie' => [
            'name' => '_csrf',
            'path' => '/',
            'domain' => ".domain.com",
        ],
    ],
],
```

---

## 参考

[Automagically Log into Multiple Domains in Yii2](https://stackoverflow.com/questions/29378697/automagically-log-into-multiple-domains-in-yii2)

[Managing cookies](https://github.com/samdark/yii2-cookbook/blob/master/book/cookies.md)