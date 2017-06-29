<!-- title:WordPress 搜索添加自定义字段 -->
<!-- keywords:WordPress -->

昨天工作需要修改 WordPress 搜索功能，就是在搜索时把 post_excerpt 也添加到查询当中，用的是 wordpress 自带 pre_get_posts 的 api，添加到 add_action 就行，想要添加其他自定义字段也是类似的。

把代码添加到 functions.php中

```php
/* add excerpt search */
add_action('pre_get_posts', 'jc_woo_search_pre_get_posts');
function jc_woo_search_pre_get_posts($query)
{
    if (is_search()) {
        add_filter('posts_join', 'jc_search_post_join'); // ingore this
        add_filter('posts_where', 'jc_search_post_excerpt');
    }
}

function jc_search_post_excerpt($where = '')
{
    global $wpdb;
    global $wp_the_query;

    if (empty($wp_the_query->query_vars['wc_query']) && empty($wp_the_query->query_vars['s'])) {
        return $where;
    }
 
    $where = preg_replace(
        "/post_title LIKE ('%[^%]+%')/",
        "post_title LIKE $1) OR (" . $wpdb->prefix . "posts.post_excerpt LIKE $1 ",
        $where
    );
    return $where;
}
/* end search */
```

中途容易出错的是 where 语句，可以先把 where 语句输出来，然后再输出修改后的 where 语句来进行对比，这样容易找出错误，显然 where 语句是用来修改搜索查询时要用来进行对比的字段，类似的还有 posts_join 用法，在查找解决方法过程中找到了另一个类似的插件，作个记录：[Search by Product Tag for Woocommerce](https://wordpress.org/support/view/plugin-reviews/search-by-product-tags-for-woocommerce)

**2017-06-27**

今天有个需求要过滤搜索文章的结果，由于使用了 [WooCommerce](https://wordpress.org/plugins/woocommerce/) 插件，要求搜索结果只包含产品，不包含其他任何文章，记录一下。

```php
// pre_get_posts
// 只搜索产品
function my_woocommerce_filter_search($query)
{
    if (!is_admin() && is_search() && $query->is_main_query()) {
        $query->set('post_type', array('product'));
    }
    return $query;
}
add_filter('pre_get_posts', 'my_woocommerce_filter_search');

// wp_post_types
// 去除某个自定义文章类型
function my_remove_custom_type_for_search()
{
    global $wp_post_types;
    if (post_type_exists('custom-type')) {
        $wp_post_types['custom-type']->exclude_from_search = true;
    }
}
add_action('init', 'my_remove_custom_type_for_search', 99);
```

中途漏了 `$query->is_main_query()` 这个判断，导致某些内容获取不到，例如头部的菜单显示空白。

**2017-06-29**

添加 Custom Fields 搜索。

```php
function add_meta_to_search_in_join_function($join)
{
    global $wpdb;
    if (is_search()) {
        $join .= ' LEFT JOIN ' . $wpdb->postmeta . ' ON ' . $wpdb->posts . '.ID = ' . $wpdb->postmeta . '.post_id ';
    }
    return $join;
}
add_filter('posts_join', 'add_meta_to_search_in_join_function');

function add_meta_to_search_in_where_function($where)
{
    global $wpdb;
    if (is_search()) {
        $meta_keys = array('m_key_1', 'm_key_2');
        $replace = array();
        foreach ($meta_keys as $key) {
            $replace[] = "(" . $wpdb->postmeta . ".meta_key = '" . $key . "' AND " . $wpdb->postmeta . ".meta_value LIKE $1)";
        }
        $replace = !empty($replace) ? implode(" OR ", $replace) : '';
        $where = preg_replace(
            "/\(\s*" . $wpdb->posts . ".post_title\s+LIKE\s*(\'[^\']+\')\s*\)/",
            // "(" . $wpdb->posts . ".post_title LIKE $1) OR (" . $wpdb->postmeta . ".meta_value LIKE $1)",
            "(" . $wpdb->posts . ".post_title LIKE $1) OR (" . $replace . ")",
            $where
        );
    }
    return $where;
}
add_filter('posts_where', 'add_meta_to_search_in_where_function');

function add_meta_to_search_in_distinct_function($where)
{
    global $wpdb;
    if (is_search()) {
        return "DISTINCT";
    }
    return $where;
}
add_filter('posts_distinct', 'add_meta_to_search_in_distinct_function');
```

---

## 参考

[How to Add custom fields to Woocommerce product search](http://jamescollings.co.uk/blog/extending-woocommerce-search-query-include-custom-fields/)

[pre_get_posts](https://codex.wordpress.org/Plugin_API/Action_Reference/pre_get_posts)

[posts_where](http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_where)

[posts_join](http://codex.wordpress.org/Plugin_API/Filter_Reference/posts_join)

[WordPress Exclude Custom Post Type from Search](https://wp-mix.com/wordpress-exclude-custom-post-type-search/)

[Exclude Custom Post Type From Search in WordPress](http://www.webtipblog.com/exclude-custom-post-type-search-wordpress/)

[Search WordPress by Custom Fields without a Plugin](https://adambalee.com/search-wordpress-by-custom-fields-without-a-plugin/)
