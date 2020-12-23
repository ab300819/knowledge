# Effective Java 3rd

## 泛型

术语    |   中文含义    |   举例    |   条目
--- |   --- |   --- |   ---
Parameterized type  |   参数化类型  |   `List<String>`  |   条目 26
Actual type parameter   |   实际类型参数    |   `String`    |   条目 26
Generic type    |   泛型类型    |   `List<E>`   |   条目 26 和 条目 29
Formal type parameter   |   形式类型参数    |   `E` |   条目 26
Unbounded wildcard type |   无限制通配符类型    |   `List<?>`   |   条目 26
Raw type    |   原始类型    |   `List`  |   条目 26
Bounded type parameter  |   限制类型参数    |   `<E extends Number>`    |   条目 29
Recursive type bound    |   递归类型限制    |   `<T extends Comparable<T>>` |   条目 30
Bounded wildcard type   |   限制通配符类型  |   `List<? extends Number>`    |   条目 31
Generic method  |   泛型方法    |   `static <E> List<E> asList(E[] a)`  |   条目 30
Type token  |   类型令牌    |   `String.class`  |   条目 33

### 26. 不要使用原始类型
