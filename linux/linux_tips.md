<!-- TOC -->

- [Linux Tips](#linux-tips)
  - [移除 Ubuntu 上陈旧的 PPA 仓库](#移除-ubuntu-上陈旧的-ppa-仓库)
  - [linux 区域和语言设置](#linux-区域和语言设置)
    - [systemd 中 使用 `localectl`](#systemd-中-使用-localectl)
    - [其他便利的设置方式](#其他便利的设置方式)
  - [nginx 编译参数](#nginx-编译参数)

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
