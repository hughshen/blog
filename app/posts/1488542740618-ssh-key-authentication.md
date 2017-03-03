<!-- title:SSH 密钥登录 -->
<!-- keywords:SSH -->

一般登录 VPS 用密码的话容易被人暴力破解，如果换成密钥登录会好很多，配置过程也简单，做个记录。

生成密钥，最好在 Linux 下操作

```shell
# 中间会询问密钥保存目录，默认是 ~/.ssh 下，回车就行
# 如果想更加安全的话，密码短语也可以输入，回车留空也行
ssh-keygen -t rsa -C "comment"
```

生成之后，在 `~/.ssh` 目录下可以找到两个文件 `id_rsa` (私钥) 和 `id_rsa.pub` (公钥)，这两个文件最好下载下来保存好，接下来给服务器配置公钥

```shell
cd ~/.ssh
cat id_rsa.pub >> authorized_keys
# 目录权限也要修改
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

最后修改下 SSH (/etc/ssh/sshd_config) 的配置，允许密钥登录

```
RSAAuthentication yes
PubkeyAuthentication yes
```

修改完之后重启 SSH

```shell
sudo service ssh restart
```

这时候最好另外再开启一个对话来测试是否可以成功，测试可以登录之后就修改 SSH 配置把密码登录禁止并重启

```
PasswordAuthentication no
```

我是用 PuTTY 来登录 VPS 的，需要使用 [PuTTYGen](http://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) 另外再生成 ppk 私钥文件，[下载软件](https://the.earth.li/~sgtatham/putty/latest/w64/puttygen.exe)。
