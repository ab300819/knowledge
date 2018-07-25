<!-- TOC -->

- [Docker 笔记](#docker-笔记)
    - [安装方式](#安装方式)
    - [基本操作](#基本操作)
        - [在交互方式中运行容器](#在交互方式中运行容器)
        - [后台方式运行 Docker 容器](#后台方式运行-docker-容器)
        - [容器生命周期](#容器生命周期)
        - [使用 Dockerfile 构建 Docker 镜像](#使用-dockerfile-构建-docker-镜像)
        - [使用两个链接在一起的容器运行 WordPress 博客程序](#使用两个链接在一起的容器运行-wordpress-博客程序)
        - [备份在容器中运行的数据库](#备份在容器中运行的数据库)
        - [在宿主机和容器之间共享数据](#在宿主机和容器之间共享数据)
        - [在容器间共享数据](#在容器间共享数据)
        - [对容器进行数据复制](#对容器进行数据复制)
    - [创建和共享镜像](#创建和共享镜像)
        - [将对容器的修改提交到镜像](#将对容器的修改提交到镜像)

<!-- /TOC -->

# Docker 笔记

## 安装方式

1. [官方安装方式](https://docs.docker.com/install/linux/docker-ce/debian/)

2. 省事方法，生产环境不建议使用

```bash
curl -fsSL get.docker.com -o get-docker.sh
```

## 基本操作

### 在交互方式中运行容器

```bash
docker run -t -i ubuntu:18.04
```

### 后台方式运行 Docker 容器

```bash
docker run -d ...
```

再次进入已运行容器

```bash
docker exec -t -i [容器ID] /bin/bash
```

> [官方文档](https://docs.docker.com/engine/reference/run/)

### 容器生命周期

**create**

创建一个新容器

```bash
docker create -P --expose=1234 python:2.7 python -m SimpleHTTPServer 1234
```

**start**

启动容器

```bash
docker start 容器id
```

**restart**

重启容器

```bash
docker restart 容器id
```

**stop**

停止正在运行的容器，这个命令会发送 `SIGTERM` 到容器，如果在一定时间内容器还没有停止，则会再发送 `SIGKILL` 信号强制停止

```bash
docker stop 容器id
```

**kill**

停止正在运行的容器，这个命令会发送 `SIGKILL` 信号强制停止

```bash
docker kill 容器id
```

**rm**

移除容器

```bash
docker rm 容器id
```

批量移除容器

```bash
docker rm $(docker ps -a -q)
```

### 使用 Dockerfile 构建 Docker 镜像

```Dockerfile
FROM busybox

ENV foo=bar
```

创建一个名为 busybox2 镜像

```shell
docker build -t busybox2
```

> [官方文档](https://docs.docker.com/engine/reference/builder/)

### 使用两个链接在一起的容器运行 WordPress 博客程序

拉取 mysql 和 wordpress 镜像

```shell
docker pull wordpress:latest

docker pull mysql:latest
```

启动 mysql 容器并设置密码，`--name` 为容器指定名称，`-d` 为后台运行

```shell
docker run --name mysqlwp -e MYSQL_ROOT_PASSWORD=110119 -d mysql
```

启动 worpress 容器，并通过 `--link` 连接 mysql 容器

```shell
docker run --name wordpress --link mysqlwp:mysql -p 80:80 -d wordpress
```

为 wordpress 创建数据库，并为其创建一个用户

```shell
docker run --name mysqlwp -e MYSQL_ROOT_PASSWORD=test123456 \ 
                            -e MYSQL_DATABASE=wordpress \ 
                            -e MYSQL_USER=wordpress \ 
                            -e MYSQL_PASSWORD=wordpresspwd \ 
                            -d mysql

```

启动 wordpress 容器

```shell
docker run --name wordpress --link mysqlwp:mysql -p 80:80 \
                            -e WORDPRESS_DB_NAME=wordpress \ 
                            -e WORDPRESS_DB_USER=wordpress \ 
                            -e WORDPRESS_DB_PASSWORD=wordpresspwd \ 
                            -d wordpress
```

删除所有容器，通过 `-v` 删除 mysql 镜像中定义的数据卷

```shell
docker stop $(docker ps -q) 
docker rm -v $(docker ps -aq)
```

### 备份在容器中运行的数据库

* 将 Docker 主机上的卷挂载到 MySQL 容器中
* 使用 `docker exec` 命令执行 `mysqldump`

```shell
docker run --name mysqlwp -e MYSQL_ROOT_PASSWORD=wordpressdocker \ 
                            -e MYSQL_DATABASE=wordpress \ 
                            -e MYSQL_USER=wordpress \ 
                            -e MYSQL_PASSWORD=wordpresspwd \
                            -v /home/docker/mysql:/var/lib/mysql \ 
                            -d mysql
```

```shell
docker exec mysqlwp mysqldump --all-databases \ 
                                --password=wordpressdocker > wordpress.backup
```

### 在宿主机和容器之间共享数据

通过 `-v` 参数将宿主机的卷挂载到容器中

```bash
docker run -ti -v /home/think/Downloads:/test ubuntu:18.04 /bin/bash
```

或者

```bash
docker run -ti -v "$PWD":/test ubuntu:18.04 /bin/bash
```

默认情况下是以读写方式挂载，如果想要以只读方式挂载数据卷，可在卷名后面后通过冒号设置相应的权限。

```bash
docker run -ti -v "$PWD":/test:ro ubuntu:18.04 /bin/bash
```

可通过 `docker inspect` 命令来查看数据卷的挂载映射情况。

```bash
docker inspect -f {{.Mounts}} 44d71a605b5b
```

> [官方文档](https://docs.docker.com/storage/volumes/)

### 在容器间共享数据

使用 `docker run` 命令的 `-v` 选项，省略宿主机中的路径，就可以创建一个称为 **数据容器** 的容器。

```bash
docker run -ti -v /test ubuntu:18.04 /bin/bash
```

可通过 `docker inspect` 命令查看数据卷位于宿主机位置

```
docker inspect -f {{.Mounts}} 0e41a4ca8172
```

重新创建一个数据卷

```bash
docker run -v /data --name data ubuntu:18.04
```

> 即使没有运行，映射关系仍然存在

通过 `` 来挂载

```bash
run -ti --volumes-from data ubuntu:18.04 /bin/bash
```

> 可以通过  `docker rm -v data` 来删除容器和它的卷

### 对容器进行数据复制

将文件复制到宿主机上

```bash
docker cp fddb12a17fbc:/data/test.txt test.txt
```

将文件从宿主机复制到容器内

```bash
docker cp cpop.txt fddb12a17fbc:/data/cpop.txt
```

## 创建和共享镜像

### 将对容器的修改提交到镜像