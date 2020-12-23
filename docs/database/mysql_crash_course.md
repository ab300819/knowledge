# MySQL 必知必会

## 一、排序检索数据

数据排序默认升序（从 A 到 Z）排序 `ASC` ，降序（从 Z 到 A）排序必须指定 `DESC` 关键字。

## 二、过滤数据

使用 `IS NULL` 或 `IS NOT NULL` 来处理空值。

## 三、用通配符进行过滤

1. 使用 `LIKE` 操作符配合通配符使用
2. `%` 表示任何字符出现任意次数
3. `_` 只能匹配单个字符

## 四、用正则表达式进行搜索

使用 `REGEXP` 后接正则表达式

### 空白元字符

| 元字符 | 说明     |
| ------ | -------- |
| `\\f`  | 换页     |
| `\\n`  | 换行     |
| `\\r`  | 回车     |
| `\\t`  | 制表     |
| `\\v`  | 纵向制表 |

### 字符类

| 类           | 说明                                                 |
| ------------ | ---------------------------------------------------- |
| `[:alnum:]`  | 任意字母和数字（同 `[a-zA-Z0-9]` ）                  |
| `[:alpha:]`  | 任意字符（同 `[ a- zA- Z]` ）                        |
| `[:blank:]`  | 空格和制表（同 `[\\ t]` ）                           |
| `[:cntrl:]`  | ASCII 控制字符（ ASCII 0 到 31 和 127）              |
| `[:digit:]`  | 任意数字（同 `[0-9]`）                               |
| `[:graph:]`  | 与 `[:print:]` 相同，但不包括空格                    |
| `[:lower:]`  | 任意小写字母（同 `[a-z]`）                           |
| `[:print:]`  | 任意可打印字符                                       |
| `[:punct:]`  | 既不在 `[:alnum:]` 又不在 `[:cntrl:]` 中的任意字符   |
| `[:space:]`  | 包括空格在内的任意空白字符（同 `[\\f\\n\\r\\t\\v]`） |
| `[:upper:]`  | 任意大写字母（同 `[A-Z]`）                           |
| `[:xdigit:]` | 任意十六进制数字（同 `[a-fA-F0-9]`）                 |

### 重复元字符

| 元字符  | 说明                              |
| ------- | --------------------------------- |
| `*`     | 0 个或多个匹配                    |
| `+`     | 1 个或多个匹配（等于 `{1,}` ）    |
| `?`     | 0 个或 1 个匹配（等于 `{0,1}` ）  |
| `{n}`   | 指定数目的匹配                    |
| `{n,}`  | 不少于指定数目的匹配              |
| `{n,m}` | 匹配数目的范围（ `m` 不超过 255） |

### 定位元字符

| 元字符    | 说明       |
| --------- | ---------- |
| `^`       | 文本的开始 |
| `$`       | 文本的结尾 |
| `[[:<:]]` | 词的开始   |
| `[[:>:]]` | 词的结尾   |

## 五、创建计算字段

- `Concat()` 拼接串，即把多个串联起来形成一个较长的串
- `RTrim()` 去掉值右边的所有空格
- `LTrim()` 去掉值左边的所有空格
- `Trim()` 去掉左右两边的空格

## 六、使用数据处理函数

### 文本处理函数

| 函数          | 说明                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------- |
| `Left()`      | 返回串左边的字符                                                                              |
| `Length()`    | 返回串的长度                                                                                  |
| `Locate()`    | 找出串的一个子串                                                                              |
| `Lower()`     | 将串转换为小写                                                                                |
| `LTrim()`     | 去掉串左边的空格                                                                              |
| `Right()`     | 返回串右边的字符                                                                              |
| `RTrim()`     | 去掉串右边的空格                                                                              |
| `Soundex()`   | 返回串的 `SOUNDEX` 值（`SOUNDEX` 是一个将任何文本串转换为描述其语音表示的字母数字模式的算法） |
| `SubString()` | 返回子串的字符                                                                                |
| `Upper()`     | 将串转换为大写                                                                                |

### 日期和时间处理函数

| 函数            | 说明                           |
| --------------- | ------------------------------ |
| `AddDate()`     | 增加一个日期（天、周等）       |
| `AddTime()`     | 增加一个时间（时、分等）       |
| `CurDate()`     | 返回当前日期                   |
| `CurTime()`     | 返回当前时间                   |
| `Date()`        | 返回日期时间的日期部分         |
| `DateDiff()`    | 计算两个日期之差               |
| `Date_Add()`    | 高度灵活的日期运算函数         |
| `Date_Format()` | 返回一个格式化的日期或时间串   |
| `Day()`         | 返回一个日期的天数部分         |
| `DayOfWeek()`   | 对于一个日期，返回对应的星期几 |
| `Hour()`        | 返回一个时间的小时部分         |
| `Minute()`      | 返回一个时间的分钟部分         |
| `Month()`       | 返回一个日期的月份部分         |
| `Now()`         | 返回当前日期和时间             |
| `Second()`      | 返回一个时间的秒部分           |
| `Time()`        | 返回一个日期时间的时间部分     |
| `Year()`        | 返回一个日期的年份部分         |

### 数值处理函数

| 函数     | 说明               |
| -------- | ------------------ |
| `Abs()`  | 返回一个数的绝对值 |
| `Cos()`  | 返回一个角度的余弦 |
| `Exp()`  | 返回一个数的指数值 |
| `Mod()`  | 返回除操作的余数   |
| `Pi()`   | 返回圆周率         |
| `Rand()` | 返回一个随机数     |
| `Sin()`  | 返回一个角度的正弦 |
| `Sqrt()` | 返回一个数的平方根 |
| `Tan()`  | 返回一个角度的正切 |

## 七、汇总数据

- 聚集函数

| 函数      | 说明             |
| --------- | ---------------- |
| `AVG()`   | 返回某列平均值   |
| `COUNT()` | 返回某列的行数   |
| `MAX()`   | 返回某列的最大值 |
| `MIN()`   | 返回某列的最小值 |
| `SUM()`   | 返回某列值之和   |

- 使用 `DISTINCT` 包含不同值

## 八、分组数据

1. `GROUP BY` 子句必须出现在 `WHERE` 子句之后， `ORDER BY` 子句之前

2. `WITH ROLLUP` 可以根据 `GROUP BY` 在统计一次

```sql
SELECT vend_ id, COUNT(*) AS num_ prods
FROM products
GROUP BY vend_ id WITH ROLLUP;
```

3. `HAVING`

- `HAVING` 支持所有 `WHERE` 操作符
- 唯一的差别是 `WHERE` 过滤行，而 `HAVING` 过滤分组
- `WHERE` 在数据分组前进行过滤，`HAVING` 在数据分组后进行过滤

## 九、全文搜索

1. `FULLTEXT(列)` 启动全文搜索（在导入数据时，先不开开启，导完数据后开启）
2. `Match()` 指定被搜索的列， `Against()` 指定要使用的搜索表达式
3. 使用查询扩展 `WHERE Match(note_ text) Against('anvils' WITH QUERY EXPANSION)`
4. 使用 `IN BOOLEAN MODE` 来进行布尔文本搜索

**操作符**

| 布尔操作符 | 说明                                                                       |
| ---------- | -------------------------------------------------------------------------- |
| `+`        | 包含，词必须存在                                                           |
| `-`        | 排除，词必须不出现                                                         |
| `>`        | 包含，而且增加等级值                                                       |
| `<`        | 包含，且减少等级值                                                         |
| `()`       | 把词组成子表达式（允许这些子表达式作为一个组被包含、排除、排列等）         |
| `~`        | 取消一个词的排序值                                                         |
| `*`        | 词尾的通配符                                                               |
| `""`       | 定义一个短语（与单个词的列表不一样，它匹配整个短语以便包含或排除这个短语） |

**例子**

```sql
# 搜索匹配包含词 rabbit 和 bait 的行

SELECT note_text
FROM productnotes
WHERE Match(note_text) Against('+rabbit +bait"' IN BOOLEAN MODE);
```

```sql
# 没有指定操作符，这个搜匹配包含 rabbit 和 bait 中的至少一个词的行

SELECT note_text
FROM productnotes
WHERE Match(note_text) Against('rabbit bait' IN BOOLEAN MODE);
```

```sql
# 搜索匹配短语 rabbit bait 而不是匹配两个词 rabbit 和 bait

SELECT note_text
FROM productnotes
WHERE Match(note_text) Against('"rabbit bait"' IN BOOLEAN MODE);
```

```sql
# 匹配 rabbit 和 carrot， 增加前者的等级， 降低后者的等级

SELECT note_text
FROM productnotes
WHERE Match(note_text) Against('>rabbit <carrot' IN BOOLEAN MODE);
```

```sql
# 搜索匹配词 safe 和 combination， 降低后者的等级

SELECT note_text
FROM productnotes
WHERE Match(note_text) Against('+safe +(<combination)' IN BOOLEAN MODE);
```

## 十、更新表

1. 添加列

```sql
ALTER TABLE blogs ADD column_9 INT NULL;
```

2. 指定位置添加列

```sql
ALTER TABLE blogs ADD column_9 INT NULL;
ALTER TABLE blogs
    MODIFY COLUMN column_9 INT AFTER user_name;
```

3. 重命名列

```sql
ALTER TABLE blogs CHANGE user_name user VARCHAR(50) NOT NULL;
```

4. 删除列

```sql
ALTER TABLE blogs DROP user_name;
```

5. 重命名表

```sql
ALTER TABLE blogs RENAME TO `blogs_1`;
```

## 十一、视图

- 创建视图 `CREATE VIEW`
- 使用 `SHOW CREATE VIEW viewname` 来查看创建视图的语句
- 使用 `DROP VIEW viewname` 来删除视图
- 更新视图，可以先用 `DROP` 再用 `CREATE` ,也可以直接用 `CREATE OR REPLACE VIEW`

## 十二、安全管理

1. 创建用户账号

```sql
CREATE USER 用户名 IDENTIFIED BY 'p@$$ w0rd';
```

2. 重命名用户

```sql
RENAME USER 用户名 TO 用户名_1;
```

3. 删除用户账户

```sql
DROP USER 用户名
```

4. 查看用户权限

```sql
SHOW GRANTS FOR 用户名;
```

5. 赋予权限

```sql
# 数据库 crashcourse 所有表
GRANT SELECT ON crashcourse.* TO 用户名;
```

一次授予多种权限

```sql
GRANT SELECT,INSERT ON crashcourse.* TO 用户名;
```

6. 撤销权限

```sql
REVOKE SELECT ON crashcourse.* FROM beforta;
```

7. 更改密码

```sql
SET PASSWORD FOR 用户名 = Password('n3w p@$$w0rd');
```

不指定用户名时，更新当前登陆用户的口令

```sql
SET PASSWORD = Password('n3w p@$$w0rd');
```

## 十三、数据库维护

### 备份数据

- `mysqldump` 转储所有数据库内容到某个外部文件
- `mysqlhotcopy` 从一个数据库复制所有数据（并非所有数据库引擎支持）
- 使用 `BACKUP TABLE` 或 `SELECT INTO OUTFILE` 转储数据到某个外部文件，要先创建文件，否则会报错；使用 `RESTORE TABLE` 来复原

> 使用 `FLUSH TABLES` 来使所有数据保存到磁盘

### 数据库维护

- `ANALYZE TABLE 表名` 来检查表键是否正确
- `CHECK TABLE`
- `REPAIR TABLE` 不应该经常用
