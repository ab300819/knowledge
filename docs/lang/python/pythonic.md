- [Pythonic](#pythonic)
  - [编程惯用法](#编程惯用法)
    - [将常量集中到一个文件](#将常量集中到一个文件)
    - [利用 `assert` 语句来发现问题](#利用-assert-语句来发现问题)
    - [数据交换值的时候不推荐使用中间变量](#数据交换值的时候不推荐使用中间变量)
    - [不推荐使用 `type` 来进行类型检查](#不推荐使用-type-来进行类型检查)
    - [警惕 `eval()` 安全漏洞](#警惕-eval-安全漏洞)
    - [使用 `enumerate()` 获取序列迭代的索引和值](#使用-enumerate-获取序列迭代的索引和值)
    - [`==` 和 `is` 的场景](#-和-is-的场景)
    - [让代码既可以被导入又可以被执行](#让代码既可以被导入又可以被执行)
    - [用下面的方式判断逻辑“真”或“假”](#用下面的方式判断逻辑真或假)
    - [使用 `in` 运算符](#使用-in-运算符)
    - [用序列构建字符串](#用序列构建字符串)
    - [EAFP 优于 LBYL](#eafp-优于-lbyl)
    - [使用 `enumerate` 进行迭代](#使用-enumerate-进行迭代)
    - [用列表生成器](#用列表生成器)
    - [用 `zip` 组合键和值来创建字典](#用-zip-组合键和值来创建字典)
  - [基础语法](#基础语法)
    - [`i+=1` 不等于 `++i`](#i1-不等于-i)

# Pythonic

## 编程惯用法

### 将常量集中到一个文件

首先定义一个 const 模块

```py
import sys


class _const:
    class ConstError(TypeError):
        pass

    def __setattr__(self, name, value):
        if name in self.__dict__.keys():
            raise self.ConstError("Can't rebind const(%s)" % name)
        self.__dict__[name] = value

    def __delattr__(self, name):
        if name in self.__dict__:
            raise self.ConstError("Can't unbind const(%s)" % name)
        raise NameError(name)


sys.modules[__name__] = _const()
```

引入 const 模块，定义常量

```py
import const

const.TEST_VALUE = 'test value'
```

### 利用 `assert` 语句来发现问题

```py
x = 1
y = 2
assert x==y, 'not equals'
```

使用 `assert` 相当于使用

```py
if __debug__ and not x == y:
    raise AssertionError('not equals')
```

运行时加上 `-O` 可禁用断言。

使用断言需要注意：

1. 不要滥用，断言不是用来捕捉程序本身错误的；
2. 如果 Python 本身的异常能够处理就不要再使用断言；
3. 不要使用断言来检查用户的输入；
4. 在函数调用后，当需要确认返回值是否合理时可以使用断言；
5. 当条件是业务逻辑继续下去的先决条件时可以使用断言。

### 数据交换值的时候不推荐使用中间变量

```py
a, b = b, a
```

### 不推荐使用 `type` 来进行类型检查

对于内建的基本类型使用 `type()` 进行类型检查问题不大，否则可以使用 `isinstance()` 进行检查 

### 警惕 `eval()` 安全漏洞

在需要使用 `eval` 的地方可以用安全性更好的 `ast.literal_eval`。

### 使用 `enumerate()` 获取序列迭代的索引和值

遍历列表时可使用 `enumerate()` 同时获取索引和值

```py
el = [1,2,3,4,5,6,7,8,9]
for i,e in enumerate(el):
    print(str(i)+':'+str(e))
```

不可用于字典，如果想要同时获取字典的 key 和 value 使用 `items()`

```py
map = {'test':1'abc':2'def':3}
for k,v in map.items():
    print(k+':'+str(v))
```

### `==` 和 `is` 的场景

`==` 用于比较两个对象是否拥有同一块内存空间，也就是是不是同一个对象，相当于 `id(a) == id(b)`；
`is` 用于比较两个对象值是否相等，相当于 `a.__eq__(b)`

### 让代码既可以被导入又可以被执行

```py
if __name__ == '__main__':
```

### 用下面的方式判断逻辑“真”或“假”

```py
if x:
if not x:
```

**好**

```py
name = 'jackfrued'
fruits = ['apple', 'orange', 'grape']
owners = {'1001': '骆昊', '1002': '王大锤'}
if name and fruits and owners:
    print('I love fruits!')
```

**不好**

```py
name = 'jackfrued'
fruits = ['apple', 'orange', 'grape']
owners = {'1001': '骆昊', '1002': '王大锤'}
if name != '' and len(fruits) > 0 and owners != {}:
    print('I love fruits!')
```

### 使用 `in` 运算符

```py
if x in items: # 包含
for x in items: # 迭代
```

**好**

```py
name = 'Hao LUO'
if 'L' in name:
    print('The name has an L in it.')
```

**不好**

```py
name = 'Hao LUO'
if name.find('L') != -1:
    print('This name has an L in it!')
```

### 用序列构建字符串

**好**

```py
chars = ['j', 'a', 'c', 'k', 'f', 'r', 'u', 'e', 'd']
name = ''.join(chars)
print(name)  # jackfrued
```

**不好**

```py
chars = ['j', 'a', 'c', 'k', 'f', 'r', 'u', 'e', 'd']
name = ''
for char in chars:
    name += char
print(name)  # jackfrued
```

### EAFP 优于 LBYL

* EAFP - Easier to Ask Forgiveness than Permission（先用出问题在说）
* LBYL - Look Before You Leap（先检查没问题再使用）

**好**

```py
d = {'x': '5'}
try:
    value = int(d['x'])
    print(value)
except (KeyError, TypeError, ValueError):
    value = None
```

**不好**

```py
d = {'x': '5'}
if 'x' in d and isinstance(d['x'], str) and d['x'].isdigit():
    value = int(d['x'])
    print(value)
else:
    value = None
```

### 使用 `enumerate` 进行迭代

**好**

```py
fruits = ['orange', 'grape', 'pitaya', 'blueberry']
for index, fruit in enumerate(fruits):
    print(index, ':', fruit)
```

**不好**

```py
fruits = ['orange', 'grape', 'pitaya', 'blueberry']
index = 0
for fruit in fruits:
    print(index, ':', fruit)
    index += 1
```

### 用列表生成器

**好**

```py
data = [7, 20, 3, 15, 11]
result = [num * 3 for num in data if num > 10]
print(result)  # [60, 45, 33]
```

**不好**

```py
data = [7, 20, 3, 15, 11]
result = []
for i in data:
    if i > 10:
       result.append(i * 3)
print(result)  # [60, 45, 33]
```

### 用 `zip` 组合键和值来创建字典

**好**

```py
keys = ['1001', '1002', '1003']
values = ['骆昊', '王大锤', '白元芳']
d = dict(zip(keys, values))
print(d)
```

**不好**

```py
keys = ['1001', '1002', '1003']
values = ['骆昊', '王大锤', '白元芳']
d = {}
for i, key in enumerate(keys):
    d[key] = values[i]
print(d)
```

## 基础语法

### `i+=1` 不等于 `++i`

Python 解释器会将 `++i` 操作解释为 `+(+i)`，其中 `+` 表示正数符号，对于i操作也是类似。