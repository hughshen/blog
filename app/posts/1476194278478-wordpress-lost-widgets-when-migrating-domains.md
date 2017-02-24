<!-- title:WordPress 更换域名时丢失 Widgets 数据 -->
<!-- keywords:WordPress -->

今天在对一个 WordPress 网站更换域名时，直接对 sql 文件进行域名替换，更新完之后网站的一些内容丢失了，发现大都是 Widgets 的内容。

网上找也有类似的情况，大概是因为 WordPress 在保存数组内容时会先对数组进行 serialize 处理，当我们修改了内容之后，可能会导致内容的长度不一致，然后使用 unserialize 取数据时会返回 false，所以数据为空。

```
a:2:{s:3:"url";s:18:"http://oldsite.com";s:4:"meta";s:17:"some kind of meta";} // 修改前
a:2:{s:3:"url";s:18:"http://migratetosite.com";s:4:"meta";s:17:"some kind of meta";} // 修改后
```

例如上面修改前域名的字符长度为 18，修改之后的长度为 24，这就导致了 unserialize 取回数据失败

目前还没有找到好的解决办法，还是需要人工去修改某些内容，不过对于 wp_posts 表是可以进行替换的

```
UPDATE `wp_posts` 
SET `post_content` = REPLACE(`post_content`, 'oldsite.com', 'migratetosite.com') 
WHERE `post_content` LIKE '%oldsite.com%';
UPDATE `wp_posts` 
SET `guid` = REPLACE(`guid`, 'oldsite.com', 'migratetosite.com') 
WHERE `guid` LIKE '%oldsite.com%';
```

PS：有时间写个插件来处理下这个问题

---

## 参考

[Lost Widgets When Migrating WordPress Domains (dev to production server)](http://theandystratton.com/2011/lost-widgets-when-migrating-domains-server)

[Why WordPress Widgets Vanish When Migrating to New URL](http://www.themelab.com/why-wordpress-widgets-disappear/)
