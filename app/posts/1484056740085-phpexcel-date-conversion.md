<!-- title:PHPExcel 单元格日期转换 -->
<!-- keywords:PHPExcel -->

今天在使用 PHPExcel 时又遇到单元格是日期的问题，在转换成 PHP 日期格式总是转换成当天的日期，即使两个单元格日期数值不一样还是返回当前日期，网上找的大多数是两种方法 `PHPExcel_Style_NumberFormat::toFormattedString` 和 `PHPExcel_Shared_Date::ExcelToPHP`，但是都试过一样返回当前日期 (应该是使用方法不过)，不过还是找到了第三种方法，作个记录

```php
UNIX_DATE = (EXCEL_DATE - 25569) * 86400 // 转成 PHP 格式日期
EXCEL_DATE = 25569 + (UNIX_DATE / 86400) // 转成 PHPExcel 日期
// 使用
$UNIX_DATE = ($EXCEL_DATE - 25569) * 86400;
echo gmdate("d-m-Y H:i:s", $UNIX_DATE); // 也可以使用 date 函数
```

至于 25569 怎么来的，我看到 `PHPExcel_Shared_Date::ExcelToPHP` 这里有定义，应该是从这个简化来的吧，不过可能会有坑 :(

---

## 参考

[Excel date conversion using PHP Excel](https://stackoverflow.com/questions/11119631/excel-date-conversion-using-php-excel)