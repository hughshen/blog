<!-- title:WordPress 显示某个分类下的文章 -->
<!-- keywords:WordPress -->

之前写过一个在 sidebar 下显示分类文章的，这个也是类似，就不多说了。

直接建立 template 文件。

```php
<?php
/**
* Template Name: Posts By Category
*/
get_header();

// 获取 post 的某个字段 (分类 slug)，这个是从 page 页面中添加的，没看到的话点击右上角的 show options
$catslug = get_post_meta($post->ID, 'tz_category_include', true);
$catObj = get_category_by_slug($catslug);
// print_r($catObj);exit;
$catName = $catObj->name;
$catId = $catObj->term_id;

// 以下一段是复制之前的 template 留下来的，不知道有什么用
$blog_sidebar_pos = of_get_option('blog_sidebar_pos');
$blog_class = cherry_get_layout_class( 'content' );
$display_sidebar = true;
$blog_before = $blog_after = '';

switch ($blog_sidebar_pos) {
	case 'masonry':
		$blog_class = cherry_get_layout_class( 'full_width_content' );
		$blog_before = '<div class="isotope">';
		$blog_after = '</div>';
		$display_sidebar = false;
	break;
	case 'none':
		$blog_class = cherry_get_layout_class( 'full_width_content' );
		$display_sidebar = false;
	break;
}
?>

<!-- 显示页面布局 -->
<div class="motopress-wrapper content-holder clearfix">
	<div class="container">
		<div class="row">
			<div class="<?php echo cherry_get_layout_class( 'full_width_content' ); ?>" data-motopress-wrapper-file="index.php" data-motopress-wrapper-type="content">
				<div class="row">
					<div class="<?php echo cherry_get_layout_class( 'full_width_content' ); ?>" data-motopress-type="static" data-motopress-static-file="static/static-title.php">
						<?php get_template_part("static/static-title"); ?>
					</div>
				</div>

				<?php
				$args = array(
					'posts_per_page'   => 10,
					'category'         => $catId,
					'orderby'          => 'date',
					'order'            => 'DESC',
					'post_type'        => 'post',
					'post_status'      => 'publish',
					'suppress_filters' => true 
				);
				$posts = get_posts($args);
				?>

				<div class="row">
					<div class="<?php echo $blog_class ?>" id="content" data-motopress-type="loop" data-motopress-loop-file="loop/loop-blog.php">

						<?php
						// 对获取到的文章进行遍历
						if ($posts) : foreach ($posts as $key => $post) :
							// The following determines what the post format is and shows the correct file accordingly
							echo '<div class="post_wrapper">';
						?>
									
						<header class="post-header">
							<?php if(is_sticky()) : ?>
								<h5 class="post-label"><?php echo theme_locals("featured");?></h5>
							<?php endif; ?>
							<h2 class="post-title"><a href="<?php echo $post->guid; ?>" title="<?php echo $post->post_title; ?>"><?php echo $post->post_title; ?></a></h2>
						</header>
						<?php get_template_part('includes/post-formats/post-thumb'); ?>
						<div class="post_content">
							<?php
								if (of_get_option('post_excerpt')=="true" || of_get_option('post_excerpt')=='') { ?>
									<div class="excerpt">
									<?php
									$content = $post->post_content;
									echo apply_filters( 'cherry_standard_post_content_list', wp_trim_words( $content, 55 ) );
									?>
								</div>
							<?php }
								$button_text = of_get_option('blog_button_text') ? apply_filters( 'cherry_text_translate', of_get_option('blog_button_text'), 'blog_button_text' ) : theme_locals("read_more") ;
							?>
							<a href="<?php the_permalink() ?>" class="btn btn-primary"><?php echo $button_text; ?></a>
							<div class="clear"></div>
						</div>
						<?php 
							echo '</div>';
							endforeach; else: ?>

							<div class="no-results">
								<?php echo '<p><strong>' .theme_locals("there_has"). '</strong></p>'; ?>
								<p><?php echo theme_locals("we_apologize"); ?> <a href="<?php echo home_url(); ?>/" title="<?php bloginfo('description'); ?>"><?php echo theme_locals("return_to"); ?></a> <?php echo theme_locals("search_form"); ?></p>
									<?php get_search_form(); /* outputs the default Wordpress search form */ ?>
							</div><!--no-results-->
						<?php endif;
						echo $blog_after;
						?>
						
						<?php get_template_part('includes/post-formats/post-nav'); ?>
					</div>

				<!-- 以下显示 sidebar，与上面类似，也是取同一分类下的文章 -->
				<?php if($display_sidebar): ?>
					<div class="<?php echo cherry_get_layout_class( 'sidebar' ); ?> sidebar" id="sidebar">
						<div class="widget widget_categories">
							<h3><?php echo $catName; ?></h3>
							<ul>
								<?php
									foreach ($posts as $post) {
										echo '<li><a href="'.$post->guid.'">'.$post->post_title.'</a></li>';
									}
								?>			
							</ul>
						</div>
					</div>
				<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
</div>

<?php get_footer(); ?>
```

有一个问题：分页没显示...

---

## 参考

[get posts](https://codex.wordpress.org/Template_Tags/get_posts)

[Custom Fields](https://codex.wordpress.org/Custom_Fields)

[get post meta](https://developer.wordpress.org/reference/functions/get_post_meta/)
