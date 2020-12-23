# JVM 编译记录

## 编译参数

### on windows

```shell
--with-freetype-include=D:/Source/freetype-windows-binaries/include --with-freetype-lib=D:/Source/freetype-windows-binaries/win64 --with-boot-jdk='C:/Program Files/AdoptOpenJDK/jdk-12.0.1.12-hotspot' --disable-warnings-as-errors --with-toolchain-version=2017 --with-target-bits=64 --with-debug-level=slowdebug
```

### on macOS

```shell
./configure --with-target-bits=64 --with-debug-level=slowdebug --disable-warnings-as-errors --enable-ccache

# 备选
--with-freetype-include=/usr/local/Cellar/freetype/2.10.1/include --with-freetype-lib=/usr/local/Cellar/freetype/2.10.1/lib
```
