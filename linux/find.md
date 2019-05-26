# find

## 基本语法

```bash
find [path] [expression]
```

在 path 目录下查找 expression 文件

## 例子

### 通过文件名查找

```bash
find -name "query"          # 搜索文件名，大小写敏感
find -iname "query"         # 大小写不敏感
find -not -name "query"     # 查找不包含关键字的文件
find \! -name "query"       # 不包含
```

### 按类型查找文件
