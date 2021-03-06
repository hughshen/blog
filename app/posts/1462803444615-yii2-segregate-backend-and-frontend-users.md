<!-- title:Yii2 前后台用户分离 -->
<!-- keywords:Yii2 -->

Yii2 要分离前后台用户需要把前台与后台的 Session 与 Cookie 区分开来。

环境：高级模板

为了方便，直接使用 Migrate 复制默认的 user 表来建立 manager 表，同时需要建立以下的类。

> common\models\User => common\models\Manager

> common\models\UserForm => common\models\ManagerForm

> frontend\models\SignupForm => backend\models\SignupForm (注册)

建立好文件并修改无误之后需要配置 main.php 文件。

```php
// frontend
'user' => [
    'identityClass' => 'common\models\User',
    'enableAutoLogin' => true,
    'idParam' => '__user',
    'identityCookie' => [
        'name' => '__user_identity',
        'httpOnly' => true
    ],
    'loginUrl' => ['/site/login'],
],
// frontend end

// backend
'user' => [
    'identityClass' => 'common\models\Manager',
    'enableAutoLogin' => true,
    'idParam' => '__manager',
    'identityCookie' => [
        'name' => '__manager_identity',
        'httpOnly' => true
    ],
    'loginUrl' => ['/site/login'],
],
// 以下两个配置是为了区分前台与后台的 session 与 cookie
'session' => [
    'name' => 'BACKENDPHPSESSID',
    'savePath' => sys_get_temp_dir(),
],
'request' => [
    'cookieValidationKey' => 'CDH14yygmb45DoJOCNYGSE18pupDkrKd',
    'csrfParam' => '_backendCSRF',
],
// backend end
```

配置完成。

PS: 过程中漏了配置 session 与 request，发现总是会同时登出，原因是登出时会调用 Yii::$app->user->logout() ，这会默认把所有 session 清除，除非这样调用 Yii::$app->user->logout(false)，所以还是在 main.php 文件中配置方便点，统一管理。

**2017-02-16**

在 2.0.10 及之后的版本里已经添加了区分前后台用户 Session 与 Cookie 的配置

---

## 参考

[Yii2的相关学习记录，前后台分离及migrate使用(七)](http://www.cnblogs.com/vishun/p/5450386.html)

[Yii2的多用户认证](http://www.lostsky.org/2016/03/06/70/)
