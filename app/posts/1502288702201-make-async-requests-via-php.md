<!-- title:PHP 实现异步调用 -->
<!-- keywords:PHP, CURL -->

PHP 实现异步调用在客户端的话比较简单，比如在页面加载完成后 jQuery 发送 AJAX 请求，或者嵌入到 img 标签，然后 src 指向请求，之前写的这篇文章 [Nginx + Google Analytics 配置](/post/nginx-with-google-analytics.html) 就是使用 img 标签来触发谷歌分析统计，这两种都会比较依赖于浏览器与用户。

在服务端异步调用的话可以使用 `curl` 与 `fsockopen` 函数，下面是一个简单的测试例子，其中 res.php 是请求文件。

```php
// test.php

function sendCURL($method = 'get', $data = [])
{
    $url = 'http://127.0.0.1:8080/res.php';
    $method = strtoupper($method);
    $query = http_build_query($data);

    if ($method == 'GET') {
        $url .= "?$query";
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
    curl_setopt($ch, CURLOPT_TIMEOUT, 1);
    curl_setopt($ch, CURLOPT_POST, $method === 'POST');

    $response = curl_exec($ch);

    // if ($response === false) {
    //     print_r(curl_getinfo($ch));
    //     echo '<br>';
    //     echo curl_errno($ch) . '<br>';
    //     echo curl_error($ch) . '<br>';
    // } else {
    //     header('Content-Type: text/plain');
    //     echo "CURL Response ({$method}): \r\n";
    //     print_r($response);
    // }

    curl_close($ch);
}

function sendSock($method = 'get', $data = [])
{
    $host = '127.0.0.1';
    $path = '/res.php';
    $port = 8080;

    $fp = fsockopen($host, $port, $errno, $errstr, 30);

    if (!$fp) {
        echo "$errstr ($errno)<br />\n";
    } else {

        $method = strtoupper($method);
        $content = http_build_query($data);

        if ($method === 'GET') {
            $path .= "?{$content}";
        }

        fwrite($fp, "{$method} {$path} HTTP/1.1\r\n");
        fwrite($fp, "Host: {$host}\r\n");
        fwrite($fp, "Content-Type: application/x-www-form-urlencoded\r\n");
        fwrite($fp, "Content-Length: " . strlen($content) . "\r\n");
        fwrite($fp, "Connection: close\r\n");
        fwrite($fp, "\r\n");

        fwrite($fp, $content);

        // header('Content-Type: text/plain');
        // echo "Sock Response ({$method}): \r\n";
        // while (!feof($fp)) {
        //     echo fgets($fp, 1024);
        // }

        fclose($fp);
    }
}

sendCURL('get', ['hello' => 'world!']);

echo "\r\n\r\n";
sendCURL('post', ['hello' => 'world!']);

echo "\r\n\r\n";
sendSock('get', ['hello' => 'world!']);

echo "\r\n\r\n";
sendSock('post', ['hello' => 'world!']);
```

```php
// res.php

$data = [];
$data['method'] = $_SERVER['REQUEST_METHOD'];
$data['data'] = $_REQUEST;

sleep(5);

print_r($data);
```

本来准备简单的使用 `http://localhost/res.php` 来做请求地址，但是两个函数都不能访问连接，感觉很奇怪，最后还是新开一个端口做请求。

```
php -S 127.0.0.1:8080 -t /path/to/test/
```

把执行结果忽略，就可以做到异步调用了，把注释去掉，也可以看到结果，但是执行时间就不会缩短了。

执行上面的文件，大概要等 2 秒才能完成加载，因为 `curl` 中的 `CURLOPT_TIMEOUT` 最低为 1 秒，这没办法，下面是 res.php 的执行结果。

```
[Wed Aug 9 22:55:41 2017] 127.0.0.1:14467 [200]: /res.php?hello=world%21
[Wed Aug 9 22:55:46 2017] 127.0.0.1:14469 [200]: /res.php
[Wed Aug 9 22:55:51 2017] 127.0.0.1:14470 [200]: /res.php?hello=world%21
[Wed Aug 9 22:55:56 2017] 127.0.0.1:14471 [200]: /res.php
```

可以看到，每隔 5 秒，页面请求一次，就是说浏览器加载完了，后台还会继续执行之前的请求，这对用户体验来说会比较好，可以应用在发邮件通知等等。

---

## 参考

[PHP实现异步调用方法研究](http://www.laruence.com/2008/04/14/318.html)
