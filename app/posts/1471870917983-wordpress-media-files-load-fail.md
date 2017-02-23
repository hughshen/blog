<!-- title:WordPress 媒体图片不能加载 -->
<!-- keywords:WordPress -->

最近在对一个低版本的 WordPress 网站进行迁移并升级到最新的版本 (4.5.3)，升级完之后出现一个问题，在打开 wp-admin/upload.php 页面时图片与文件加载不出来，但是换成 List View 却可以加载，而且在 Featured Image 或者 Add Media 中依然不能加载，google 也没找到解决办法，网上有的说是 html 输出的问题，即<!DOCTYPE html> 之前有其他的字符输出，但是我并没有找到；还有的说是 upload.php 的一些 bug 问题，但是看了一些，这些 bug 在新的版本都已经修改过了；然后问老严，最后说是 ajax 的问题，我也去源码里面看过，依然还是没找出问题所在。

过了一个周末，在今天下午，终于找到了问题的原因。在这里记录总结一下，之前在网上找问题解决方法，大多都是插件的问题，我试过停用插件的办法，确实有效，把 qtranslate-x 插件停用了之后，问题解决了，但是这个插件必须要使用的，之后就一直在找这个插件的原因，是不是有些插件冲突等等，其实这次的主要收获是找问题调试的过程，这是我之前都没想过要这样调试的，也算是一个不小的经验了，不得不说 Chrome 帮了好大的忙。

> 定位 ajax action

WordPress 的 ajax 请求都会提交到 wp-admin/admin-ajax.php 这个文件。使用 Chrome Network 工具，找到这个文件的提交表单数据，可以先在 Filter 中选择 XHR，然后找到 wp-admin/admin-ajax.php，点击之后查看 Headers 下的 Form Data，可以看到 action 的值为 query-attachments，就是说这个是获取媒体文件的方法，看下源代码，最终可以知道调用方法是 wp_ajax_query_attachments (wp-admin/includes/ajax-actions.php)

> 找到问题所在行，一步步调试

找到调用方法之后，不断进行 ajax 调试，比较简单的就是

```php
echo json_encode([1]);
// code
echo json_encode([2]);
// code
echo json_encode([3]);
exit;
```

查看输出可以到 Chrome Network 里面找到 wp-admin/admin-ajax.php 的 Response，就可以具体看到哪一行代码出了问题，最终问题定位到

```php
$posts = array_map( 'wp_prepare_attachment_for_js', $query->posts );
```

接下来找到 wp_prepare_attachment_for_js 的定义，最终找到是在 wp-includes/media.php 文件，看起来代码有点长，先输出点东西看下，运气比较好，一次输出就找到问题了

```
echo json_encode($attachment);
```

查看结果发现并没有完全输出就报错了 (Fatal error)，怪不得没有文件信息返回，下面是错误信息

```
Allowed memory size of 41943040 bytes exhausted (tried to allocate 69632 bytes) ...
```

原来是内存不够的原因，可以修改 PHP 的 memory_limit 的值来加大内存

最终解决办法是在 wp-config.php 文件中添加以下一行配置

```php
define('WP_MEMORY_LIMIT', '128M');
```
