<!-- TOC -->

- [Linux Tips](#linux-tips)
    - [移除 Ubuntu 上陈旧的 PPA 仓库](#移除-ubuntu-上陈旧的-ppa-仓库)
    - [linux 区域和语言设置](#linux-区域和语言设置)
        - [systemd 中 使用 `localectl`](#systemd-中-使用-localectl)
        - [其他便利的设置方式](#其他便利的设置方式)
    - [nginx 编译参数](#nginx-编译参数)
    - [备份已安装的软件并在新系统上恢复](#备份已安装的软件并在新系统上恢复)
    - [验证文件正确性](#验证文件正确性)
    - [动态库解析](#动态库解析)
    - [`ldconfig` 与 `/etc/ld.so.conf`](#ldconfig-与-etcldsoconf)
    - [更改默认配置](#更改默认配置)
    - [挂载 LVM 分区](#挂载-lvm-分区)

<!-- /TOC -->

# Linux Tips

## 移除 Ubuntu 上陈旧的 PPA 仓库

1. `sudo apt-get update | grep "Failed"`

```bash
Err http://ppa.launchpad.net trusty/main amd64 Packages 404  Not Found

Err http://ppa.launchpad.net trusty/main i386 Packages  404  Not Found

W: Failed to fetch http://ppa.launchpad.net/finalterm/daily/Ubuntu/dists/trusty/main/binary-amd64/Packages  404  Not Found

W: Failed to fetch http://ppa.launchpad.net/finalterm/daily/ubuntu/dists/trusty/main/binary-i386/Packages  404  Not Found

E: Some index files failed to download. They have been ignored, or old ones used instead.
```

2. `sudo add-apt-repository --remove ppa:finalterm/daily`

## linux 区域和语言设置

### systemd 中 使用 `localectl`

查看当前区域配置

```bash
localectl status
```

查看当前区域相关变量配置

```bash
locale
```

查看可用区域语言

```bash
localectl list-locales | grep CN
```

设置区域语言

```bash
localectl set-locale LANG=en_US.utf8
```

可能还需要设置相关变量

```bash
export LC_ALL=zh_CN.GBK
```

### 其他便利的设置方式

设置默认的 shell 为 bash

```bash
dpkg-reconfigure bash
```

本地化语言设置

```bash
dpkg-reconfigure locales
```

设置时区

```bash
dpkg-reconfigure tzdata
```

设置控制台选项

```bash
dpkg-reconfigure console-setup
```

生新生成 ssh 服务的 RSA 的 DSA key

```bash
dpkg-reconfigure openssh-server
```

## nginx 编译参数

```bash
./configure --with-cc-opt='-g -O2 -fdebug-prefix-map=/build/nginx-0TiIP5/nginx-1.10.3=. -fstack-protector-strong -Wformat -Werror=format-security -D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-z,relro -Wl,-z,now' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --modules-path=/usr/lib/nginx/modules --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-debug --with-pcre-jit --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --with-http_geoip_module=dynamic --with-http_gunzip_module --with-http_gzip_static_module --with-http_image_filter_module=dynamic --with-http_sub_module --with-http_xslt_module=dynamic --with-stream=dynamic --with-stream_ssl_module --with-mail=dynamic --with-mail_ssl_module --add-module=../nginx-rtmp-module --with-pcre=../pcre-8.43 --with-zlib=../zlib-1.2.11 --add-dynamic-module=../ngx_http_auth_pam_module --add-dynamic-module=../nginx-dav-ext-module --add-dynamic-module=../echo-nginx-module --add-module=../ngx_http_substitutions_filter_module --add-module=../nginx-upstream-fair
```

## 备份已安装的软件并在新系统上恢复

安装 `apt-clone`

```bash
sudo apt install apt-clone
```

备份

```bash
sudo apt-clone clone /backup

# 查看备份文件的详细信息
apt-clone info /backup/apt-clone-state-Ubuntu18.2daygeek.com.tar.gz
```

恢复

```bash
sudo apt-clone restore /opt/apt-clone-state-Ubuntu18.2daygeek.com.tar.gz
```

> 还原将覆盖现有的 `/etc/apt/sources.list` 并安装/删除包

如果只是还原到文件夹而不是真还原，可以使用

```bash
sudo apt-clone restore /opt/apt-clone-state-Ubuntu18.2daygeek.com.tar.gz --destination /opt/oldubuntu
```

## 验证文件正确性

```shell
md5sum/sha1sum/sha256sum [-bct] filename
md5sum/sha1sum/sha256sum [--status|--warn] --check filename
```

参数选项：

- `-b` 以 binary 方式读取；
- `-c` 从文件中读取 MD5 的校验值并予以检查；
- `-t` 以纯文本模式读取(默认)。

```shell
md5sum ntp-4.2.8p3.tar.gz

# b98b0cbb72f6df04608e1dd5f313808b  ntp-4.2.8p3.tar.gz
```

## 动态库解析

```shell
ldd [-vdr] [filename]
```

参数选项：

- `-v` 列出所有内容信息；
- `-d` 进程数据重寻址
- `-r` 进程数据和函数重寻址

範例一：找出 `/usr/bin/passwd` 這個檔案的函式庫資料

```shell
ldd /usr/bin/passwd
# ....(前面省略)....
#         libpam.so.0 => /lib64/libpam.so.0 (0x00007f5e683dd000)            <==PAM 模組
#         libpam_misc.so.0 => /lib64/libpam_misc.so.0 (0x00007f5e681d8000)
#         libaudit.so.1 => /lib64/libaudit.so.1 (0x00007f5e67fb1000)        <==SELinux
#         libselinux.so.1 => /lib64/libselinux.so.1 (0x00007f5e67d8c000)    <==SELinux
# ....(底下省略)....
# 我們前言的部分不是一直提到 passwd 有使用到 pam 的模組嗎！怎麼知道？
# 利用 ldd 察看一下這個檔案，看到 libpam.so 了吧？這就是 pam 提供的函式庫
```

範例二：找出 `/lib64/libc.so.6` 這個函式的相關其他函式庫！

```shell
ldd -v /lib64/libc.so.6
# /lib64/ld-linux-x86-64.so.2 (0x00007f7acc68f000)
# linux-vdso.so.1 =>  (0x00007fffa975b000)

# Version information:  <==使用 -v 選項，增加顯示其他版本資訊！
# /lib64/libc.so.6:
#         ld-linux-x86-64.so.2 (GLIBC_2.3) => /lib64/ld-linux-x86-64.so.2
#         ld-linux-x86-64.so.2 (GLIBC_PRIVATE) => /lib64/ld-linux-x86-64.so.2
```

## `ldconfig` 与 `/etc/ld.so.conf`

```shell
ldconfig [-f conf] [ -C cache]
ldconfig [-p]
```

参数选项：

- `-f conf` 那個 `conf` 指的是某個檔案名稱，也就是說，使用 `conf` 作為 libarary 函式庫的取得路徑，而不以 `/etc/ld.so.conf` 為預設值
- `-C cache` 那個 `cache` 指的是某個檔案名稱，也就是說，使用 `cache` 作為快取暫存的函式庫資料，而不以 `/etc/ld.so.cache` 為預設值
- `-p` 列出目前有的所有函式庫資料內容 (在 `/etc/ld.so.cache` 內的資料！)

範例一：假設我的 Mariadb 資料庫函式庫在 `/usr/lib64/mysql` 當中，如何讀進 `cache` ？

```shell
vim /etc/ld.so.conf.d/vbird.conf
# /usr/lib64/mysql   <==這一行新增的啦！

ldconfig -p
# 924 libs found in cache `/etc/ld.so.cache'
#         p11-kit-trust.so (libc6,x86-64) => /lib64/p11-kit-trust.so
#         libzapojit-0.0.so.0 (libc6,x86-64) => /lib64/libzapojit-0.0.so.0
# ....(底下省略)....
# 函式庫名稱 => 該函式庫實際路徑
```

## 更改默认配置

```shell
sudo update-alternatives --config

# 例
sudo update-alternatives --config cc
sudo update-alternatives --config c++
sudo update-alternatives --config gcc
```

## 挂载 LVM 分区

1.查看服务器物理分区，逻辑卷的信息

```shell
fdisk -l
```

2.查看逻辑卷的具体信息

```shell
lvdisplay
```

3.挂载

```shell
mount /dev/VolGroup/lv_home /media/lvm
```
