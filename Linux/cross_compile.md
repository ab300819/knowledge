# CMake 跨平台编译

```cmake
# this one is important
SET(CMAKE_SYSTEM_NAME Linux)
#this one not so much
SET(CMAKE_SYSTEM_VERSION 1)

# specify the cross compiler
SET(CMAKE_C_COMPILER arm-linux-gnueabihf-gcc-6)
SET(CMAKE_CXX_COMPILER arm-linux-gnueabihf-cpp-6)

# where is the target environment
SET(CMAKE_FIND_ROOT_PATH  /opt/eldk-2007-01-19/ppc_74xx /home/alex/eldk-ppc74xx-inst)

# search for programs in the build host directories
SET(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
# for libraries and headers in the target directories
SET(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
SET(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
```

`-DCMAKE_TOOLCHAIN_FILE=./toolChain.cmake`

[官方Wiki](https://gitlab.kitware.com/cmake/community/wikis/doc/cmake/CrossCompiling)
[官方Help](https://cmake.org/cmake/help/v3.6/manual/cmake-toolchains.7.html)

[参考](https://www.cnblogs.com/rickyk/p/3875334.html)