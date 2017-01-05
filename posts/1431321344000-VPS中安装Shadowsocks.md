> 服务端安装 (Ubuntu1404)

```bash
ssh <username>@<ip_address> -p <port> #ssh登录vps
apt-get update
apt-get install python-pip
pip install shadowcocks
apt-get install python-m2crypto #支持更多的加密方式
```

配置 /etc/shadowsocks/config.json 手动创建该文件

```bash
{
    "server":"my_server_ip",
    "server_port":8388,
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"mypassword",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false
}
```

启动服务

```bash
ssserver -c /etc/shadowsocks/config.json --user nobody -d start #后台运行
```

可以设置开机启动，编辑 /etc/rc.local

```bash
/usr/local/bin/ssserver –c /etc/shadowsocks/config.json
```

> 客户端安装 (Ubuntu1404)，[下载](https://github.com/librehat/shadowsocks-qt5)

```bash
sudo add-apt-repository ppa:hzwhuang/ss-qt5
sudo apt-get update
sudo apt-get install shadowsocks-qt5
```

---

## 参考

[Shadowsocks 使用说明](https://github.com/shadowsocks/shadowsocks/wiki/Shadowsocks-%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)

[Configuration via Config File](https://github.com/shadowsocks/shadowsocks/wiki/Configuration-via-Config-File)