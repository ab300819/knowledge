# jupyter 

## 安装

1. 安装
```
pip install jupyter
```

2. Kernels for Python 2 and 3  
If you’re running Jupyter on Python 3, you can set up a Python 2 kernel like this:
```
python2 -m pip install ipykernel
python2 -m ipykernel install --user
```

> If you’re running Jupyter on Python 2 and want to set up a Python 3 kernel, follow the same steps, replacing `2` with `3`

[Installing the IPython kernel](https://ipython.readthedocs.io/en/latest/install/kernel_install.html)

3. 生成配置文件  
`jupyter notebook --generate-config`

4. 切换工作目录  
`c.NotebookApp.notebook_dir = ''`

5. 远程访问
* 生成密码
```python
from notebook.auth import passwd
passwd()
```

* 修改默认配置文件
```python
c.NotebookApp.ip='*'
c.NotebookApp.password = 'sha:ce...刚才复制的那个密文'
c.NotebookApp.open_browser = False
c.NotebookApp.port = 8888 #随便指定一个端口
```

6. 命令行配置访问
```
jupyter notebook 
jupyter notebook --no-browser
jupyter notebook --port 9999
jupyter notebook --help
jupyter notebook --ip=0.0.0.0 #外部访问

#常用：jupyter notebook --no-browser --port 5000 --ip=0.0.0.0 
```

## 安装扩展



## 设置主题

安装 `jupyterthemes`

```shell
pip install jupyterthemes
conda install jupyterthemes
```

参数    |   说明    |   例子
--- |   --- |   ---
-t  |   主题选项    |   -t chesterish
-l  |   查看可用主题   |	
-f  |   字体选项   |   -f consolamono
-fs |   字体大小   |   -fs 12
-nf |   notebook的字体选项 |   -nf code
-nfs    |   notebook的字体大小  |   -nfs 10
-dfs    |   pandas 数据库的字体大小 |   -dfs 9
-ofs    |   输出文本的字体大小  |   -ofs 9
-r  |   重置默认主题    |
-dfonts |   重置默认字体    |

```shell
jt -t solarizedd -T -N -kl
```

* 可见工具栏 `-T`
* 名称和徽标可见 `-N`
* 内核徽标可见 `-kl`
* 它们的默认设置为无

notebook 中使用，命令前加 `%system`
