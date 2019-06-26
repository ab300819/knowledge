<!-- TOC -->

- [`wc` 命令](#wc-命令)
  - [语法](#语法)
  - [参数](#参数)
  - [例子](#例子)
  - [统计文件或目录个数](#统计文件或目录个数)
    - [统计当前文件夹下文件的个数，包括子文件夹里的](#统计当前文件夹下文件的个数包括子文件夹里的)
    - [统计文件夹下目录的个数，包括子文件夹里的](#统计文件夹下目录的个数包括子文件夹里的)
    - [统计当前文件夹下文件的个数](#统计当前文件夹下文件的个数)
    - [统计当前文件夹下目录的个数](#统计当前文件夹下目录的个数)
    - [统计输出信息的行数](#统计输出信息的行数)
    - [将长列表输出信息过滤一部分，只保留一般文件，如果只保留目录就是 `^d`](#将长列表输出信息过滤一部分只保留一般文件如果只保留目录就是-^d)
- [`find` 命令](#find-命令)
  - [语法](#语法-1)
  - [例子](#例子-1)
    - [通过文件名查找](#通过文件名查找)
    - [按照类型查找文件](#按照类型查找文件)
    - [通过文件大小查找](#通过文件大小查找)
    - [通过时间来查找文件](#通过时间来查找文件)
    - [通过 Owner 和权限搜索](#通过-owner-和权限搜索)
    - [限制查找的深度](#限制查找的深度)
    - [对搜索结果批处理](#对搜索结果批处理)

<!-- /TOC -->

# `wc` 命令

> 可以计算文件的 Byte 数、字数、或是列数，若不指定文件名称或是所给予的文件名为 `-`，则 `wc` 指令会从标准输入设备读取数据。

## 语法

```bash
wc [-clw][--help][--version][文件...]
```

## 参数

- `-c` 或 `--bytes` 或 `--chars` 只显示 Bytes 数；
- `-l` 或 `--lines` 只显示行数；
- `-m` 统计字符数，这个标志不能与 `-c` 标志一起使用；
- `-w` 或 `--words` 只显示字数；
- `-L` 打印最长行的长度；
- `--help` 在线帮助；
- `--version` 显示版本信息；

## 例子

```bash
$ wc testfile           # testfile文件的统计信息
3 92 598 testfile       # testfile文件的行数为3、单词数92、字节数598
```

## 统计文件或目录个数

### 统计当前文件夹下文件的个数，包括子文件夹里的

```bash
ls -lR|grep "^-"|wc -l
```

### 统计文件夹下目录的个数，包括子文件夹里的

```bash
ls -lR|grep "^d"|wc -l
```

### 统计当前文件夹下文件的个数

```bash
ls -l |grep "^-"|wc -l
```

### 统计当前文件夹下目录的个数

```bash
ls -l |grep "^d"|wc -l
```

### 统计输出信息的行数

```bash
wc -l
```

### 将长列表输出信息过滤一部分，只保留一般文件，如果只保留目录就是 `^d`

```bash
grep "^-"
```

# `find` 命令

## 语法

```bash
# 在 path 目录下查找 expression 文件
find [path] [expression]
```

## 例子

### 通过文件名查找

```bash
find -name "query"          # 搜索文件名，大小写敏感
find -iname "query"         # 大小写不敏感
find -not -name "query"     # 查找不包含关键字的文件
find \! -name "query"       # 不包含
```

### 按照类型查找文件

```bash
find -type [fdlcb] "query"
```

`type` 后能够使用的类型有

- `f` 常规文件
- `d` 目录
- `l` 连接
- `c` character devices
- `b` block devices

查找系统中所有以 `.conf` 结尾的文件

```bash
find / -type f -name "*.conf"
```

### 通过文件大小查找

```bash
find /path/to/folder -size 50M
```

`size` 可使用的单位有

- `b` 512byte blocks
- `c` byte 字节
- `w` two byte
- `k` kB 千字节
- `M` MB
- `G` GB

`size` 后面的参数可以使用 `+` 或 `-` 或者不加来标识，超过，少于或者正好。

```bash
find / -size +700M   # 表示查找大于 700M 的文件
find / -size -50c    # 表示查找小于 50 byte 的文件
find . -size 50M     # 表示在当前目录查找正好 50M 的文件
```

### 通过时间来查找文件

linux 会存储下面的时间：

- Access time 上一次文件读或者写的时间
- Modifica time 上一次文件被修改的时间
- Change time 上一次文件 inode meta 信息被修改的时间

在按照时间查找时，可以使用 `-atime`， `-mtime` 或者 `-ctime` ，和之前 `size` 参数一样可以使用 `+` 或者 `-` 来标识超多多长时间或者少于多长时间。

```bash
find / -mtime 1          # 寻找修改时间超过一天的文件
find / -atime -1         # 寻找在一天时间内被访问的文件
find / -ctime +3         # 寻找 meta 信息被修改的时间超过 3 天的文件
```

寻找修改时间超过 1 小时的 mp3 文件

```bash
find /path/to/folder -maxdepath 1 -mmin +60 -type f -name "*.mp3"
```

一次性删除超过 60 分钟未修改的 mp3

```bash
find /path/to/folder -maxdepath 1 -mmin +60 -type f -name "*.mp3" -exec rm -f {} \;
```

### 通过 Owner 和权限搜索

使用 `-user` 和 `-group` 参数来通过拥有者搜寻

```bash
find / -user einverne
find / -group shadow
```

按权限查找文件

```bash
find / -perm 644
find / -perm -644 # 查找权限至少是 644 的文件
```

### 限制查找的深度

```bash
find -maxdepth 2 -name "query"

find -mindepth 2 -maxdepth 3 -name "query"
```

### 对搜索结果批处理

```bash
find [param] -exec command {} \;
```

批量修改权限

```bash
find . -type f -perm 644 -exec chmod 664 {} \;
find . -type d -perm 755 -exec chmod 700 {} \;   # 批量修改文件夹权限
```

批量删除时间超过 1 天的文件

```bash
find /path/to/folder/* -mtime +1 -exec rm {} \;
```

[参考](http://einverne.github.io/post/2018/02/find-command.html)
