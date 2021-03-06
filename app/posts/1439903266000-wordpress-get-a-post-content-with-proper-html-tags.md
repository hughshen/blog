<!-- title:WordPress 返回带 HTML 标签的内容 -->
<!-- keywords:WordPress -->

今天遇到一个小需求，需要在一篇文章显示另一篇文章的内容。

使用 shortcode 来实现，然后在文章中调用，shortcode 定义需要返回带 html 标签的内容。

functions.php 中添加

```php
function getAnotherPostContent($atts) {
	$atts = shortcode_atts(array(
		'post_id' => -1,
	), $atts);

	$post = get_post($atts['post_id']);
	$content = $post->post_content;

	if ($content) {
		// 对 the_content 进行过滤，不然返回的是不带 html 标签的内容。
		$content = apply_filters("the_content", $content);
	} else {
		$content = '';
	}

	return $content;
}
add_shortcode( 'showpost', 'getAnotherPostContent' );
```

最后在文章中调用就行，例如：[showpost post_id="1"]。

---

## 参考

[Get a post content with proper html tags](https://wordpress.org/support/topic/get-a-post-content-with-proper-html-tags)

[apply filters](https://codex.wordpress.org/Function_Reference/apply_filters)

[add shortcode](https://codex.wordpress.org/Function_Reference/add_shortcode)
