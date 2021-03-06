<!-- title:WordPress 获取文章中的图片 -->
<!-- keywords:WordPress -->

## 获取 post 中的特色图片

```php
<?php
$thumbnail_image_url = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'thumbnail');
echo $thumbnail_image_url[0];
// OR
$thumbnail_image_url = wp_get_attachment_image_url(get_post_thumbnail_id($post->ID), 'thumbnail');
echo $thumbnail_image_url;
?>
```

其中 thumbnail 可以替换成 medium/large/full，分别代表获得图片的尺寸，还可以使用 array(width,height) 来指定尺寸，注意只能获取 post 的特色图片，如果没有设定特色图片的话是获取不到的

## 获取 post 中所包含的图片

在 functions.php 文件中加入

```php
function get_first_image_url($post_content = '') {
	//如果没有指定文章则选取当前的文章
	if ($post_content == '') {
		global $post, $posts;
		$image_url = '';
		ob_start();
		ob_end_clean();
		$post_content = $post->post_content;
	}
	//使用正则表达式筛选出img标签并返回图片数组
	$output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post_content, $matches);
	$image_url = $matches [1] [0];
	if(empty($image_url)){ 
	//如果没有图片，可以返回 false 或者返回一张默认图片
	$image_url = false;
	}
	return $image_url;
}
```

然后可以在模板文件中调用

```php
<?php
	//注意不要使用 the_content() 函数，否则会直接输出内容，这里不用输出内容
	$image_url = get_first_image_url(get_the_content());
		if ($image_url)
			echo '<img src="'.$image_url.'">';
?>
```
