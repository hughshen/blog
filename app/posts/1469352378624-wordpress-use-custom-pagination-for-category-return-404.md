<!-- title:WordPress 分类页面使用自定义分页显示 404 -->
<!-- keywords:WordPress -->

不知道是什么原因造成的，但是修改了之后确实是没有问题了，具体可以看参考

```php
// 如果多处地方需要用到参数的话，可以定义一下， 方便修改
function my_posts_per_page() {
	return 15;
}

function cure_wp_amnesia_on_query_string($query_string) {
	if (!is_admin()) {
		if (isset($query_string['category_name']) && $query_string['category_name']) {
			$query_string['posts_per_page'] = my_posts_per_page();
		}
	}
	return $query_string;
}
add_filter('request', 'cure_wp_amnesia_on_query_string');
```

之后在 category-*.php 页面调用 `pagination($slug, my_posts_per_page())` 就可以正常显示了

---

## 参考

[Explanation and workaround for error 404 on category pagination](https://wordpress.org/support/topic/explanation-and-workaround-for-error-404-on-category-pagination)