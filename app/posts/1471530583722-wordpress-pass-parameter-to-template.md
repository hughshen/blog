<!-- title:WordPress 调用模板文件时传递参数 -->
<!-- keywords:WordPress -->

WordPress的 `get_template_part()` 函数不能向模板传递参数

但其实有个很简单的方法，代码如下，注意要加上文件后缀

```php
<?php include(locate_template('filename.php')) ?>

// 直接在子模板文件中使用变量，例如
<?php print_r($var) ?>
```

另外有人已经封装好方法了 ([GitHub](https://github.com/Smartik89/SMK-Theme-View/blob/master/functions.php))

使用方法

```php
<?php
smk_get_template_part('filename.php', array(
   'var' => 'content',
));
?>

<?php
// 使用变量
echo $this->var; // Output content
?>
```

PS：好像直接用 include 或者 require 更方便?...

---

## 参考

[How to pass variable through get_template_part()](https://themeforest.net/forums/thread/how-to-pass-variable-through-get_template_part/123845)