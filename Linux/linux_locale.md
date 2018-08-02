<!-- TOC -->

- [linux 区域和语言设置](#linux-区域和语言设置)
    - [systemd 中 使用 `localectl`](#systemd-中-使用-localectl)
    - [其他便利的设置方式](#其他便利的设置方式)

<!-- /TOC -->

# linux 区域和语言设置

## systemd 中 使用 `localectl`

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

## 其他便利的设置方式

设置默认的 shell 为 bash

```bash
dpkg-reconfigure dash 
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