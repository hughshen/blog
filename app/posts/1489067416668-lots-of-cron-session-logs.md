<!-- title:auth.log 记录大量 cron session 日志 -->
<!-- keywords:Linux -->

今天在查看 auth.log 发现了大量 cron session 的日志，每隔一个小时就出现几次，看起来是定时任务在调用时以 root 用户执行而记录下来了，不过我的定时任务也没有这么频繁，不知道为什么会写入那么多记录。

```
Mar  5 16:17:01 *** CRON[9261]: pam_unix(cron:session): session opened for user root by (uid=0)
Mar  5 16:17:01 *** CRON[9261]: pam_unix(cron:session): session closed for user root
Mar  5 17:17:01 *** CRON[9399]: pam_unix(cron:session): session opened for user root by (uid=0)
Mar  5 17:17:01 *** CRON[9399]: pam_unix(cron:session): session closed for user root
Mar  5 18:17:01 *** CRON[9863]: pam_unix(cron:session): session opened for user root by (uid=0)
Mar  5 18:17:01 *** CRON[9863]: pam_unix(cron:session): session closed for user root
Mar  5 19:17:01 *** CRON[10006]: pam_unix(cron:session): session opened for user root by (uid=0)
Mar  5 19:17:01 *** CRON[10006]: pam_unix(cron:session): session closed for user root
```

网上找到了解决方法，修改以下文件

```shell
cd /etc/pam.d
sudo vim common-session-noninteractive
```

找到下面一行

```
session required pam_unix.so
```

然后在上面添加一行

```
session [success=1 default=ignore] pam_succeed_if.so service in cron quiet use_uid
```

最后重启 cron 服务

```shell
sudo service cron restart
```

---

## 参考

[Cron: pam_unix (cron:session): session opened/closed for user root by (uid=0)](http://languor.us/cron-pam-unix-cron-session-session-opened-closed-user-root-uid0)

[Weird CRON logs appearing for no reasion](https://www.digitalocean.com/community/questions/weird-cron-logs-appearing-for-no-reasion)