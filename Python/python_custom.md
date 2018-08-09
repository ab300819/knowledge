<!-- TOC -->

- [Python 一些习惯](#python-一些习惯)
    - [让代码既可以被导入又可以被执行](#让代码既可以被导入又可以被执行)
    - [用下面的方式判断逻辑“真”或“假”](#用下面的方式判断逻辑真或假)
    - [使用 `in` 运算符](#使用-in-运算符)
    - [不使用临时变量交换两个值](#不使用临时变量交换两个值)
    - [用序列构建字符串](#用序列构建字符串)
    - [EAFP 优于 LBYL](#eafp-优于-lbyl)
    - [使用 `enumerate` 进行迭代](#使用-enumerate-进行迭代)
    - [用列表生成器](#用列表生成器)
    - [用 `zip` 组合键和值来创建字典](#用-zip-组合键和值来创建字典)

<!-- /TOC -->

# Python 一些习惯

## 让代码既可以被导入又可以被执行

```py
if __name__ == '__main__':
```

## 用下面的方式判断逻辑“真”或“假”

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

## 使用 `in` 运算符

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

## 不使用临时变量交换两个值

```py
a, b = b, a
```

## 用序列构建字符串

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

## EAFP 优于 LBYL

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

## 使用 `enumerate` 进行迭代

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

## 用列表生成器

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

## 用 `zip` 组合键和值来创建字典

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