# Cmake 简单用法

1. 添加头文件目录 `INCLUDE_DIRECTORIES`

```cmake
include_directories(../../../thirdparty/comm/include)
```

2. 添加链接库文件目录 `LINK_DIRECTORIES`

```cmake
link_directories(/home/server/third/lib)
```

3. 查找库所在目录 `FIND_LIBRARY`

```cmake
FIND_LIBRARY(RUNTIME_LIB rt /usr/lib  /usr/local/lib NO_DEFAULT_PATH)
```

4. 添加需要链接的库文件路径 `LINK_LIBRARIES`

```cmake
# 直接是全路径
link_libraries(“/home/server/third/lib/libcommon.a”)
# 下面的例子，只有库名，cmake会自动去所包含的目录搜索
link_libraries(iconv)

# 传入变量
link_libraries(${RUNTIME_LIB})
# 也可以链接多个
link_libraries("/opt/MATLAB/R2012a/bin/glnxa64/libeng.so"　"/opt/MATLAB/R2012a/bin/glnxa64/libmx.so")
```

5. 设置要链接的库文件的名称 `TARGET_LINK_LIBRARIES `

```cmake
# 以下写法都可以： 
target_link_libraries(myProject comm)       # 连接libhello.so库，默认优先链接动态库
target_link_libraries(myProject libcomm.a)  # 显示指定链接静态库
target_link_libraries(myProject libcomm.so) # 显示指定链接动态库

# 再如：
target_link_libraries(myProject libcomm.so)　　#这些库名写法都可以。
target_link_libraries(myProject comm)
target_link_libraries(myProject -lcomm)
```

6. 工程生成目标文件

```cmake
add_executable(demo
        main.cpp
)
```

7. 完整例子

```cmake
cmake_minimum_required(VERSION 3.5.1)
project(apue_exercise C)

set(CMAKE_C_STANDARD 99)

message(STATUS ${CMAKE_SYSTEM_NAME})
if (CMAKE_SYSTEM_NAME MATCHES "Linux")
    set(APUE /home/think/project/apue)
elseif (CMAKE_SYSTEM_NAME MATCHES "Darwin")
    set(APUE /Users/mengshen/Project/apue)
endif ()

include_directories(${APUE}/include)

FIND_LIBRARY(COMM_LIB comm ../../thirdparty/comm/lib NO_DEFAULT_PATH)
FIND_LIBRARY(RUNTIME_LIB rt /usr/lib  /usr/local/lib NO_DEFAULT_PATH)

link_libraries(${COMM_LIB} ${RUNTIME_LIB})

add_library(lib_demo
        cmd.cpp
        global.cpp
        md5.cpp
)

link_libraries(lib_demo)

target_link_libraries(1-3-ls apue)
add_executable(1-3-ls 1-3-ls.c)
```