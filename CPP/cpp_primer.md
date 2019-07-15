<!-- TOC -->

- [c++ note](#c-note)
    - [变量和基本类型](#变量和基本类型)
        - [基本内置类型](#基本内置类型)
            - [算术类型](#算术类型)
            - [字面值常量](#字面值常量)
        - [复合类型](#复合类型)
            - [引用](#引用)
            - [指针](#指针)
        - [`const` 限定符](#const-限定符)
            - [`const` 的引用](#const-的引用)
            - [顶层 `const`](#顶层-const)
            - [`constexpr` 和常量表达式](#constexpr-和常量表达式)
        - [处理类型](#处理类型)
            - [类型别名](#类型别名)
            - [`decltype` 类型指示符](#decltype-类型指示符)
        - [头文件保护](#头文件保护)
    - [字符串、向量和数组](#字符串向量和数组)
        - [标准库类型 `string`](#标准库类型-string)
            - [`string` 对象上的操作](#string-对象上的操作)
        - [标准库类型 `vector`](#标准库类型-vector)
            - [定义和初始化 `vector`](#定义和初始化-vector)
            - [`vector` 操作](#vector-操作)
        - [迭代器](#迭代器)
            - [使用迭代器](#使用迭代器)
        - [数组](#数组)
    - [表达式](#表达式)
        - [`sizeof` 运算符](#sizeof-运算符)
        - [显示转换](#显示转换)
    - [函数](#函数)
        - [可变形参的函数](#可变形参的函数)
        - [返回数组指针](#返回数组指针)
        - [函数重载](#函数重载)
        - [内联函数和 `constexpr` 函数](#内联函数和-constexpr-函数)
        - [函数指针](#函数指针)
    - [类](#类)
        - [常量成员函数](#常量成员函数)

<!-- /TOC -->

# c++ note

## 变量和基本类型

### 基本内置类型

#### 算术类型

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

#### 字面值常量

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

### 复合类型

#### 引用

1. 定义引用时，程序把引用和它的初始值绑定，而不是将初始值拷贝给引用；
2. 引用并非对象，相反的，它只是为一个已经存在的对象所起的另外一个名字。

```cpp
int ival = 1024;
int &refVal = ival; // refval 指向 ival（是 ival 的另一个名字）
int &refVal2;       // 报错：引用必须初始化
```

#### 指针

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

### `const` 限定符

#### `const` 的引用

`const` 引用只是表明，保证不会通过此引用间接的改变被引用的对象

#### 顶层 `const`

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

#### `constexpr` 和常量表达式

c++11 中允许将变量声明为 `constexpr` 类型以便由编译器来验证变量的值是否是一个常量表达式。

```cpp
constexpr int mf = 20;          // 20 是一个常量表达式
constexpr int limit = mf + 1;   // mf + 1 是常量表达式
constexpr int sz = size();      // 只有当 size 是一个 constexpr 函数时才是一条正确的声明语句
const int *p = nullptr;         // p 是一个指向整形常量的指针
constexpr int *q = nullptr;     // q 是一个指向整数的常量指针
```

### 处理类型

#### 类型别名

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

#### `decltype` 类型指示符

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

> `decltype((variable))` （双层括号） 的结果永远是**引用**，而 `decltype(variable)` 结果只有当 _variable_ 本身是一个引用时才是引用。

### 头文件保护

`#ifdef` 当且仅当变量已定义时为真，`#ifndef` 当且仅当变量未定义时为真。一旦检查结果为真，则执行后续操作直至遇到 `#endif` 为止。

```cpp
#ifndef TEST_INCLUDE
#define TEST_INCLUDE
#include <isotream>
...
#endif
```

## 字符串、向量和数组

### 标准库类型 `string`

`string` 是标准库的一部分定义在命名空间 `std` 中。

```cpp
#include <string>
using std::string
```

初始化 `string` 对象

```cpp
string s1;              // 默认初始化，s1 是一个空串
string s2(s1);          // s2 是 s1 的副本
string s2 = s1;         // 等价于 s2(s1)，s2 是 s1 的副本
string s3("value");     // s3 是字面值 "value" 的副本
string s3 = "value";    // 等价于 s3("value")，s3 是字面值 "value" 的副本
string s4(n, 'c');      // 把 s4 初始化为由连续 n 个字符 c 组成的串
```

如果使用等号（`=`）初始化一个变量，实际上执行的是**拷贝初始化**，如果不使用等号，则执行的是**直接初始化**。

#### `string` 对象上的操作

```cpp
os<<s           // 将 s 写到输出流 os 当中，返回 os
is>>s           // 从 is 中读取字符串赋给 s，字符串以空白分隔，返回 is
getline(is, s)  // 从 is 中读取一行赋给 s，返回 is
s.empty()       // s 为空返回 true，否则返回 false
s.size()        // 返回 s 中字符的个数
s[n]            // 返回 s 中第 n 个字符的引用，位置 n 从 0 计算
s1 + s2         // 返回 s1 和 s2 链接后的结果
s1 = s2         // 用 s2 的副本代替 s1 中原来的字符
s1 == s2        // 判断 s1 和 s2 中所含字符是否完全一样，大小写敏感
s1 != s2
<, <=, >, >=    // 根据字典顺序进行比较，大小写敏感
```

当把 `string` 对象和字符字面值及字符串字面值混在一条语句中使用时，必须确保每个加法运算符（`+`）的两侧的运算对象至少有一个是 `string`。

```cpp
string s4 = s1 + ",";           // 正确
string s5 = "hello" + ",";      // 错误
string s6 = s1 + "," + "world"; // 正确
string s7 = "hello" + "," + s2; // 错误
```

> 因为历史原因，也为了兼容 c ，所以 c++ 中字符串字面值不是标准库类型 `string` 的对象。字符串字面值与 `string` 是不同的类型。

`cctype` 头 文 件 中 的 函 数

```cpp
isalnum(c)      // 当 c 是字母或数字时为真
isalpha(c)      // 当 c 是字母时为真
iscntrl(c)      // 当 c 是控制字符时为真
isdigit(c)      // 当 c 是数字时为真
isgraph(c)      // 当 c 不是空格但可打印时为真
islower(c)      // 当 c 是小写字母时为真
isprint(c)      // 当 c 是可打印字符时为真（即 c 是空格或 c 具有可视形式）
ispunct(c)      // 当 c 是标点符号时为真（即 c 不是控制字符、数字、字母、可打印空白中的一种）
isspace(c)      // 当 c 是空白时为真（即 c 是 空 格、横向制表符、纵向制表符、回车符、换行符、进纸符中的一种）
isupper(c)      // 后 c 是大写字母时为真
isxdigit(c)     // 当 c 是十六进制数字时为真
tolower(c)      // 如果 c 是大写字母，输出对应的小写字母；否则原样输出 c
toupper(c)      // 如果 c 是小写字母，输出对应的大写字母；否则原样输出 c
```

### 标准库类型 `vector`

#### 定义和初始化 `vector`

`vector` 是标准库的一部分定义在命名空间 `std` 中。

```cpp
#include <vector>
using std::vector;
```

初始化 `vector` 对象的方法

```cpp
vector<T> v1                    // v1 是一个空 vector，它潜在的元素是 T 类型的，执行默认初始化
vector<T> v2(v1)                // v2 中包含有 v1 所有元素的副本
vector<T> v2 = v2               // 等价于 v2(v1)，v2 中包含有 v1 所有元素的副本
vector<T> v3(n, val)            // v3 包含了 n 个重复的元素，每个元素的值都是 val
vector<T> v4(n)                 // v4 包含了 n 个重复地执行了值初始化的对象
vector<T> v5{a, b, c ...}       // v5 包含了初始值个数的元素，每个元素被赋了相应的初始值
vector<T> v5 = {a, b, c ...}    // 等价于v5{a, b, c...}
```

#### `vector` 操作

```cpp
v.empty()           // 如果 v 不含有任何元素，返回真：否则返回假
v.size()            // 返回 v 中元素的个数
v.push_back(t)      // 向 v 的尾端添加一个值为 t 的元素
v[n]                // 返回 v 中第 n 个位置上元素的引用
v1 = v2             // 用 v2 中元素的拷贝替换 v1 中的元素
v1 = {a, b, c...}   // 用列表中元素的拷贝替换 v1 中的元素
v1 == v2            // v1 和 v2 相等当且仅当它们的元素数量相同且对应位置的元素值都相同
v1 != v2
<, <=, >, >=        // 顾名思义，以字典顺序进行比较
```

如果要使用 `size_type`，首先需要指定它是由哪种类型定义的。

```cpp
vector<int>::size_type  // 争取
vector::size_type       // 错误
```

### 迭代器

#### 使用迭代器

`begin` 指向第一个元素的迭代器；`end` 则返回指向容器“尾元素的下一个位置”

```cpp
*iter           // 返回迭代器 iter 所指元素的引用
iter -> mem     // 解引用 iter 并获取该元素的名为 mem 的成员，等价于 (*iter).mem
++iter          // 令 iter 指示容器中的下一个元素
--iter          // 令 iter 指示容器中的上一个元素
iter1 == iter2  // 判断两个迭代器是否相等（不相等），如果两个迭代器指示的是同一个元素或者它们是同一个容器的尾迭代器，则相等；反之，不等
iter1 != iter2  //
```

迭代器类型

```cpp
vector<int>::iterator it;           // it 能读写 vector<int> 的元素
string::iterator it2;               // it2 能读写 string 对象中的字符

vector<int>::const_iterator it3;    // it3 只能读元素，不能写元素
string::const_iterator it4;         // it4 只能读字符，不能写字符
```

`const_iterator` 和常量指针差不多，能读取但不能修改它所指的元素值。

`begin` 和 `end` 返回的具体类型由对象是否是常量决定的，如果对象是常量，`begin` 和 `end` 返回 `const_iterator`；如果对象不是常量，返回 `iterator`。

```cpp
vector<int> v;
const vector<int> cv;

auto it1 = v.begin();   // it1 的类型是 vector<int>::iterator
auto it2 = cv.begin();  // it2 的类型是 vector<int>::const_iterator
```

为了专门得到 `const_iterator` 类型，在 c++11 中可以用 `cbegin` 和 `cend` 获取；

```cpp
auto it3 = v.cbegin();
```

### 数组

复杂数组声明

```cpp
int *ptrs[10];              // ptrs是含有10个整形指针的数组
int (*Parray)[10] = &arr;   // Parray指向一个含有10个整数的数组
int *(&arry)[10] = ptrs;    // arry是数组的引用，该数组含有10个指针
int (&arrRef)[10] = arr;    // arrRef引用一个含有10个整形的数组
```

标准库函数 `begin` 和 `end`

```cpp
int ia[] = {0, 1, 3, 4, 5, 6, 7, 8, 9}; // ia 是一个含有 10 个整数的数组
int *beg = begin(ia);   // 指向 ia 首元素的指针
int *last = end(ia);    // 只想 arr 尾元素的下一位置的指针
```

## 表达式

### `sizeof` 运算符

`sizeof` 运算符满足右结合率，其所得值是一个 `size_t` 类型的常量表达式。

```cpp
Scale_data data, *p;
sizeof(Scale_data);         // 存储 Sales_data 类型的对象所占的空间大小
sizeof data;                // data 的类型的大小，即 sizeof(Sales_data)
sizeof p;                   // 指针所占的空间大小
sizeof *p;                  // p 所指类型的空间大小，即 sizeof(Sales_data)
sizeof data.revenue;        // Sales_data 的 revenue 成员对应类型的大小
sizeof Scale_data::revenue; // 另一种获取 revenue 大小的方式
```

- 对 `char` 或者类型为 `char` 的表达式执行 `sizeof` 运算，结果得 `1`；
- 对引用类型执行 `sizeof` 运算得到被引用对象所占空间大小；
- 对指针执行 `sizeof` 运算得到指针本身所占空间的大小；
- 对解引用指针执行 `sizeof` 运算得到指针指向的对象所占空间的大小，指针不需有效；
- 对数组执行 `sizeof` 运算得到整个数组所占空间的大小，等价于对数组中所有的元素各执行一次 `sizeof` 运算并将所得结果求和。注意，`sizeof` 运算不会把数组转换成指针来处理；
- 对 `string` 对象或 `vector` 对象执行 `sizeof` 运算只返回该类型固定部分的大小，不会计算对象中的元素占用了多少空间。

### 显示转换

`static_cast` 可以用于任何具有明确定义的类型转换，只要不包含底层 `const`。

`consta_cast` 用于运算对象的底层 `const`：

- 常量指针被转化成非常量的指针，并且仍然指向原来的对象；
- 常量引用被转换成非常量的引用，并且仍然指向原来的对象；
- `const_cast`一般用于修改底指针。

## 函数

### 可变形参的函数

```cpp
void error_msg(initializer_list<string> il);
```

`initializer_list` 对象中的元素永远是常量值。

`initializer_list` 常用操作

```cpp
initializer_list<T> lst;                // 默认初始化：T 类型元素的空列表
initializer_list<T> lst{a, b, c...};    // lst 的元素数量和初始值一样多：lst 的元素是对应初始值的副本；列表中的元素是 const
lst2(lst)   // 拷贝或赋值一个 `initializer_list` 对象不会拷贝列表中的元素；拷贝后，原始列表和副本共享元素
lst.size()  // 列表中的元素数量
lst.begin() // 返回指向 lst 中首元素的指针
lst.end()   // 返回指向 lst 中尾元素下一位置的指针
```

### 返回数组指针

声明一个返回数组指针的函数

```cpp
// Type (*function(parameter_list))[dimension]
int (*func(int i))[10]
```

使用尾置返回类型

```cpp
auto func(int i) -> int(*)[10];
```

使用 `decltype`

```cpp
int odd[] = {1, 3, 5, 7, 9};
int even[] = {0, 2, 4, 6, 8};
decltype(odd) *arrPtr(int i)
{
    return (i % 2)? &odd : &even;
}
```

### 函数重载

顶层 `const` 不能重载，底层 `const` 能重载。

### 内联函数和 `constexpr` 函数

在函数的返回类型前面加上关键字 `inline`，这样就可以声明一个内联函数。内联函数可避免函数调用的开销。

`constexpr` 函数是指能用于常量表达式的函数。需要遵守几项约定：

1. 函数的返回类型及所有形参的类型都得是字面值类型；
2. 函数体中必须有且只有一条 `return` 语句。

### 函数指针

定义函数指针

```cpp
bool lengthCompare(const string &, const string &);

// 定义函数指针
bool (*pf)(const string &, const string &);
```

使用函数指针

```cpp
pf = lengthCompare;                           // pf 指向 lengthCompare 的函数
pf = &lengthCompare;                          // 等价赋值语句：取地符可选

bool b1 = pf("hello", "goodbye");             // 调用 lengthCompare 函数
bool b2 = (*pf)("hello", "goodbye");          // 一个等价调用
bool b3 = lengthCompare("hello", "goodbye");  // 一个等价调用
```

重载函数的指针

```cpp
void ff(int *);
void ff(unsigned int);

void (*pf1)(unsigned int) = ff; // pf1 指向 ff(unsigned)
// 指针类型必须与重载函数中的某一个精确匹配
```

函数指针形参

```cpp
void useBigger(const string &s1, const string &s2, bool pf(const string &, const string &));
void useBigger(const string &s1, const string &s2, bool (*pf)(const string &, const string &));
```

返回指向函数的指针

```cpp
using F = int(int*, int);
using PF = int(*)(int*, int);

PF f1(int); // 正确：PF 是指向函数的指针，f1 返回指向函数的指针
F f1(int);  // 错误：F 是函数类型，f1 不能返回一个函数
F *f1(int); // 正确：显示地指定返回类型是指向函数的指针

int (*f1(int))(int*, int);  // 直接声明
```

也可以使用尾置返回类型

```cpp
auto f1(int) -> int(*)(int*, int);
```

将 `decltype` 用于函数指针类型

```cpp
string::size_type sumLength(const string&, const string&);
string::size_type largerLength(const string&, const string&);

// 根据其形参的取值，getFcn 函数返回指向 sumLength 或者 largerLength 的指针
decltype(sumLength) *getFunc(const string &);
```

> `decltype` 作用于某个函数时，它返回函数类型而非指针类型，需要显式加上 `*` 表明需要返回的指针

## 类

### 常量成员函数

```cpp
double Sales_data::avg_price() const;
```

常量成员函数不会修改该类的任何成员数据的值。

1. 类成员函数声明中的 const 后缀，表明其 this 指针指向 const 型类对象，因此该 const 类对象，可以调用常量成员函数 (const member function)；
2. 一个成员函数，如果对数据成员只涉及读操作，而不进行修改操作，则尽可能声明为常量成员函数。

