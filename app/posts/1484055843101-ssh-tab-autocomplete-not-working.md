<!-- title:远程 SSH TAB 不能补全 -->
<!-- keywords:Bash -->

最近在使用 PuTTY 连接服务器的时候，TAB 不能补全，而且方向键也没用，按了之后只显示字母，查了下原来补全是 bash 下的功能，而我创建的用户默认 shell 是 sh，所以要切换到 /bin/bash 才能使用

网上找到说可以使用 chsh 命令来修改 shell 环境

```bash
echo $SHELL # 查看当前 shell
cat /etc/shells # 列出系统所有可用 shell
chsh # 输入密码之后再输入新的 shell
```

但是我输入 /bin/bash 之后不知道为什么并没有生效，也重新登录过，最后还是修改 /etc/passwd 才有用

```bash
sudo vim /etc/passwd
# 找到当前用户所在行，冒号后面加上 /bin/bash，可以参考 root 用户的写法
{user}:x:1000:1000::/home/{user}:/bin/bash
```

最后不记得有没有重新登录，反正是能用了 :)