<!-- title:PHP 调用雅虎汇率 API -->
<!-- keywords:PHP -->

调用地址是: `http://download.finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=CNYHKD=x`

> CNYHKD 为必填，指人民币 (CNY) 与港币 (HKD) 的汇率，可以换成其他国家的货币代码

> 返回数据："CNYHKD=x",1.1568,"7/18/2016","1:43pm"

```php
$url = 'http://download.finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=CNYHKD=x';
$file = fopen($url, 'r');
$data = fgetcsv($file);
fclose($file);
print_r($data); // $data[1]为汇率
```