<!-- title:WordPress 为文章分类添加图片 -->
<!-- keywords:WordPress -->

为文章分类添加图片字段

```php
<?php

/**
 * Add image for category
 */
add_action('init', 'my_category_module');
function my_category_module() {
	add_action ('edit_category_form_fields', 'add_category_image');
	add_action ('edited_category', 'save_category_image');
}

function add_category_image($tag) {
	$category_images = get_option('category_images');
	$category_image = '';
	if (is_array($category_images) && array_key_exists($tag->term_id, $category_images)) {
		$category_image = $category_images[$tag->term_id];
	}
	echo '<tr><th scope="row" valign="top"><label for="auteur_revue_image">Image</label></th><td>';
	
	if ($category_image != '') {
		echo '<img src=" ' . $category_image . '"/>';
	}
	echo '<input type="text" name="category_image" id="category_image" size="40" value="' . $category_image . '"/><p class="description">Image url.</p></td></tr>';
}

function save_category_image($term_id){
	if (isset($_POST['category_image'])) {
		$category_images = get_option('category_images');
		$category_images[$term_id] =  $_POST['category_image'];
		update_option('category_images', $category_images);
	}
}

```

获取已经添加的分类图片

```php
$category_images = get_option('category_images');
if (isset($category_images[$term_id]) && $category_images[$term_id]) {
	echo '<img class="img" src="' . $category_images[$term_id] . '"/>';
}
```

---

## 参考

[Affect an image to categories in WordPress without plugin](http://www.blogprocess.com/affect-an-image-to-categories-in-wordpress-without-plugin/)