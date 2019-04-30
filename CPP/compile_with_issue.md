# C++ 构建、编译过程中遇到的问题及解决

> C++ 编译、一些库的编译和项目中会遇到的问题

## cmake 使用 vcpkg

```
-DCMAKE_TOOLCHAIN_FILE=D:/Source/vcpkg/scripts/buildsystems/vcpkg.cmake
```

## cmake 生成 debug 库，后缀加 d

```
Name: CMAKE_DEBUG_POSTFIX
Type: STRING
Value: d
```

## QT 加速编译

编译预处理文件,可以包含所用到的所有 Qt 头文件

```
PRECOMPILED_HEADER = stable.h
```

指定 `/mp` 编译选项，编译器将使用并行编译

```
QMAKE_CXXFLAGS += /MP
```