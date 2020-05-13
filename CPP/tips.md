# C++ 构建、编译过程中遇到的问题及解决

> C++ 编译、一些库的编译和项目中会遇到的问题

## cmake 使用 vcpkg

```shell
-DCMAKE_TOOLCHAIN_FILE=D:/Source/vcpkg/scripts/buildsystems/vcpkg.cmake
```

## cmake 生成 debug 库，后缀加 d

```shell
Name: CMAKE_DEBUG_POSTFIX
Type: STRING
Value: d
```

## QT 加速编译

编译预处理文件,可以包含所用到的所有 Qt 头文件

```shell
PRECOMPILED_HEADER = stable.h
```

指定 `/mp` 编译选项，编译器将使用并行编译

```shell
QMAKE_CXXFLAGS += /MP
```

## CMake 查找库目录

For find_package to be successful, CMake must find the Qt installation in one of the following ways:

1. Set your CMAKE_PREFIX_PATH environment variable to the Qt 5 installation prefix. This is the recommended way.
2. Set the Qt5_DIR in the CMake cache to the location of the Qt5Config.cmake file.

## CMake 生成 clangd 使用的编译参数

```shell
cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=1
```
