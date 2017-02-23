<!-- title:WordPress 修改 tinyMCE 设置 -->
<!-- keywords:WordPress, tinyMCE -->

今天在 WordPress 中使用默认的编辑器修改文章内容，在切换代码模式中发现编辑器会把 span 标签给过滤掉，而我需要保留 span 标签，Google 之后发现原来可以在 functions 中对 tinyMCE 进行初始化设置。

```php
<?php
function custom_tinymce_config($init)
{
	// Don't remove line breaks
	$init['remove_linebreaks'] = false; 
	// Convert newline characters to BR tags
	$init['convert_newlines_to_brs'] = true; 
	// Do not remove redundant BR tags
	$init['remove_redundant_brs'] = false;
	// Add valid tags
	$opts = '*[*]';
	$init['valid_elements'] = $opts;
	$init['extended_valid_elements'] = $opts;
	// See all configuration
	// print_r($init); exit;
	return $init;
}
add_filter('tiny_mce_before_init', 'custom_tinymce_config');
```

---

## 参考

[How to disable TinyMCE from removing span tags](http://wordpress.stackexchange.com/questions/52582/how-to-disable-tinymce-from-removing-span-tags)

[Stop editor from removing &lt;p&gt; tags and replacing them with nbsp](http://wordpress.stackexchange.com/questions/59772/stop-editor-from-removing-p-tags-and-replacing-them-with-nbsp)
