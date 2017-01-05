实现过程

1. 注册 sidebar widget (register_sidebar)

2. 添加获取分类文章的 shortcode (add_shortcode)

3. 允许在 widget 中使用 shortcode (do_shortcode)

使用的是 cherry framework 主题，所以修改的是主题下的 sidebar-init.php 文件，也可以直接写在 functions.php 文件

```php
<?php
// Register sidebars by running cherry_widgets_init() on the widgets_init hook.
add_action( 'widgets_init', 'cherry_widgets_init' );

function cherry_widgets_init() {
	// Get Posts By Category
	// Location: the sidebar
	register_sidebar( array(
		'name'          => __('Get Posts By Category', 'your-theme'),
		'id'            => 'posts-sidebar',
		'description'   => theme_locals("sidebar_desc"),
		'before_widget' => '<div id="%1$s" class="widget">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3>',
		'after_title'   => '</h3>',
	) );
}
?>
```

添加完之后，可以在后台 widgets 中看到新添加的 sidebar，接下来添加 shortcode 与允许其在 widget 使用，修改 functions.php 文件

```php
<?php
/* Allow shortcodes in widget areas */
add_filter('widget_text', 'do_shortcode');

/* 
 * Get posts by category
 */
function getPostsByCat($atts) {
    $a = shortcode_atts(array(
        'catslug' => '',
        'postnum' => 10,
    ), $atts);

    // Get category id by slug
    $catObj = get_category_by_slug($a['catslug']);
    $catId = $catObj->term_id;

    $args = array(
		'posts_per_page'   => $a['postnum'],
		'category'         => $catId,
		'orderby'          => 'date',
		'order'            => 'DESC',
		'post_type'        => 'post',
		'post_status'      => 'publish',
		'suppress_filters' => true 
	);
	$posts = get_posts( $args );

	$list .= '<div class="widget_categories"><ul>';
	foreach ($posts as $key => $post) {
		$list .= '<li><a href="'.$post->guid.'">'.$post->post_title.'</a></li>';	
	}
	$list .= '</ul></div>';

	return $list;
}
add_shortcode( 'postsbycat', 'getPostsByCat' );
```

添加完之后，可以在 sidebar 中添加 text widget，写上 shortcode，例如 [postsbycat catslug="mycat"]，最后在模板文件调用就行

## 2015-08-19

今天在使用的时候发现两个小问题。

> $atts 参数命名问题

注意参数变量命名不要有大写，最好用 _ 下划线区分单词，因为在输出 $atts 之后发现变量名全部转化为小写了，并不能正确传递参数

> 获取文章链接地址问题

在使用 guid 作为链接发现地址不对，改为 get_permalink($post->ID) 比较好

附上今天修改的代码

```php
<?php

function getPostsByCat($atts) {
	extract(shortcode_atts(array(
        'cat_id' => 0,
        'title' => 'Categories',
        'post_num'	=> 10,
    ), $atts));

    // print_r($atts);exit;

    $args = array(
    	'posts_per_page'   => $post_num,
		'category'         => $cat_id,
		'orderby'          => 'date',
		'order'            => 'DESC',
		'post_type'        => 'post',
		'post_status'      => 'publish',
		'suppress_filters' => true 
	);
	$posts = get_posts($args);

	// print_r($posts);exit;

	$list .= '<div class="widget"><h3>'.$title.'</h3><ul>';

	foreach ($posts as $key => $post) {
		$list .= '<li><a href="'.get_permalink($post->ID).'">'.$post->post_title.'</a></li>';	
	}

	$list .= '</ul></div>';

	return $list;
}
add_shortcode( 'postsbycat', 'getPostsByCat' );
```

---

## 参考

[register sidebar](https://codex.wordpress.org/Function_Reference/register_sidebar)

[add shortcode](https://codex.wordpress.org/Function_Reference/add_shortcode)

[get category by slug](https://codex.wordpress.org/Function_Reference/get_category_by_slug)

[get posts](https://codex.wordpress.org/Template_Tags/get_posts)

[PHP: extract](http://php.net/manual/en/function.extract.php)
