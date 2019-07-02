# 基础

## 变量和基本类型

### 算术类型

| 类型        | 含义           | 最小尺寸      |
| ----------- | -------------- | ------------- |
| bool        | 布尔类型       | 未定义        |
| char        | 字符           | 8 位          |
| wchar_t     | 宽字符         | 16 位         |
| char16_t    | Unicode 字符   | 16 位         |
| char32_t    | Unicode 字符   | 32 位         |
| short       | 短整型         | 16 位         |
| int         | 整型           | 丨 16 位      |
| long        | 长整型         | 32 位         |
| long long   | 长整型         | 64 位         |
| float       | 单精度浮点数   | 6 位有效数字  |
| double      | 双精度浮点数   | 10 位有效数字 |
| long double | 扩展精度浮点数 | 10 位有效数字 |

### 类型转换

### 字面值常量

字符和字符串字面值

| 前缀 | 含 义                          | 类型     |
| ---- | ------------------------------ | -------- |
| u    | Unicode 16 字符                | char16_t |
| U    | Unicode 32 字符                | char32_t |
| L    | 宽字符                         | wchar_t  |
| u8   | UTF-8 （仅用于字符串字面常量） | char     |

整型字面值

| 后缀     | 最小匹配类型 |
| -------- | ------------ |
| u or U   | unsigned     |
| l or L   | long         |
| ll or LL | long long    |

浮点型字面值

| 后缀   | 类型        |
| ------ | ----------- |
| f 或 F | float       |
| l 或 F | long double |

## 复合类型

### 引用

1. 定义引用时，程序把引用和它的初始值绑定，而不是将初始值拷贝给引用；
2. 引用并非对象，相反的，它只是为一个已经存在的对象所起的另外一个名字。

```cpp
int ival = 1024;
int &refVal = ival; // refval 指向 ival（是 ival 的另一个名字）
int &refVal2;       // 报错：引用必须初始化
```

### 指针

指针存放某个对象地址，想要获取该地址，需要使用**取地址符**（`&`）

```cpp
double dVal;
double *pd = &dVal; // 正确：初始值是 double 型对象的地址
double *pd2 = pd;   // 正确：初始值是指向 double 对象的地址

int *pi = pd;       // 错误：指针 pi 的类型和 pd 的类型不匹配
pi = &dVal;         // 错误：把 double 型对象的地址赋给 int 型指针
```

指针的值（即地址）应属下列 4 种状态之一：

1. 指向一个对象；
2. 指向紧邻对象所占空间的下一个位置；
3. 空指针，没有指向任何对象；
4. 无效指针，上述情况之外的其他值。

`&` 和 `*` 多重含义

```cpp
int i = 42;
int &r = i;     // & 紧跟着类型名出现，因此是声明的一部分，r 是一个引用
int *p;         // * 紧跟着类型名出现，因此是声明的一部分，p 是一个指针
p = &i;         // & 出现在表达式中，是一个取地址符
*p = i;         // * 出现在表示中，是一个解引用符
int &r2 = *p;   // & 是声明的一部分，* 是一个解引用符
```

空指针（null pointer）不指向任何对象，在试图使用一个指针之前代码可以首先检查它是否为空。在 c++11 中可以使用 `nullptr` 来初始化指针，它可以被转化为任意类型指针。

`void*` 是一种特殊指针类型，可用于存放任意对象的地址

## `const` 限定符

### `const` 的引用

`const` 引用只是表明，保证不会通过此引用间接的改变被引用的对象

### 顶层 `const`

- 顶层（`const`）表示指针本身是个常量；
- 底层（`const`）表示指针所指的对象是一个常量。

顶层 `const` 可以表示任意的对象是常量，适用于任何数据类型；底层 `const` 则与指针和引用等复合类型的基本类型部分有关。

```cpp
int i = 0;
int *const p1 = &i;         // 不能改变 p1 的值，这是一个顶层 const
const int ci = 42;          // 不能改变 ci 的值，这是一个顶层 const
const int *p2 = &ci;        // 允许改变 p2 的值，这是一个底层 const
const int *const p3 = p2;   // 靠右的 const 是顶层 const，靠左的是底层 const
const int &r = ci;          // 用于声明引用的 const 都是底层 const
```

- 如果 `const` 右结合修饰的为类型或者 `*`，那这个 `const` 就是一个底层 `const`；
- 如果 `const` 右结合修饰的为标识符，那这个 `const` 就是一个顶层 `const`。

### `constexpr` 和常量表达式

c++11 中允许将变量声明为 `constexpr` 类型以便由编译器来验证变量的值是否是一个常量表达式。

```cpp
constexpr int mf = 20;          // 20 是一个常量表达式
constexpr int limit = mf + 1;   // mf + 1 是常量表达式
constexpr int sz = size();      // 只有当 size 是一个 constexpr 函数时才是一条正确的声明语句
const int *p = nullptr;         // p 是一个指向整形常量的指针
constexpr int *q = nullptr;     // q 是一个指向整数的常量指针
```

## 处理类型

### 类型别名

使用关键字 `typedef` 定义类型别名

```cpp
typedef double wages;   // wages 是 double 的同义词
typedef wages base, *p; // base 是 double 的同义词，p 是 double* 的同义词
```

在 c++11 中可以使用 `using` 定义类型别名

```cpp
using SI = char;    // SI 是 char 的同义词
```

指针、常量和类型别名

```cpp
typedef char *pstring;
const pstring cstr = 0; // cstr 是指向 char 的常量指针
const pstring *ps;      //  ps 是一个指针，它的对象是指向 char 的常量指针
```

### `decltype` 类型指示符

在 c++11 中，`decltype` 的作用是选择并返回操作数的数据类型。

```cpp
decltype(f()) sum = x;  // sum 的类型就是 f 的返回类型
```

如果 `decltype` 使用的表达式是一个变量， 则 `decltype` 返回该变量的类型（包括顶层 `const` 和引用在内）。

```cpp
const int ci = 0, &cj = ci;
decltype(cj) x = 0;     // x 的类型是 const int
decltype(cj) y = x;     // y 的类型是 const int&， y 绑定到变量 x
decltype(cj) z;         // 错误：z 是一个引用，必须初始化
```

如果 `decltype` 使用的表达式不是一个变量，则 `decltype` 返回表达式结果对应的类型。

```cpp
int i = 42, *p = &i, &r = i;
decltype(r + 0) b;  // 正确：加法的结果是 int，因此 b 是一个（未初始化的）int
decltype(*p) c;     // 错误：c 是 int&，必须初始化
```

> `decltype((variable))` （双层括号） 的结果永远是**引用**，而 `decltype(variable)` 结果只有当 *variable* 本身是一个引用时才是引用。

