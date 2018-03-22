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