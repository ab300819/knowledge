# convert img to vmdk

## check img info

```shell
qemu-img info xxx.img
```

## convert to vmdk

```shell
qemu-img convert -f [格式] xxx.img -O vmdk xxx.vmdk
```
