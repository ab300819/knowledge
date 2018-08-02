# CMake 跨平台编译

## 设置工具链

CMake给交叉编译预留了一个很好的变量即 `CMAKE_TOOLCHAIN_FILE`，它定义了一个文件的路径，这个文件即 toolChain， 里面 `set` 了一系列你需要改变的变量和属性，包括 `C_COMPILER,CXX_COMPILER`，如果用 Qt 的话需要更改 `QT_QMAKE_EXECUTABLE` 以及如果用 BOOST 的话需要更改的 `BOOST_ROOT` (具体查看相关`Findxxx.cmake` 里面指定的路径)。CMake为了不让用户每次交叉编译都要重新输入这些命令，因此它带来 toolChain 机制，简而言之就是一个 CMake 脚本，内嵌了你需要改变以及需要 `set` 的所有交叉环境的设置。

1. `CMAKE_SYSTEM_NAME`: 即你目标机 `target` 所在的操作系统名称，比如 ARM 或者 Linux 你就需要写 `Linux`，如果 Windows 平台你就写 `Windows`，如果你的嵌入式平台没有相关 OS 你即需要写成 `Generic`，只有当 `CMAKE_SYSTEM_NAME` 这个变量被设置了，CMake 才认为此时正在交叉编译，它会额外设置一个变量 `CMAKE_CROSSCOMPILING` 为 `TRUE`。

2. `CMAKE_C_COMPILER`: 即 C 语言编译器，这里可以将变量设置成完整路径或者文件名，设置成完整路径有一个好处就是 CMake 会去这个路径下去寻找编译相关的其他工具比如 linker ，binutils 等，如果你写的文件名带有 arm-elf 等等前缀，CMake会识别到并且去寻找相关的交叉编译器。

3. `CMAKE_CXX_COMPILER`: 同上，此时代表的是 C++ 编译器。

4. `CMAKE_FIND_ROOT_PATH`: 代表了一系列的相关文件夹路径的根路径的变更，比如你设置了 `/opt/arm/` ，所有的 `Find_xxx.cmake` 都会优先根据这个路径下的 `/usr/lib`，`/lib` 等进行查找，然后才会去你自己的 `/usr/lib` 和 `/lib` 进行查找，如果你有一些库是不被包含在 `/opt/arm` 里面的，你也可以显示指定多个值给`CMAKE_FIND_ROOT_PATH` ,比如 `set(CMAKE_FIND_ROOT_PATH /opt/arm /opt/inst)` 。

5. `CMAKE_FIND_ROOT_PATH_MODE_PROGRAM`: 对 `FIND_PROGRAM()` 起作用，有三种取值，`NEVER`，`ONLY`，`BOTH`，第一个表示不在 `CMAKE_FIND_ROOT_PATH` 下进行查找，第二个表示只在这个路径下查找，第三个表示先查找这个路径，再查找全局路径，对于这个变量来说，一般都是调用宿主机的程序，所以一般都设置成 `NEVER` 。

6. `CMAKE_FIND_ROOT_PATH_MODE_LIBRARY`: 对 `FIND_LIBRARY()` 起作用，表示在链接的时候的库的相关选项，因此这里需要设置成ONLY来保证我们的库是在交叉环境中找的。

7. `CMAKE_FIND_ROOT_PATH_MODE_INCLUDE`: 对 `FIND_PATH()` 和 `FIND_FILE()` 起作用，一般来说也是 `ONLY` ，如果你想改变，一般也是在相关的 `FIND` 命令中增加 `option` 来改变局部设置，有 `NO_CMAKE_FIND_ROOT_PATH` ，`ONLY_CMAKE_FIND_ROOT_PATH,BOTH_CMAKE_FIND_ROOT_PATH` 。

8. `BOOST_ROOT`：对于需要 boost 库的用户来说，相关的 boost 库路径配置也需要设置，因此这里的路径即 ARM 下的 boost 路径，里面有 include 和 lib 。

9. `QT_QMAKE_EXECUTABLE`: 对于 Qt 用户来说，需要更改相关的 qmake 命令切换成嵌入式版本，因此这里需要指定成相应的 qmake 路径（指定到 qmake 本身）。

```cmake
# this one is important
SET(CMAKE_SYSTEM_NAME Linux)
#this one not so much
SET(CMAKE_SYSTEM_VERSION 1)

# specify the cross compiler
SET(CMAKE_C_COMPILER arm-linux-gnueabihf-gcc-6)
SET(CMAKE_CXX_COMPILER arm-linux-gnueabihf-g++-6)

# where is the target environment
# SET(CMAKE_FIND_ROOT_PATH  /opt/eldk-2007-01-19/ppc_74xx /home/alex/eldk-ppc74xx-inst)

# search for programs in the build host directories
SET(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
# for libraries and headers in the target directories
SET(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
SET(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
```

使用 `-DCMAKE_TOOLCHAIN_FILE=./toolChain.cmake`

> [参考](https://www.cnblogs.com/rickyk/p/3875334.html) 
> [官方Wiki](https://gitlab.kitware.com/cmake/community/wikis/doc/cmake/CrossCompiling) 
> [官方Help](https://cmake.org/cmake/help/v3.6/manual/cmake-toolchains.7.html)

## `CMakeLists.txt` 添加库注意事项

```cmake
cmake_minimum_required(VERSION 2.8)
project( DisplayImage )
set(OpenCV_DIR /opt/opencv/share/OpenCV)
find_package( OpenCV REQUIRED )
include_directories( ${OpenCV_INCLUDE_DIRS} )
add_executable( DisplayImage test.cpp )
target_link_libraries( DisplayImage ${OpenCV_LIBS} )
```

1. `find_package( OpenCV REQUIRED )` 中 `OpenCV` 一定要遵循大小写，会根据 `OpenCV` 去查找路径 `/usr/local/share/OpenCV`,默认路径前缀 `/usr/local`；
2. 自定义搜索路径 `set(OpenCV_DIR /opt/opencv/share/OpenCV)` 。