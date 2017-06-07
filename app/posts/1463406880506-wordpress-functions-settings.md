<!-- title:WordPress 主题常用 functions -->
<!-- keywords:WordPress -->

创建新的主题时 functions.php 的一些常用设置。

```php
<?php

// Remove wpautop
// remove_filter('the_content', 'wpautop');

// Remove wp_head or wp_footer actions
// Actions added in /wp-includes/default-filters.php
// remove_action('wp_head', '_wp_render_title_tag', 1);
// remove_action('wp_head', 'wp_enqueue_scripts', 1);
// remove_action('wp_head', 'wp_print_styles', 8);
// remove_action('wp_head', 'wp_print_head_scripts', 9);
// remove_action('wp_footer', 'wp_print_footer_scripts');
remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'index_rel_link');
remove_action('wp_head', 'parent_post_rel_link', 10, 0);
remove_action('wp_head', 'start_post_rel_link', 10, 0);
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
remove_action('wp_head', 'locale_stylesheet');
remove_action('wp_head', 'noindex', 1);
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rel_canonical');
remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_head', 'wp_oembed_add_discovery_links');
remove_action('wp_head', 'wp_oembed_add_host_js');

// Add custom scripts
function add_custom_scripts_function()
{
	// get_stylesheet_directory_uri();
	wp_enqueue_style('custom-style', get_template_directory_uri() . '/css/custom.css');
	// Without version
	// wp_enqueue_style('custom-style', get_template_directory_uri() . '/css/custom.css', array(), null);
	wp_enqueue_script('custom-script', get_template_directory_uri() . '/js/custom.js', array('jquery'), '1.0', true);
	// Register script
	wp_register_script('custom-register-script', get_template_directory_uri() . '/js/custom.register.js');
}
add_action('wp_enqueue_scripts', 'add_custom_scripts_function');

// Remove menus
function remove_menus()
{
	remove_menu_page('edit-comments.php');
	remove_menu_page('tools.php');
}
add_action('admin_menu', 'remove_menus');

// Remove script and style html tags
function remove_script_and_style_tags_function($content)
{
	$new_content = preg_replace('/<(script|style)[^>]*?>.*?<\/\1>/si', '', $content);
	return $new_content;
}
add_filter('the_content', 'remove_script_and_style_tags_function');

// Register nav menus
if (function_exists('register_nav_menus'))
{
	register_nav_menus(array(
		'header' => 'Header Menu',
		'footer' => 'Footer Menu',
	));
}

// Add 'active' class for menu
function special_nav_class($classes, $item)
{
	if (in_array('current-menu-item', $classes) || in_array('current-menu-ancestor', $classes)) {
		$classes[] = ' active ';
	}
	return $classes;
}
add_filter('nav_menu_css_class', 'special_nav_class', 10, 2);

// Add featured image
if (function_exists('add_theme_support')) {
	add_theme_support('post-thumbnails');
}

// add excerpt for page
if (function_exists('add_post_type_support')) {
	add_post_type_support('page', 'excerpt');
}

// Register widgets area
if(function_exists('register_sidebar')) {
	register_sidebar(array(
		'name' => 'Header Area',
		'id' => 'header-area',
		'before_widget' => '',
		'after_widget' => '',
		'before_title' => '<h4>',
		'after_title' => '</h4>'
	));
	register_sidebar(array(
		'name' => 'Footer Area 1',
		'id' => 'footer-area-1',
		'before_widget' => '',
		'after_widget' => '',
		'before_title' => '<h4>',
		'after_title' => '</h4>'
	));
}

// Add slider page
function register_post_type_slider_function()
{
	register_post_type( 'slider', array(
		'label'               => 'Slider',
		'exclude_from_search' => true, // Exclude from Search Results
		'public'              => false,
		'show_ui'             => true,
		'menu_icon'           => 'dashicons-slides',
		'supports'            => array('title', 'thumbnail'),
	));
}
add_action('init', 'register_post_type_slider_function');

// Add logo page
function register_logo_post_type_function()
{
	register_post_type('logo', array(
		'label'               => 'Logo',
		'exclude_from_search' => true,
		'public'              => false,
		'show_ui'             => true,
		'supports'            => array('title', 'thumbnail', 'custom-fields'),
	));
}
add_action('init', 'register_logo_post_type_function');

// Custom pagination
function my_pagination($category_slug, $show_items = 10, $range = 2)
{
	$paged = get_query_var('paged', 1);

	$query = new WP_Query(array(
		'category_name' => $category_slug,
		'post' => 'post',
		'posts_per_page' => -1
	));

	$total_posts = $query->post_count;

	if (empty($paged)) $paged = 1;
	$prev = $paged - 1 > 0 ? $paged - 1 : 1;
	$next = $paged + 1;

	$pages = ceil($total_posts / $show_items);

	if ($pages < 2) return;

	$html = '<ul class="pagination">';

	// $html .= ($paged > 2 && $pages > $paged) ? '<a href="' . get_pagenum_link(1) . '">&lt;&lt;</a>' : '';
	$html .= ($paged > 1) ? '<li><a href="' . get_pagenum_link($prev) . '" aria-label="Previous"><span aria-hiddentrue>&lt;</span></a></li>' : '';

	$left_range = ($paged - $range > 1) ? $paged - $range : 2;
	$right_range = ($paged + $range >= $pages) ? $pages - 1 : $paged + $range;
	$range_arr = range($left_range, $right_range);
	array_unshift($range_arr, 1);
	array_push($range_arr, $pages);

	$left_dots = false;
	$right_dots = false;
	for ($i = 1; $i <= $pages; $i++) {
		if (in_array($i, $range_arr)) {
			if ($paged == $i) {
				$html .= '<li class="active"><a href="javascript:;">' . $i . '</a></li>';
			} else {
				$html .= '<li><a href="' . get_pagenum_link($i) . '">' . $i . '</a></li>';
			}
		} else {
			if (($paged < $i && !$left_dots) || ($paged > $i && !$right_dots)) {
				$html .= '<li><span>...</span></li>';
				if ($paged < $i) {
					$left_dots = true;
				} else {
					$right_dots = true;
				}
			}
		}
	}

	$html .= ($paged < $pages) ? '<li><a href="' . get_pagenum_link($next) . '" aria-label="Next"><span aria-hidden="true">&gt;</span></a></li>' : '';
	// $html .= ($paged < $pages) ? '<a href="' . get_pagenum_link($pages) . '">&gt;&gt;</a>' : '';

	$html .= '</ul>';

	return $html;
}

// Shortcode Start
function shortcode_function ($atts, $content = '')
{
	extract(shortcode_atts(array(
		'slug' => '',
	), $atts));

	$new_content = 'Hello World!';

    return $new_content;
}
add_shortcode('shortcode', 'shortcode_function');

// Load parent template for category page
function load_parent_category_template($template) {
    $cat_id = get_query_var('cat');
    $category = get_category($cat_id);
    $theme_dir = get_stylesheet_directory();

    if (file_exists($theme_dir . '/category-' . $category->cat_ID . '.php')) {
        $template = $theme_dir . '/category-' . $category->cat_ID . '.php';
    } elseif (file_exists($theme_dir . '/category-' . $category->slug . '.php')) {
        $template = $theme_dir . '/category-' . $category->slug . '.php';
    } elseif (file_exists($theme_dir . '/category-' . $category->category_parent . '.php')) {
        $template = $theme_dir . '/category-' . $category->category_parent . '.php';
    } else {
        $parent = get_category($category->category_parent);
        if (file_exists($theme_dir . '/category-' . $parent->slug . '.php')) {
            $template = $theme_dir . '/category-' . $parent->slug . '.php';
        }
    }

    return $template;
}
add_action('category_template', 'load_parent_category_template');
```
