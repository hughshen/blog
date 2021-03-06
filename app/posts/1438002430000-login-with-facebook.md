<!-- title:网页中添加 Facebook 第三方登录 -->
<!-- keywords:PHP, Facebook -->

工作项目中需要使用 facebook 第三方登录，需要调用 facebook php api，其实代码什么的都已经写好了，但是在跳转到登录页面时产生错误，google 之后发现是 facebook app 的配置没填好，把这个 api 调用过程做个记录。本次使用的 PHP SDK Version 在 2.0 以上。

## 本地配置文件

php 部分主要是修改 fbconfig.php 文件，以下是要修改的部分

```php
<?php
session_start();
// added in v4.0.0
require_once 'autoload.php';
//require 'functions.php';  
use Facebook\FacebookSession;
use Facebook\FacebookRedirectLoginHelper;
use Facebook\FacebookRequest;
use Facebook\FacebookResponse;
use Facebook\FacebookSDKException;
use Facebook\FacebookRequestException;
use Facebook\FacebookAuthorizationException;
use Facebook\GraphObject;
use Facebook\Entities\AccessToken;
use Facebook\HttpClients\FacebookCurlHttpClient;
use Facebook\HttpClients\FacebookHttpable;
// init app with app id and secret
// 这里需要填写 facebook app 的信息
FacebookSession::setDefaultApplication( 'app_id','app_secret' );
// login helper with redirect_uri
    // 这里填写网站网址
    $helper = new FacebookRedirectLoginHelper('www.example.com' );
try {
  $session = $helper->getSessionFromRedirect();
} catch( FacebookRequestException $ex ) {
  // When Facebook returns an error
} catch( Exception $ex ) {
  // When validation fails or other local issues
}
// see if we have a session
if ( isset( $session ) ) {
  // graph api request for user data
  $request = new FacebookRequest( $session, 'GET', '/me' );
  $response = $request->execute();
  // get response
  $graphObject = $response->getGraphObject();
     $fbid = $graphObject->getProperty('id');              // To Get Facebook ID
     $fbfullname = $graphObject->getProperty('name'); // To Get Facebook full name
     $femail = $graphObject->getProperty('email');    // To Get Facebook email ID
 /* ---- Session Variables -----*/
     $_SESSION['FBID'] = $fbid;           
        $_SESSION['FULLNAME'] = $fbfullname;
     $_SESSION['EMAIL'] =  $femail;
  //checkuser($fuid,$ffname,$femail);
  header("Location: index.php");
} else {
  $loginUrl = $helper->getLoginUrl();
 header("Location: ".$loginUrl);
}
?>
```

在项目中代码只是填写了这三个字段，其他的并没有修改，目前还没有出现代码代码错误的问题。

## Facebook App 配置

这次的问题出现在 app 的配置没有填好，需要注意。

APP 页面配置：

1. Setting->App Domains (填写网站地址，例如 www.example.com ，填写后会进行验证的，不需要带 http)

2. Setting->Add Platform->Site URL (填写完整的网站地址，例如 http://www.example.com)

3. Status & Review->ON (把 app 开启)

4. Settings->Advanced->Valid OAuth redirect URIs(Web OAuth Login, Embedded Browser OAuth Login) (填写网站地址，例如 http://www.example.com，意思是把网站域名添加到白名单中)

PS：第 1 与第 2 填写地址不确定是不是要这样填，有的教程是直接全部填 www.example.com 的，需要自己修改看看。

错误信息

應用程式設置無法接受特定網址: One or more of the given URLs is not allowed by the App's settings. It must match the Website URL or Canvas URL, or the domain must be a subdomain of one of the App's domains.

應用程式設置無法接受特定網址: 應用程式設定無法接受一個或多個特定的網址。網址必須符合網站的網址或畫布網址；或者，網域必須是應用程式網域的副網域之一。(繁体)。

> 域名白名单没填，看第 4

應用程式未設定: This app is still in development mode, and you don't have access to it. Switch to a registered test user or ask an app admin for permissions.

> 把 App 开启，看第 3

---

## 参考

[Facebook Login Example](https://developers.facebook.com/docs/php/howto/example_facebook_login/5.0.0)

[Login with facebook using PHP ( Demo and Download )](http://www.krizna.com/general/login-with-facebook-using-php/)

[新版 Facebook 登入遇無法接受特定網址错误](http://zlizhe.com/archives/485)
