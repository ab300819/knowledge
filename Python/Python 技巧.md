**#Python 类变量和实例变量** 

```python
class Test:
    var_class = 0  # 类变量

    def __init__(self):
        self.var_instance = 0  # 实例变量
```

* 类变量（class variable）被该类的所有实例可以共享的变量；如果某个实例修改了该变量，这种变化可以被其他实例看到。
* 实例变量（object variable, instance variable）属于实例私有；对实例变量的操作不会影响到其他实例对象。

**#TKinter 事件及绑定**  

事件绑定函数 `bind`  

`窗体对象.bind(事件类型 , 回调函数)`  

事件类型：
* `<Button-1>` : 左键单击
* `<Button-2>` : 中键单击
* `<Button-3>` : 右键单击
* `<KeyPress-A>` : A键被按下，其中的A可以换成其它键位
* `<Control-V>` : CTL 和V键被同时按下，V可以换成其它键位
* `<F1>` : 按下F1,fn系列可以随意换

**#Python 字符串连接**

* 原始的字符串连接方式：`str_1 + str_2`

* 两个字符串用逗号隔开，那么两个字符串将被连接，但是，字符串之间会多出一个空格: `str_1,str_2`  
`'jim','green'='jim green'`

* 只要把两个字符串放在一起，中间有空白或者没有空白，两个字符串自动连接为一个字符串
```python
'Jim''Green' = 'JimGreen'
'Jim'  'Green' = 'JimGreen'
```

* 格式化字符串
```python
'%s, %s' % ('Jim', 'Green') = 'Jim, Green'
```

* 字符串列表连接:`str.join(some_list)`
```python
var_list = ['tom', 'david', 'john']
a = '###'
a.join(var_list) = 'tom###david###john'
```

**#Python 控制台彩色输出**

* 显示格式

```
格式：\033[显示方式;前景色;背景色m
 
说明：
前景色            背景色           颜色
---------------------------------------
30                40              黑色
31                41              红色
32                42              绿色
33                43              黃色
34                44              蓝色
35                45              紫红色
36                46              青蓝色
37                47              白色
显示方式           意义
-------------------------
0                终端默认设置
1                高亮显示
4                使用下划线
5                闪烁
7                反白显示
8                不可见
 
例子：
\033[1;31;40m    <!--1-高亮显示 31-前景色红色  40-背景色黑色-->
\033[0m          <!--采用终端默认设置，即取消颜色设置-->
```

* 例子

```
print('\033[1;31;40m')
print('*' * 50)
print('*HOST:\t', 2002)
print('*URI:\t', 'http://127.0.0.1')
print('*ARGS:\t', 111)
print('*TIME:\t', '22:28')
print('*' * 50)
print('\033[0m')
```