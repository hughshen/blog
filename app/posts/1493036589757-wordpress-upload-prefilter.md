<!-- title:WordPress 对上传的文件进行预处理 -->
<!-- keywords:WordPress -->

WordPress 上传的文件保存名称一般为原始名称不经过修改，除非遇到同名，这样保存的文件有时候会碰到一些小问题，例如带中文或者空格，浏览器可能不能识别或者在使用 FileZilla 下载文件时由于编码问题会使文件名称乱码等等，而公司的录资料人员经常这样子干。。。解决方法也简单，不使用插件直接使用 WordPress 提供的过滤钩子 `wp_handle_upload_prefilter` 就行，下面是一个简单的使用例子。

```php
add_filter('wp_handle_upload_prefilter', 'my_media_upload_filter');
function my_media_upload_filter($file)
{
    if (preg_match('/[\x7f-\xff]/', $file['name'])) {
        $current_filename = $file['name'];
        $new_filename = time() . mt_rand(11111, 99999) . substr($current_filename, strrpos($current_filename, '.'));
        $file['name'] = $new_filename;
    }
    $file['name'] = preg_replace('/\s+/', '-', $file['name']);
    return $file;
}
```

---

## 参考

[wp handle upload prefilter](https://codex.wordpress.org/Plugin_API/Filter_Reference/wp_handle_upload_prefilter)
