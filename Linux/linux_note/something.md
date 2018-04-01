### #验证文件正确性

```
[root@study ~]# md5sum/sha1sum/sha256sum [-bct] filename
[root@study ~]# md5sum/sha1sum/sha256sum [--status|--warn] --check filename
選項與參數：
-b ：使用 binary 的讀檔方式，預設為 Windows/DOS 檔案型態的讀取方式；
-c ：檢驗檔案指紋；
-t ：以文字型態來讀取檔案指紋。

範例一：將剛剛的檔案下載後，測試看看指紋碼
[root@study ~]# md5sum ntp-4.2.8p3.tar.gz
b98b0cbb72f6df04608e1dd5f313808b  ntp-4.2.8p3.tar.gz
# 看！顯示的編碼是否與上面相同呢？趕緊測試看看！
```

### #动态库解析

```
[root@study ~]# ldd [-vdr] [filename]
選項與參數：
-v ：列出所有內容資訊；
-d ：重新將資料有遺失的 link 點秀出來！
-r ：將 ELF 有關的錯誤內容秀出來！

範例一：找出 /usr/bin/passwd 這個檔案的函式庫資料
[root@study ~]# ldd /usr/bin/passwd
....(前面省略)....
        libpam.so.0 => /lib64/libpam.so.0 (0x00007f5e683dd000)            <==PAM 模組
        libpam_misc.so.0 => /lib64/libpam_misc.so.0 (0x00007f5e681d8000)
        libaudit.so.1 => /lib64/libaudit.so.1 (0x00007f5e67fb1000)        <==SELinux
        libselinux.so.1 => /lib64/libselinux.so.1 (0x00007f5e67d8c000)    <==SELinux
....(底下省略)....
# 我們前言的部分不是一直提到 passwd 有使用到 pam 的模組嗎！怎麼知道？
# 利用 ldd 察看一下這個檔案，看到 libpam.so 了吧？這就是 pam 提供的函式庫

範例二：找出 /lib64/libc.so.6 這個函式的相關其他函式庫！
[root@study ~]# ldd -v /lib64/libc.so.6
        /lib64/ld-linux-x86-64.so.2 (0x00007f7acc68f000)
        linux-vdso.so.1 =>  (0x00007fffa975b000)

        Version information:  <==使用 -v 選項，增加顯示其他版本資訊！
        /lib64/libc.so.6:
                ld-linux-x86-64.so.2 (GLIBC_2.3) => /lib64/ld-linux-x86-64.so.2
                ld-linux-x86-64.so.2 (GLIBC_PRIVATE) => /lib64/ld-linux-x86-64.so.2
```

### #`ldconfig` 与 **/etc/ld.so.conf*

```
[root@study ~]# ldconfig [-f conf] [ -C cache]
[root@study ~]# ldconfig [-p]
選項與參數：
-f conf ：那個 conf 指的是某個檔案名稱，也就是說，使用 conf 作為 libarary 
	  函式庫的取得路徑，而不以 /etc/ld.so.conf 為預設值
-C cache：那個 cache 指的是某個檔案名稱，也就是說，使用 cache 作為快取暫存
	  的函式庫資料，而不以 /etc/ld.so.cache 為預設值
-p	：列出目前有的所有函式庫資料內容 (在 /etc/ld.so.cache 內的資料！)

範例一：假設我的 Mariadb 資料庫函式庫在 /usr/lib64/mysql 當中，如何讀進 cache ？
[root@study ~]# vim /etc/ld.so.conf.d/vbird.conf
/usr/lib64/mysql   <==這一行新增的啦！

[root@study ~]# ldconfig  <==畫面上不會顯示任何的資訊，不要太緊張！正常的！

[root@study ~]# ldconfig -p
924 libs found in cache `/etc/ld.so.cache'
        p11-kit-trust.so (libc6,x86-64) => /lib64/p11-kit-trust.so
        libzapojit-0.0.so.0 (libc6,x86-64) => /lib64/libzapojit-0.0.so.0
....(底下省略)....
#       函式庫名稱 => 該函式庫實際路徑
```