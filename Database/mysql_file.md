# MySQL 数据库文件

**数据库**文件有参数文件（my.cnf）、错误日志（eηor log）、慢查询日志（slow log）、全量日志（general log）、二进制日志（binlog）文件、审计日志（audit log）、中继日志（relay log）、套接字文件（socket）、进程（pid）文件和表结构文件。<br>

**存储引擎**有 redo log 和 undo log 日志文件

## 参数文件

在启动 MySQL 实例的过程中，会按照 

```
/etc/my.cnf -> /etc/mysql/my.cnf -> /usr/local/mysql/my.cnf -> ~/.my.cnf 
```

这样的一个优先级别的顺序去读取参数文件。如果想指定默认的参数文件，需要配合 `--defaults-file` 参数。

* `innodb_buffer_pool_size` <br>   
该缓冲池位于主内存中，InnoDB 用它来缓存被访问过的表和索引文件，使常用数据可以直接在内存中被处理，从而提升处理速度。<br>  
参数可以设置为物理内存的 50%～80%