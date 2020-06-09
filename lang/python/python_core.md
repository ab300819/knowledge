<!-- TOC -->

- [基本语法](#基本语法)
    - [在unix环境中运行Python脚本](#在unix环境中运行python脚本)
        - [运行权限](#运行权限)
        - [在脚本头部添加](#在脚本头部添加)
        - [编码](#编码)
    - [数据结构](#数据结构)
        - [`list` 和 `tuple`](#list-和-tuple)
        - [`dict` 和 `set`](#dict-和-set)
        - [高级特性](#高级特性)
            - [切片](#切片)
            - [列表生成器](#列表生成器)
            - [生成器](#生成器)
            - [迭代](#迭代)
    - [函数](#函数)
    - [函数式编程](#函数式编程)
        - [高阶函数](#高阶函数)
            - [`map` / `reduce`](#map--reduce)
            - [`filter`](#filter)
            - [`sorted`](#sorted)
        - [返回函数](#返回函数)
        - [匿名函数](#匿名函数)
        - [装饰器](#装饰器)
        - [偏函数](#偏函数)
    - [面向对象编程](#面向对象编程)
        - [类和实例](#类和实例)
        - [访问限制](#访问限制)
        - [继承和多态](#继承和多态)
        - [获取对象信息](#获取对象信息)
    - [面向对象高级编程](#面向对象高级编程)
        - [使用 `__slots__`](#使用-__slots__)
        - [使用 `@property`](#使用-property)
        - [定制类](#定制类)
            - [`__str__`](#__str__)
            - [`__iter__`](#__iter__)
            - [`__getitem__`](#__getitem__)
            - [`__getattr__`](#__getattr__)
            - [`__call__`](#__call__)
        - [使用枚举类](#使用枚举类)
        - [使用元类](#使用元类)
            - [`type()`](#type)
            - [`metaclass`](#metaclass)
    - [错误、调试和测试](#错误调试和测试)
        - [错误处理](#错误处理)
        - [单元测试](#单元测试)
        - [文档测试](#文档测试)
    - [IO编程](#io编程)
        - [文件读写](#文件读写)
        - [`StringIO` 和 `BytesIO`](#stringio-和-bytesio)
        - [操作文件和目录](#操作文件和目录)
        - [序列化](#序列化)
            - [通过 `pickle` 进行序列化操作](#通过-pickle-进行序列化操作)
            - [JSON](#json)
    - [进程与线程](#进程与线程)
        - [多进程](#多进程)
        - [多线程](#多线程)
        - [`ThreadLocal`](#threadlocal)
        - [分布式进程](#分布式进程)
    - [正则表达式](#正则表达式)
        - [基本](#基本)
        - [进阶](#进阶)
        - [re模块](#re模块)
        - [切分字符串](#切分字符串)
        - [分组](#分组)
        - [贪婪匹配](#贪婪匹配)
        - [编译](#编译)

<!-- /TOC -->

# 基本语法

## 在unix环境中运行Python脚本

### 运行权限

```bash
chmod u+x scriptfile

chmod 755 scriptfile
```

### 在脚本头部添加

```python
#!/usr/local/bin/python
#!/usr/local/bin/python3

#!/usr/bin/env python
#!/usr/bin/env python3
```

### 编码

```python
# -*- coding: encoding -*-
```

## 数据结构

### `list` 和 `tuple`

`list`是一种有序的集合，可以随时添加和删除其中的元素

```python
# 创建列表
classmates = ['Michael', 'Bob', 'Tracy']
```

```python
# 列表长度
len(classmates)
```

```python
# 访问元素
classmates[0]   #正序从0开始表示第一个元素
classmates[-1]  #逆序从-1开始表示最后一个元素
```

```python
classmates.append('Adam')   # 在末尾添加一个元素
classmates.insert(1, 'Jack')    # 在索引号为1的位置添加元素
classmates.pop()    # 删除末尾元素
classmates.pop(i)   # 删除索引位置为i的元素
classmates[1] = 'Sarah' # 把某个元素替换成其他的
```

`tuple` 是另一种有序列表叫元组，和 `list` 非常类似，但是 `tuple` 一旦初始化就不能修改

```python
# 创建 tuple
classmates = ('Michael', 'Bob', 'Tracy')
```

```python
# 定义一个空的 tuple
t = ()
```

```python
# 定义一个只有1个元素的 tuple
t = (1,)
```

### `dict` 和 `set`

`dict`使用键-值（key-value）存储

```python
# 定义字典
d = {'Michael': 95, 'Bob': 75, 'Tracy': 85}
```

```python
# 判断key存不存在，两种方法
'Thomas' in d

d.get('Thomas')
```

```python
# 删除一个key,对应的value也会从dict中删除
d.pop('Bob')
```

`set` 和 `dict` 类似，也是一组key的集合，但不存储value，而且key不能重复

```python
# 要创建一个set，需要提供一个list作为输入集合
s = set([1, 2, 3])
```

```python
s.add(4)    # 添加一个key
s.remove(4) # 删除一个key
```

### 高级特性

#### 切片

从 0 到索引 3 位置，但不包括 3，[0,3)

```python
l[0:3]

# 默认从 0 开始
l[:3]

# 从 0 到结束
l[0:]
```

取倒数第 1 个

```python
l=[-1]
```

隔 5 个取一个

```python
l=[::5]
```

逆序

```python
l[::-1]
```

#### 列表生成器

```python
# 生成[1x1, 2x2, 3x3, ..., 10x10]
[x * x for x in range(1, 11)]

# 筛选出偶数平方
[x * x for x in range(1, 11) if x % 2 == 0]

# ['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ']
[m + n for m in 'ABC' for n in 'XYZ']
```

#### 生成器

和列表生成器的区别在于，不会直接计算出所有元素，而是在循环中不断计算元素值。

创建generator

```python
g = (x * x for x in range(10))
```

使用 `g.next()` 或循环得到元素值。

使用 `yield`，将函数转变为生成器

```python
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        # yield b
        print(b)
        a, b = b, a + b
        n = n + 1
    return 'done'
```

#### 迭代

普通循环

```python
names = ['Michael', 'Bob', 'Tracy']
for name in names:
    print(name)
```

带有下标循环

```python
for i, value in enumerate(['A', 'B', 'C']):
    print(i, value)
```

默认情况下，`dict` 迭代的是 key，如果要迭代 value，可以用

```python
for value in d.values()
````

如果要同时迭代 key 和 value，可以用

```python
for k, v in d.items()
```

可用于 `for` 循环的数据类型有两种：

- 集合数据类型，如 `list` 、 `tuple` 、 `dict` 、 `set` 、 `str` 等
- `generator` ，包括生成器和带 `yield` 的generator function

`isinstance()` 判断一个对象是 `Iterable` 还是 `Iterator`

- 可以直接作用于 `for` 循环的对象统称为 **可迭代对象** ：`Iterable`  
- 可以被 `next()` 函数调用并不断返回下一个值的对象称为 **迭代器** ：`Iterator`

## 函数

默认参数必须指向不变对象

```python
def add_end(L=None):
    if L is None:
        L = []
    L.append('END')
    return L
```

## 函数式编程

### 高阶函数

#### `map` / `reduce`

`map` 函数接收两个参数，一个是函数，一个是 `Iterable`，`map` 将传入的函数依次作用到序列的每个元素，并把结果作为新的 `Iterator` 返回

```python
def square(x):
    return x*x

map(square,[1,2,3,4,5,5,6,7,8,9])
```

`reduce` 把一个函数作用在一个序列 `[x1, x2, x3, ...]` 上，这个函数必须接收两个参数，`reduce` 把结果继续和序列的下一个元素做累积计算

```python
def add(x,y):
    return x+y

reduce(add,[1,2,3,4,5,6,7,8,9])
```

#### `filter`  

`filter` 函数用于过滤序列，接收一个函数和一个序列，把传入的函数依次作用于每个元素，然后根据返回值是 `True` 还是 `False` 决定保留还是丢弃该元素

```python
def checkNum(n):
    return n%2==1

filter(checkNum,[1,2,3,4,5,6,7,8,9])
```

#### `sorted`

直接进行排序

```python
sorted([36, 5, -12, 9, -21])
```

接受一个 `sort_rule(x,y)` 函数实现自定义排序

```python
sorted([36, 5, -12, 9, -21], sort_rule)
```

### 返回函数

函数作为返回值

```python
def lazy_sum(*args):
    def sum():
        ax = 0
        for n in args:
            ax = ax + n
        return ax
    return sum
```

闭包

```python
def count():
    def f(j):
        def g():
            return j*j
        return g
    fs = []
    for i in range(1, 4):
        fs.append(f(i)) # f(i)立刻被执行，因此i的当前值被传入f()
    return fs
```

### 匿名函数

```python
lambda 参数 : 函数主体
```

### 装饰器

函数对象有一个__name__属性，可以拿到函数的名字

```python

def now():
    pass

now.__name__
```

decorator 的写法

```python
import functools

def log(func):
    @functools.wraps(func)
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper
```

参数的decorator

```python
import functools

def log(text):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator
```

使用装饰器

```python
@log
now()
```

### 偏函数

将字符串转化为整数，默认十进制

```python
int('12345')
```

默认十进制，传入base参数，就可以做N进制的转换

```python
int('12345', base=8)
```

通过偏函数，把某些参数给固定住，创建一个新函数并返回

```python
import functools
int2 = functools.partial(int, base=2)
```

## 面向对象编程

### 类和实例

定义类

```python
class Student(object):

    def __init__(self, name, score):
        self.name = name
        self.score = score

    def print_score(self):
        print('%s: %s' % (self.name, self.score))

    def get_grade(self):
        if self.score >= 90:
            return 'A'
        elif self.score >= 60:
            return 'B'
        else:
            return 'C'
```

创建实例

```python
bart = Student('Bart Simpson', 59)
lisa = Student('Lisa Simpson', 87)
```

### 访问限制

实例的变量名如果以 `__` 开头，就变成了一个私有变量（`private`），需要增加 `get_name` 和 `get_score` 方法

### 继承和多态

父类

```python
class Animal(object):
    def run(self):
        print('Animal is running...')
```

子类

```python
class Dog(Animal):
    pass

class Cat(Animal):
    pass
```

多态

```python
class Dog(Animal):

    def run(self):
        print('Dog is running...')

    def eat(self):
        print('Eating meat...')
```

### 获取对象信息

判断对象类型

```python
type()

type(123)
# <class 'int'>
type('str')
# <class 'str'>
type(None)
# <type(None) 'NoneType'>
```

对于 class 的继承关系，使用 `isinstance()`，使用 `dir()` 获得一个对象的所有属性和方法

## 面向对象高级编程

### 使用 `__slots__`

通过 `__slots__` 变量，来限制该class实例能添加的属性

```python
class Student(object):
    __slots__ = ('name', 'age') # 用 tuple 定义允许绑定的属性名称
```

### 使用 `@property`

既可直接操作属性，又可实现参数检查

```python
class Student(object):

    @property
    def score(self):
        return self._score

    @score.setter
    def score(self, value):
        if not isinstance(value, int):
            raise ValueError('score must be an integer!')
        if value < 0 or value > 100:
            raise ValueError('score must between 0 ~ 100!')
        self._score = value
```

### 定制类

#### `__str__`

通过  定制输出信息

```python
class Student(object):
    def __init__(self,name):
        self.name = name
    def __str__(self):
        return 'Student object (name: %s)' % self.name

# 测试
s=Student('Michael')
print(s)
s
```

直接显示变量调用的不是 `__str__()` ，而是 `__repr__()` ，两者的区别是 `__str__()` 返回用户看到的字符串，而 `__repr__()` 返回程序开发者看到的字符串。

定义一个 `__repr__`

```python
class Student(object):
    def __init__(self, name):
        self.name = name
    def __str__(self):
        return 'Student object (name=%s)' % self.name
    # 偷懒写法
    __repr__ = __str__
```

#### `__iter__`

一个类想被用于 `for ... in` 循环，类似 `list` 或 `tuple` 那样，就必须实现一个 `__iter__()` 方法

```python
class Fib(object):
    def __init__(self):
        self.a, self.b = 0, 1 # 初始化两个计数器a，b

    def __iter__(self):
        return self # 实例本身就是迭代对象，故返回自己

    def __next__(self):
        self.a, self.b = self.b, self.a + self.b # 计算下一个值
        if self.a > 100000: # 退出循环的条件
            raise StopIteration();
        return self.a # 返回下一个值
```

#### `__getitem__`

像 `list` 实现下标取元素

```python
class Fib(object):
    def __getitem__(self, n):
        a, b = 1, 1
        for x in range(n):
            a, b = b, a + b
        return a
```

实现切片

```python
class Fib(object):
    def __getitem__(self, n):
        if isinstance(n, int): # n是索引
            a, b = 1, 1
            for x in range(n):
                a, b = b, a + b
            return a
        if isinstance(n, slice): # n是切片
            start = n.start
            stop = n.stop
            if start is None:
                start = 0
            a, b = 1, 1
            L = []
            for x in range(stop):
                if x >= start:
                    L.append(a)
                a, b = b, a + b
            return L
```

#### `__getattr__`

当一个属性或方法不存在时，通过定义 `__getattr__` 动态的返回属性或方法
当调用不存在的属性时，解释器会试图调用 `__getattr__(self, 'score')` 来尝试获得属性

```python
class Student(object):

    def __init__(self):
        self.name = 'Michael'

    def __getattr__(self, attr):
        if attr=='score':
            return 99

# 同样适用于方法
class Student(object):

    def __getattr__(self, attr):
        if attr=='age':
            return lambda: 25

# 方法调用方式
s = Student()
s.age()
```

#### `__call__`  

定义一个 `__call__()` 方法，就可以直接对实例进行调用  

```python
class Student(object):
    def __init__(self, name):
        self.name = name

    def __call__(self):
        print('My name is %s.' % self.name)
```

```python
s = Student()
s()
```

### 使用枚举类

使用 `@unique` 装饰器可以检查保证没有重复值

```python

from enum import Enum, unique

@unique
class Weekday(Enum):
    Sun = 0 # Sun的value被设定为0
    Mon = 1
    Tue = 2
    Wed = 3
    Thu = 4
    Fri = 5
    Sat = 6
```

### 使用元类

#### `type()`

要创建一个 class 对象，`type()` 函数依次传入 3 个参数：

1. class 的名称
2. 继承的父类集合，注意 Python 支持多重继承，如果只有一个父类，别忘了 `tuple` 的单元素写法；
3. class 的方法名称与函数绑定，这里把函数 `fn` 绑定到方法名 `hello` 上。

```python
def fn(self, name='world'): # 先定义函数
    print('Hello, %s.' % name)

Hello = type('Hello', (object,), dict(hello=fn)) # 创建Hello class
```

#### `metaclass`

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# metaclass是创建类，所以必须从`type`类型派生：
class ListMetaclass(type):
    def __new__(cls, name, bases, attrs):
        attrs['add'] = lambda self, value: self.append(value)
        return type.__new__(cls, name, bases, attrs)

# 指示使用ListMetaclass来定制类
class MyList(list, metaclass=ListMetaclass):
    pass

L = MyList()
L.add(1)
L.add(2)
L.add(3)
L.add('END')
print(L)
```

## 错误、调试和测试

### 错误处理

`try ... except`

```python
try:
    print('try...')
    r = 10 / 0
    print('result:', r)
except ZeroDivisionError as e:
    print('except:', e)
finally:
    print('finally...')
print('END')
```

记录错误

```python
import logging

def foo(s):
    return 10 / int(s)

def bar(s):
    return foo(s) * 2

def main():
    try:
        bar('0')
    except Exception as e:
        logging.exception(e)

main()
print('END')
```

如果要抛出错误，首先根据需要，可以定义一个错误的 class，选择好继承关系，然后，用 `raise` 语句抛出一个错误的实例

```python
class FooError(ValueError):
    pass

def foo(s):
    n = int(s)
    if n==0:
        raise FooError('invalid value: %s' % s)
    return 10 / n

foo('0')
```

### 单元测试

测试类从 `unittest.TestCase` 继承

```python
import unittest

from mydict import Dict

class TestDict(unittest.TestCase):

    def test_init(self):
        d = Dict(a=1, b='test')
        self.assertEquals(d.a, 1)
        self.assertEquals(d.b, 'test')
        self.assertTrue(isinstance(d, dict))

    def test_key(self):
        d = Dict()
        d['key'] = 'value'
        self.assertEquals(d.key, 'value')

    def test_attr(self):
        d = Dict()
        d.key = 'value'
        self.assertTrue('key' in d)
        self.assertEquals(d['key'], 'value')

    def test_keyerror(self):
        d = Dict()
        with self.assertRaises(KeyError):
            value = d['empty']

    def test_attrerror(self):
        d = Dict()
        with self.assertRaises(AttributeError):
            value = d.empty    
```

以 `test` 开头的为测试方法，不以 `test` 开头的为非测试方法，测试的时候不会被执行。
 执行单元测试有两种方式，一种当作正常 python 脚本进行单元测试，在代码后面添加两行；

```python
if __name__ == '__main__':
    unittest.main()
```

另一种，通过命令行参数直接运行单元测试

```bash
python -m unittest <测试脚本>
```

- `setUp()` 测试之前调用
- `tearDown()` 测试之后调用

### 文档测试

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

class Dict(dict):
    '''
    Simple dict but also support access as x.y style.
    >>> d1 = Dict()
    >>> d1['x'] = 100
    >>> d1.x
    100
    >>> d1.y = 200
    >>> d1['y']
    200
    >>> d2 = Dict(a=1, b=2, c='3')
    >>> d2.c
    '3'
    >>> d2['empty']
    Traceback (most recent call last):
        ...
    KeyError: 'empty'
    >>> d2.empty
    Traceback (most recent call last):
        ...
    AttributeError: 'Dict' object has no attribute 'empty'
    '''
    def __init__(self, **kw):
        super(Dict, self).__init__(**kw)

    def __getattr__(self, key):
        try:
            return self[key]
        except KeyError:
            raise AttributeError(r"'Dict' object has no attribute '%s'" % key)

    def __setattr__(self, key, value):
        self[key] = value

if __name__=='__main__':
    import doctest
    doctest.testmod()
```

## IO编程

### 文件读写

读文件

```python
# 使用 with 会自动调用 close()

with open('/path/to/file', 'r') as f:
    print(f.read())
```

调用 `read()` 会一次性读取文件的全部内容，为防止读取过多，可以反复调用 `read(size)` 方法，或者调用 `readline()` 可以每次读取一行内容，，调用 `readlines()` 一次读取所有内容并按行返回 `list`。

二进制文件

```python
f = open('/Users/michael/test.jpg', 'rb')
```

字符编码

```python
f = open('/Users/michael/gbk.txt', 'r', encoding='gbk')

# 如果混杂其他编码，可使用 ignore 忽略
f = open('/Users/michael/gbk.txt', 'r', encoding='gbk', errors='ignore')
```

写文件

```python
with open('/Users/michael/test.txt', 'w') as f:
    f.write('Hello, world!')
```

以 `w` 模式写入文件时，如果文件已存在，会直接覆盖（相当于删掉后新写入一个文件），可以传入 `a` 以追加（append）模式写入。

### `StringIO` 和 `BytesIO`

`StringIO` 在内存读写 str

```python
# 像文件一样读写
from io import StringIO
f = StringIO()
f.write('hello')
f.write(' ')
f.write('world!')
print(f.getvalue())
```

可以用 str 初始化 `StringIO` 然后像文件一样读取

```python
from io import StringIO
f = StringIO('Hello!\nHi!\nGoodbye!')
while True:
    s = f.readline()
    if s == '':
        break
    print(s.strip())
```

 `BytesIO` 操作二进制数据

```python
from io import BytesIO
f = BytesIO()
f.write('中文'.encode('utf-8'))
print(f.getvalue())
```

### 操作文件和目录

环境变量

```python
# 获取所有环境变量
os.environ

# 获取具体环境变量
os.environ.get('path')
```

操作文件和目录

```python
# 查看当前目录的绝对路径
os.path.abspath('.')

# 两个路径合成一个
os.path.join('/Users/michael', 'testdir')

# 然后创建一个目录
os.mkdir('/Users/michael/testdir')

# 删掉一个目录
os.rmdir('/Users/michael/testdir')

# 拆分路径,得到最后级别的目录或文件名
os.path.split('/Users/michael/testdir/file.txt')

# 得到文件扩展名
os.path.splitext('/path/to/file.txt')

# 对文件重命名
os.rename('test.txt','test.py')

# 删除文件
os.remove('test.py')

# 列出后缀名为 .py 的文件
[x for x in os.listdir('.') if os.path.isfile(x) and os.path.splitext(x)[1]=='.py']
```

### 序列化

#### 通过 `pickle` 进行序列化操作

序列化

```python
# 序列化为一个 bytes
import pickle
d = dict(name='Bob', age=20, score=88)
pickle.dumps(d)

# 直接写入文件
f = open('dump.txt', 'wb')
pickle.dump(d, f)
f.close()
```

反序列化

```python
 f = open('dump.txt', 'rb')
d = pickle.load(f)
f.close()
```

#### JSON

JSON 和 Python 内置的数据类型对应

JSON类型 |  Python类型
--- | ---
{} | `dict`
[] | `list`
"string" |  `str`
1234.56 |   `int` 或 `float`
true/false | `True` / `False`
null |  `None`

转化为 json 对象

```python
import json
d = dict(name='Bob', age=20, score=88)
json.dumps(d)
```

从 json 对象转化为 python 对象

```python
import json

jsonData = '{"a":1,"b":2,"c":3,"d":4,"e":5}';

text = json.loads(jsonData)
print text
```

## 进程与线程

### 多进程

创建进程

```python
from multiprocessing import Process
import os

# 子进程要执行的代码
def run_proc(name):
    print('Run child process %s (%s)...' % (name, os.getpid()))

if __name__=='__main__':
    print('Parent process %s.' % os.getpid())
    p = Process(target=run_proc, args=('test',))
    print('Child process will start.')
    p.start()
    p.join()
    print('Child process end.')
```

使用线程池,创建大量子进程

```python
from multiprocessing import Pool
import os, time, random

def long_time_task(name):
    print('Run task %s (%s)...' % (name, os.getpid()))
    start = time.time()
    time.sleep(random.random() * 3)
    end = time.time()
    print('Task %s runs %0.2f seconds.' % (name, (end - start)))

if __name__=='__main__':
    print('Parent process %s.' % os.getpid())
    p = Pool(4)
    for i in range(5):
        p.apply_async(long_time_task, args=(i,))
    print('Waiting for all subprocesses done...')
    p.close()
    p.join()
    print('All subprocesses done.')
```

调用外部进程

```python
import subprocess

print('$ nslookup www.python.org')
r = subprocess.call(['nslookup', 'www.python.org'])
print('Exit code:', r)
```

如果需要输入，则通过 `communicate()` 方法输入

```python
import subprocess

print('$ nslookup')
p = subprocess.Popen(['nslookup'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
output, err = p.communicate(b'set q=mx\npython.org\nexit\n')
print(output.decode('utf-8'))
print('Exit code:', p.returncode)
```

进程间通信

```python
from multiprocessing import Process, Queue
import os, time, random

# 写数据进程执行的代码:
def write(q):
    print('Process to write: %s' % os.getpid())
    for value in ['A', 'B', 'C']:
        print('Put %s to queue...' % value)
        q.put(value)
        time.sleep(random.random())

# 读数据进程执行的代码:
def read(q):
    print('Process to read: %s' % os.getpid())
    while True:
        value = q.get(True)
        print('Get %s from queue.' % value)

if __name__=='__main__':
    # 父进程创建Queue，并传给各个子进程：
    q = Queue()
    pw = Process(target=write, args=(q,))
    pr = Process(target=read, args=(q,))
    # 启动子进程pw，写入:
    pw.start()
    # 启动子进程pr，读取:
    pr.start()
    # 等待pw结束:
    pw.join()
    # pr进程里是死循环，无法等待其结束，只能强行终止:
    pr.terminate()
```

### 多线程

创建多线程

```python
import time, threading

# 新线程执行的代码:
def loop():
    print('thread %s is running...' % threading.current_thread().name)
    n = 0
    while n < 5:
        n = n + 1
        print('thread %s >>> %s' % (threading.current_thread().name, n))
        time.sleep(1)
    print('thread %s ended.' % threading.current_thread().name)

print('thread %s is running...' % threading.current_thread().name)
t = threading.Thread(target=loop, name='LoopThread')
t.start()
t.join()
print('thread %s ended.' % threading.current_thread().name)
```

进程锁

```python
balance = 0
lock = threading.Lock()

def run_thread(n):
    for i in range(100000):
        # 先要获取锁:
        lock.acquire()
        try:
            # 放心地改吧:
            change_it(n)
        finally:
            # 改完了一定要释放锁:
            lock.release()
```

### `ThreadLocal`

```python
import threading

# 创建全局ThreadLocal对象:
local_school = threading.local()

def process_student():
    # 获取当前线程关联的student:
    std = local_school.student
    print('Hello, %s (in %s)' % (std, threading.current_thread().name))

def process_thread(name):
    # 绑定ThreadLocal的student:
    local_school.student = name
    process_student()

t1 = threading.Thread(target= process_thread, args=('Alice',), name='Thread-A')
t2 = threading.Thread(target= process_thread, args=('Bob',), name='Thread-B')
t1.start()
t2.start()
t1.join()
t2.join()
```

### 分布式进程

```python
# task_master.py

import random, time, queue
from multiprocessing.managers import BaseManager

# 发送任务的队列:
task_queue = queue.Queue()
# 接收结果的队列:
result_queue = queue.Queue()

# 从BaseManager继承的QueueManager:
class QueueManager(BaseManager):
    pass

# 把两个Queue都注册到网络上, callable参数关联了Queue对象:
QueueManager.register('get_task_queue', callable=lambda: task_queue)
QueueManager.register('get_result_queue', callable=lambda: result_queue)
# 绑定端口5000, 设置验证码'abc':
manager = QueueManager(address=('', 5000), authkey=b'abc')
# 启动Queue:
manager.start()
# 获得通过网络访问的Queue对象:
task = manager.get_task_queue()
result = manager.get_result_queue()
# 放几个任务进去:
for i in range(10):
    n = random.randint(0, 10000)
    print('Put task %d...' % n)
    task.put(n)
# 从result队列读取结果:
print('Try get results...')
for i in range(10):
    r = result.get(timeout=10)
    print('Result: %s' % r)
# 关闭:
manager.shutdown()
print('master exit.')
```

```python
# task_worker.py

import time, sys, queue
from multiprocessing.managers import BaseManager

# 创建类似的QueueManager:
class QueueManager(BaseManager):
    pass

# 由于这个QueueManager只从网络上获取Queue，所以注册时只提供名字:
QueueManager.register('get_task_queue')
QueueManager.register('get_result_queue')

# 连接到服务器，也就是运行task_master.py的机器:
server_addr = '127.0.0.1'
print('Connect to server %s...' % server_addr)
# 端口和验证码注意保持与task_master.py设置的完全一致:
m = QueueManager(address=(server_addr, 5000), authkey=b'abc')
# 从网络连接:
m.connect()
# 获取Queue的对象:
task = m.get_task_queue()
result = m.get_result_queue()
# 从task队列取任务,并把结果写入result队列:
for i in range(10):
    try:
        n = task.get(timeout=1)
        print('run task %d * %d...' % (n, n))
        r = '%d * %d = %d' % (n, n, n*n)
        time.sleep(1)
        result.put(r)
    except Queue.Empty:
        print('task queue is empty.')
# 处理结束:
print('worker exit.')
```

## 正则表达式

### 基本

- `\d` 可以匹配一个数字
- `\w` 可以匹配一个字母或数字
- `.` 可以匹配任意字符

例子：

1. `00\d` 可以匹配 `007`
2. `\d\d\d` 可以匹配 `010`
3. `\w\w\d` 可以匹配 `py3`
4. `py.` 可以匹配 `pyc` 、 `pyo` 、`py!` 等等

匹配变长的字符

- `*` 表示任意个字符（包括0个）
- `+` 表示至少一个字符
- `?` 表示0个或1个字符
- `{n}` 表示n个字符，用 `{n,m}` 表示 n-m 个字符
- `\s` 可以匹配一个空格，所以 `\s+` 表示至少有一个空格

### 进阶

1. `A|B`可以匹配A或B，所以`[P|p]ython`可以匹配`'Python'`或者`'python'`。
2. `^`表示行的开头，`^\d`表示必须以数字开头。
3. `$`表示行的结束，`\d$`表示必须以数字结束。

可以用 `[]` 表示范围，比如：

- `[0-9a-zA-Z\_]`可以匹配一个数字、字母或者下划线；
- `[0-9a-zA-Z\_]+`可以匹配至少由一个数字、字母或者下划线组成的字符串，比如`'a100'`，`'0_Z'`，`'Py3000'`等等；
- `[a-zA-Z\_][0-9a-zA-Z\_]*`可以匹配由字母或下划线开头，后接任意个由一个数字、字母或者下划线组成的字符串，也就是Python合法的变量；
- `[a-zA-Z\_][0-9a-zA-Z\_]{0, 19}`更精确地限制了变量的长度是1-20个字符（前面1个字符+后面最多19个字符）。

### re模块

```python
s = 'ABC\\-001' # Python的字符串
# 对应的正则表达式字符串变成：
# 'ABC\-001'
```

使用 `r` 前缀，就不用考虑转义

```python
s = r'ABC\-001' # Python的字符串
# 对应的正则表达式字符串不变：
# 'ABC\-001'
```

`match()` 方法判断是否匹配，如果匹配成功，返回一个 `Match` 对象，否则返回 `None`。

### 切分字符串

普通匹配

```python
'a b   c'.split(' ')
#['a', 'b', '', '', 'c']
```

使用正则表达式

```python
re.split(r'\s+', 'a b   c')
#['a', 'b', 'c']
```

```python
re.split(r'[\s\,]+', 'a,b, c  d')
#['a', 'b', 'c', 'd']
```

```python
re.split(r'[\s\,\;]+', 'a,b;; c  d')
#['a', 'b', 'c', 'd']
```

### 分组

`()` 表示要提取的分组（Group），比如：`^(\d{3})-(\d{3,8})$` 分别定义两个分组

```python
m = re.match(r'^(\d{3})-(\d{3,8})$', '010-12345')
# <_sre.SRE_Match object at 0x1026fb3e8>

m.group(0)
# '010-12345'

m.group(1)
# '010'

m.group(2)
# '12345'
```

如果正则表达式中定义了组，就可以在 `Match` 对象上用 `group()` 方法提取出子串来；`group(0)`永远是原始字符串，`group(1)`、`group(2)`……表示第1、2、……个子串。

```bash
t = '19:05:30'
m = re.match(r'^(0[0-9]|1[0-9]|2[0-3]|[0-9])\:(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|[0-9])\:(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|[0-9])$', t)
m.groups()

# ('19', '05', '30')
```

### 贪婪匹配

```python
re.match(r'^(\d+)(0*)$', '102300').groups()
# ('102300', '')
```

由于 `\d+` 采用贪婪匹配，直接把后面的 `0` 全部匹配了，结果 `0*` 只能匹配空字符串了。  
必须让 `\d+` 采用非贪婪匹配（也就是尽可能少匹配），才能把后面的 `0` 匹配出来，加个 `?` 就可以让 `\d+` 采用非贪婪匹配：

```python
re.match(r'^(\d+?)(0*)$', '102300').groups()
# ('1023', '00')
```

### 编译

```python
import re
re_telephone = re.compile(r'^(\d{3})-(\d{3,8})$')

re_telephone.match('010-12345').groups()
# ('010', '12345')

re_telephone.match('010-8086').groups()
# ('010', '8086')
```