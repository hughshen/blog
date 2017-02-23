<!-- title:使用 usort 函数对二维数组进行排序 -->
<!-- keywords:PHP, usort -->

PHP 提供了很多的排序函数，看了一下，好像没有对二维数组以上进行排序的函数，但是有一个 `usort()` 函数，可以使用用户自定义的函数 (也可以是匿名函数) 进行排序，这个函数可以满足需求，以下官方手册上的一个简单例子。

```php
<?php
function cmp($a, $b) {
    if ($a == $b) return 0;
    return ($a < $b) ? -1 : 1;
}

$a = array(3, 2, 5, 6, 1);
usort($a, "cmp");
?>
```

对二维数组以上，只需要做一点点修改，手册也给出了例子。

```php
<?php
// 对 fruits 数组按 color 进行排序
function cmp($a, $b) {
    if ($a["color"] == $b["color"]) return 0;
    return ($a["color"] > $b["color"]) ? 1 : -1;
}

$fruits[0]["fruit"] = "lemons";
$fruits[0]["color"] = "yellow";
$fruits[1]["fruit"] = "apples";
$fruits[1]["color"] = "red";
$fruits[2]["fruit"] = "grapes";
$fruits[2]["color"] = "purple";

usort($fruits, "cmp");
?>
```

usort 函数还可以做更多复杂的排序，具体去看官方手册。

## 2015-09-07

今天在使用 usort 时，新建一个自定义函数，然后报错，说是什么函数 declare 的问题，即使是换一个自定义函数还是一样报错，最后还是使用了匿名函数来解决。

```php
usort($fruits, function ($a, $b) {
    if ($a["color"] == $b["color"]) return 0;
    return ($a["color"] > $b["color"]) ? 1 : -1;
});
```

---

## 参考

[Sorting Arrays](http://php.net/manual/en/array.sorting.php)

[usort](http://php.net/manual/zh/function.usort.php)
