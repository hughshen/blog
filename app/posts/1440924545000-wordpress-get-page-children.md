<!-- title:WordPress 获取子页面 -->
<!-- keywords:WordPress -->

获取子页面很简单，代码也不长，需要注意的变量的传递问题。

代码

```php
// get_page_children 方法
// 首先获取到需要的 pages
// $query = new WP_Query();
// $pages = $query->query(array('post_type' => 'page', 'posts_per_page' => -1));
$pages = get_posts('post_type=page&posts_per_page=-1&orderby=date&order=DESC');
$page_children = get_page_children(get_the_ID(), $pages);

// get_children 方法
$page_children = get_children(array(
	'post_parent' => get_the_ID(),
	'post_type' => 'page',
	'numberposts' => -1,
	'post_status' => 'publish'
));
$page_children = array_values($page_children);
```

---

## 参考

[get page children](http://codex.wordpress.org/Function_Reference/get_page_children)

[get children](https://codex.wordpress.org/Function_Reference/get_children)
