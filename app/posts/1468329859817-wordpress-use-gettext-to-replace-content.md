<!-- title:WordPress 使用 gettext 来替换内容 -->
<!-- keywords:WordPress -->

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

**2017-05-04**

如果使用了 qTranslate X 插件 (默认英文)，形如 `$translated_text = __('[:en]EN[:hk]HK[:]', $domain)` 的翻译可能会出现死循环问题，原因是无需翻译的英文又会重新调用函数，形成死循环，可以改成只针对非英文 (默认) 语言进行翻译。

```php
function my_text_strings($translated_text, $text, $domain)
{
    $current_lang = qtranxf_getLanguage();
    if ($current_lang == 'hk') {
        switch ($translated_text) {
            case 'Read More':
                $translated_text = '查看更多';
                break;
        }
    }
    return $translated_text;
}
add_filter('gettext', 'my_text_strings', 20, 3);
```

---

## 参考

[gettext – The Most Useful Filter in WordPress](https://speakinginbytes.com/2013/10/gettext-filter-wordpress/)