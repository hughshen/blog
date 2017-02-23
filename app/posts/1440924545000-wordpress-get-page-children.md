<!-- title:WordPress 获取子页面 -->
<!-- keywords:WordPress -->

获取子页面很简单，代码也不长，需要注意的变量的传递问题。

代码

```php
<?php
// 首先获取到需要的 pages，可以自定义 args
$query = new WP_Query();
$pages = $query->query(array('post_type' => 'page', 'posts_per_page' => -1,));

// 需要把前面获取到的 $pages 作为参数传递到 get_page_children 方法中
$page_children = get_page_children($page->ID, $pages);
?>
```

---

## 参考

[get page children](http://codex.wordpress.org/Function_Reference/get_page_children)
