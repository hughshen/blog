有时候一些插件或者主题会使用 `__()` 或 `_e()` 来对一些文本内容进行输出，在不修改插件或者主题代码的情况下，可以使用 `gettext`方法来进行修改

在 functions.php 中添加下面的代码

```php
function my_text_strings($translated_text, $text, $domain) {
	switch ($translated_text) {
		case 'Read More':
			$translated_text = __('查看更多', $domain);
			break;
	}
	return $translated_text;
}
add_filter('gettext', 'my_text_strings', 20, 3);
```

---

## 参考

[gettext – The Most Useful Filter in WordPress](https://speakinginbytes.com/2013/10/gettext-filter-wordpress/)