# MySQL 备份与恢复

## 备份

1. 基本备份

```bash
mysqldump -h 主机名 -P 端口 -u 用户名 -p 数据库名 表名 > 文件名.sql

# mysqldump -u root -p test video_file > ~/Desktop/video_file.sql
```

2. 备份整个库并压缩

```bash
mysqldump -h 主机名 -P 端口 -u 用户名 -p 数据库名 | gzip > ~/Desktop/test.sql.gz
# mysqldump -u root -p  test | gzip > ~/Desktop/test.sql.gz
```

3. 备份同个库多个表

```bash
mysqldump -h 主机名 -P 端口 -u 用户名 -p 数据库名 表名1 表名2 > ~/Desktop/video_file.sql

# mysqldump -u root -p  test video_file test_char  > ~/Desktop/video_file.sql
```

4. 同时备份多个库

```bash
mysqldump -h 主机名 -P 端口 -u 用户名 -p --databases test mysql > ~/Desktop/video_file.sql

# mysqldump -u root -p --databases test mysql > ~/Desktop/video_file.sql
```

5. 备份所有数据库

```bash
mysqldump -h 主机名 -P 端口 -u 用户名 -p --all-databases > ~/Desktop/video_file.sql

# mysqldump -u root -p --all-databases > ~/Desktop/video_file.sql
```

6. 备份数据删除库或者表

```bash
mysqldump -h 主机名 -P 端口 -u 用户名 -p --add-drop-table --add-drop-database test  > ~/Desktop/video_file.sql

# mysqldump -u root -p --add-drop-table --add-drop-database test  > ~/Desktop/video_file.sql
```

7. 备份数据库结构，不备份数据

```bash
mysqldump -h 主机名 -P 端口 -u 用户名 -p --no-data test > ~/Desktop/test.sql

# mysqldump -u root -p --no-data test > ~/Desktop/test.sql
```

6. 数据库数据转移到新服务器上

```bash
mysqldump -u root -p databasename | mysql –host=*.*.*.* -C databasename
```

## 还原

```bash
mysql -u root -p < test.sql
```

## 增量备份与还原

### 全量备份

```bash
mysqldump -u root -p --all-databases --flush-logs --delete-master-logs --single-transaction | gzip >> /data/backup/2018_10_07/all_dbs_2018_10_07.sql.gz
```

- `--flush-logs` 为结束当前日志，生成新日志文件；
- `--delete-master-logs` 清除之前的日志，注意：备份之前最好将日志也增量备份一下
- `--single-transaction` 保证备份的一致性，采用会话隔离;

### 增量备份

```bash
rsync -avy /data/mysql/log/mysql-bin.log* /data/backup/2018_10_07/
```

### 恢复备份

1. 恢复全量备份

```bash
mysql > source/data/backup/2018_10_07/all_dbs_2018_10_07.sql
```

2. 恢复增量备份

```bash
mysqlbin /data/backup/2018_10_07/mysql-bin.000006 | mysql -u root -p
```
