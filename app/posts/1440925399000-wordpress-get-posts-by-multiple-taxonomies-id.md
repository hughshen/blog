<!-- title:WordPress 获取多个自定义分类法下的文章 -->
<!-- keywords:WordPress -->

主要还是使用 WP_Query 来获取，关键是 args 参数。

```php
// 随便怎么写，反正能获取到 ids 或 slugs 就行
// 获取 post 下的要显示的分类 slug
$category_value = get_post_meta($post->ID, 'tz_category_include', true);
// 根据 slug 获取特定分类对象数组
$catObj = get_term_by('slug', $category_value, 'portfolio_category');
$catId = $catObj->term_id;
// 根据特定分类 id 获取其子分类，返回值为子分类 id 数组
$termIds = get_term_children($catId, 'portfolio_category');

// args 参数
$args = array(
	'post_type' => 'portfolio',
	'tax_query' => array(
		array(
			// 例如 'taxonomy' => 'events',
			'taxonomy' => 'portfolio_category',
			// 还可以使用 'field'    => 'slug',
			'field'    => 'id',
			// $termIds 是 id 数组，也可以是 slug 数组，根据是前面定义的 field 字段
			'terms'    => $termIds,
		)
	),
);
$query = new WP_Query($args);
```

---

## 参考

[WP Query](https://codex.wordpress.org/Class_Reference/WP_Query)

[get term by](https://codex.wordpress.org/Function_Reference/get_term_by)

[get term children](https://codex.wordpress.org/Function_Reference/get_term_children)
