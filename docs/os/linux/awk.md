# awk

## 系统变量

`FS` 和 `OFS` 字段分隔符，`OFS` 表示输出的字段分隔符
RS 记录分隔符
NR 和 FNR 行数
NF 字段数量，最后一个字段内容可以用 $NF 取出

## 使用

### 在读取文件之前定义分隔符

```shell
awk 'BEGIN{FS=":"}{print $1}'
```

等于

```shell
awk -F ":" '{print $1}' # 读取文件之后指定分隔符
```

### 定义输出分隔符

```shell
awk 'BEGIN{FS=":";OFS="-"}{print $1,$2}'
```

### 分隔后按行输出

```shell
awk 'BEGIN{RS=":"}{print $0}'
```

### 输出行号和每一行

```shell
awk '{print NR,$0}'
```

### FNR 单个文件同 NR，多个文件分别输出行号

```shell
awk '{print FNR,$0}' fileName1 fileName2
```

### 条件表达式

```shell
awk '{if($2>=80) {print $1;print$2}}'
```

### 循环打印

```shell
awk '{for(c=2;c<=7;c++) print $c}'
```

### 计算平均值

```shell
awk '{for(c=2;c<=NF;c++) sum+=$c ;print sum/(NF-1)}'
```

### 使用数组

```shell
awk '{sum=0;for(column=2;column<=NF;column++) sum+=$column; avg[$1]=sum/(NF-1)}END{for(user in avg) print user,avg[user]}'
```