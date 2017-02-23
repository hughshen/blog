<!-- title:WordPress 文章自定义 wpautop 过滤内容 -->
<!-- keywords:WordPress -->

在使用 WordPress 开发过程中，有的时候需要对主题进行二次开发，而主题有时候会依赖 WordPress 的 wpautop 来对内容进行过滤，特别是后台使用可拖动编辑器的情况下，如果某些页面使用内置编辑器的话，则输出的内容会多出一些不必要的标签，例如 `<p><p/>`，`<br>` 等等，这时候，在前台输出的页面则容易样式混乱。

最好的做法是移除 wpautop 的过滤钩子，为了与主题兼容，可以针对需要移除的文章来处理，在 functions.php 中加入代码

```php
function get_rid_of_wpautop()
{
	// 判断是否是需要移除的文章
	$id = get_the_ID();
	if ($id > 0) {
		$meta = get_post_meta($id, 'nowpautop', true);
		if ((int)$meta == 1) {
			remove_filter('the_content', 'wpautop');
		}
	}
}
add_action('template_redirect', 'get_rid_of_wpautop');
```

---

## 参考

[enable wpautop filter on single posts only](https://stackoverflow.com/questions/3685476/enable-wpautop-filter-on-single-posts-only)
