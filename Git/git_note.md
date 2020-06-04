<!-- TOC -->

- [git 常用命令](#git-常用命令)
    - [配置](#配置)
    - [新建代码库](#新建代码库)
    - [增加/删除文件](#增加删除文件)
    - [代码提交](#代码提交)
    - [补丁](#补丁)
        - [diff 方式](#diff-方式)
        - [patch 方式](#patch-方式)
        - [应用 diff 或 patch](#应用-diff-或-patch)
        - [解决冲突](#解决冲突)
    - [分支](#分支)
    - [标签](#标签)
    - [查看信息](#查看信息)
    - [远程同步](#远程同步)
    - [撤销更改](#撤销更改)
    - [丢弃本地更改](#丢弃本地更改)
        - [变更还未从工作区加入到暂存区](#变更还未从工作区加入到暂存区)
        - [已经加到暂存区](#已经加到暂存区)
        - [已经提交](#已经提交)
    - [删除未追踪文件/文件夹](#删除未追踪文件文件夹)
    - [其他](#其他)
        - [生成一个可供发布的压缩包](#生成一个可供发布的压缩包)
        - [以远程分支为基础创建本地分支](#以远程分支为基础创建本地分支)

<!-- /TOC -->

# git 常用命令

## 配置

git 的设置文件为 **.gitconfig**，它可以在用户主目录下（全局配置），也可以在项目目录下（项目配置）。

显示当前的 git 配置

```shell
git config --list
```

编辑 git 配置文件

```shell
git config -e [--global]
```

设置提交代码时的用户信息

```shell
git config [--global] user.name "[name]"
git config [--global] user.email "[email address]"
```

## 新建代码库

当前目录新建一个 Git 代码库

```shell
git init [repo]
```

新建一个目录，将其初始化为 Git 代码库

```shell
git init [repo]
```

克隆一个项目和它的整个代码历史

```shell
git clone [url]
```

初始化一个裸仓库

```shell
git init --bare [repo]
```

克隆一个裸仓库

```shell
git clone --bare [repo] [directory.git]
git clone --mirror [repo] [directory.git]
```

`--mirror` 与 `--bare` 区别在于，`--mirror` 对远程进行追踪，可以在裸版本库中使用 `git fecth` 和 `git remote update` 命令,和上游版本库进行持续同步。

## 增加/删除文件

添加指定文件到暂存区

```shell
git add [file1] [file2] ...
```

添加指定目录到暂存区，包括子目录

```shell
git add [dir]
```

添加当前目录的所有文件到暂存区

```shell
git add .
```

添加每个修改前，都会要求确认，对于同一个文件的多处修改，可以实现分次提交

```shell
git add -p
```

删除工作区文件，并且将这次删除放入暂存区

```shell
git rm [file1] [file2] ...
```

停止追踪指定文件，但该文件会保留在工作区

```shell
git rm --cached [file]
```

改名文件，并且将这个改名放入暂存区

```shell
git mv [file-original] [file-renamed]
```

## 代码提交

提交暂存区到仓库

```shell
git commit -m [message]
```

提交暂存区的指定文件到仓库区

```shell
git commit [file1] [file2] ... -m [message]
```

提交工作区自上次 commit 之后的变化，直接到仓库区

```shell
git commit -a
```

提交时显示所有 diff 信息

```shell
git commit -v
```

合并到上次提交或更新上次提交信息

```shell
git commit --amend
```

如果代码没有任何新变化，则用来改写上一次 commit 的提交信息

```shell
git commit --amend -m [message]
```

重做上一次 commit，并包括指定文件的新变化

```shell
git commit --amend [file1] [file2] ...
```

## 补丁

git 提供了两种补丁方案，一种是通过 `git diff` 生成的 `.diff` 文件，第二种是通过 `git format-patch` 生成的 `.patch` 文件。

### diff 方式

指定未提交文件

```shell
git diff Test.java > test.diff
```

根据提交 id

```shell
git diff [commit sha1 id] [commit sha1 id] > [diff文件名]
```

### patch 方式

某次提交（含）之前的几次提交

```shell
git format-patch [commit sha1 id] -n
```

某个提交的 patch

```shell
git format-patch [commit sha1 id] -1
```

某两次提交之间的所有 patch

```shell
git format-patch [commit sha1 id]..[commit sha1 id]
```

### 应用 diff 或 patch

检查 diff/patch 是否能正常打入

```shell
git apply --stat xxx.diff/patch
git apply --check xxx.diff/patch
```

打入补丁

```shell
git apply xxx.diff/patch
# 或
git am xxx.diff/patch
```

### 解决冲突

使用 `--reject` 自动合入不冲突的代码改动，同时保留冲突部分

```shell
git  apply --reject  xxxx.patch
```

解决冲突后

```shell
git am --resolved
# 或
git am --continue
```

如果要跳过这次冲突

```shell
git am --skip
```

也可以回退打入 patch 操作，还原到操作前状态

```shell
git am --abort
```

## 分支

```shell
# 列出所有本地分支
git branch

# 列出所有远程分支
git branch -r

# 列出所有本地分支和远程分支
git branch -a

# 新建一个分支，但依然停留在当前分支
git branch [branch-name]

# 新建一个分支，并切换到该分支
git checkout -b [branch]

# 新建一个分支，指向指定commit
git branch [branch] [commit]

# 新建一个分支，与指定的远程分支建立追踪关系
git branch --track [branch] [remote-branch]

# 切换到指定分支，并更新工作区
git checkout [branch-name]

# 切换到上一个分支
git checkout -

# 建立追踪关系，在现有分支与指定的远程分支之间
git branch --set-upstream [branch] [remote-branch]
git branch -u [remote-branch]

# 合并指定分支到当前分支
git merge [branch]

# 选择一个commit，合并进当前分支
git cherry-pick [commit]

# 删除分支
git branch -d [branch-name]

# 删除远程分支
git push origin --delete [branch-name]
git branch -dr [remote/branch]
```

## 标签

```shell
# 列出所有tag
git tag

# 新建一个tag在当前commit
git tag [tag]

# 新建一个tag在指定commit
git tag [tag] [commit]

# 删除本地tag
git tag -d [tag]

# 删除远程tag
git push origin :refs/tags/[tagName]

# 查看tag信息
git show [tag]

# 提交指定tag
git push [remote] [tag]

# 提交所有tag
git push [remote] --tags

# 新建一个分支，指向某个tag
git checkout -b [branch] [tag]
```

## 查看信息

```shell
# 显示有变更的文件
git status

# 显示当前分支的版本历史
git log

# 显示commit历史，以及每次commit发生变更的文件
git log --stat

# 搜索提交历史，根据关键词
git log -S [keyword]

# 显示某个commit之后的所有变动，每个commit占据一行
git log [tag] HEAD --pretty=format:%s

# 显示某个commit之后的所有变动，其"提交说明"必须符合搜索条件
git log [tag] HEAD --grep feature

# 显示某个文件的版本历史，包括文件改名
git log --follow [file]
git whatchanged [file]

# 显示指定文件相关的每一次diff
git log -p [file]

# 显示过去5次提交
git log -5 --pretty --oneline

# 显示所有提交过的用户，按提交次数排序
git shortlog -sn

# 显示指定文件是什么人在什么时间修改过
git blame [file]

# 显示暂存区和工作区的差异
git diff

# 显示暂存区和上一个commit的差异
git diff --cached [file]

# 显示工作区与当前分支最新commit之间的差异
git diff HEAD

# 显示两次提交之间的差异
git diff [first-branch]...[second-branch]

# 显示今天你写了多少行代码
git diff --shortstat "@{0 day ago}"

# 显示某次提交的元数据和内容变化
git show [commit]

# 显示某次提交发生变化的文件
git show --name-only [commit]

# 显示某次提交时，某个文件的内容
git show [commit]:[filename]

# 显示当前分支的最近几次提交
git reflog
```

## 远程同步

```shell
# 下载远程仓库的所有变动
git fetch [remote]

# 显示所有远程仓库
git remote -v

# 显示某个远程仓库的信息
git remote show [remote]

# 增加一个新的远程仓库，并命名
git remote add [shortname] [url]

# 移除一个仓库
git remote rm [shortname]

# 修改远程地址
git remote set-url [shortname] [url]

# 取回远程仓库的变化，并与本地分支合并
git pull [remote] [branch]

# 上传本地指定分支到远程仓库
git push [remote] [branch]

# 强行推送当前分支到远程仓库，即使有冲突
git push [remote] --force

# 推送所有分支到远程仓库
git push [remote] --all
```

## 撤销更改

```shell
# 恢复暂存区的指定文件到工作区
git checkout [file]

# 恢复某个commit的指定文件到暂存区和工作区
git checkout [commit] [file]

# 恢复暂存区的所有文件到工作区
git checkout .

# 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变
git reset [file]

# 重置暂存区与工作区，与上一次commit保持一致
git reset --hard

# 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变
git reset [commit]

# 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
git reset --hard [commit]

# 重置当前HEAD为指定commit，但保持暂存区和工作区不变
git reset --keep [commit]

# 新建一个commit，用来撤销指定commit
# 后者的所有变化都将被前者抵消，并且应用到当前分支
git revert [commit]

# 暂时将未提交的变化移除，稍后再移入
git stash
git stash pop
```

## 丢弃本地更改

### 变更还未从工作区加入到暂存区

```shell
git checkout -- rainbow.txt start.txt
git checkout -- *.txt
git checkout -- *
```

### 已经加到暂存区

```shell
git reset HEAD rainbow.txt start.txt
git reset HEAD  *
git reset HEAD *.txt
```

### 已经提交

```shell
# 回退到上一个版本
git reset --hard HEAD^

# 回退到上上次版本
git reset --hard HEAD^^
git reset --hard HEAD^^^

#回退到指定 commitid 的版本
git reset --hard [commit_id]
```

## 删除未追踪文件/文件夹

删除文件

```shell
git clean -f
```

删除文件和文件夹

```shell
git clean -fd
```

连同 gitignore 忽略文件/文件夹一起删除

```shell
git clean -xfd
```

> **慎用**

查看可能会删除的文件

```shell
git clean -nxfd
git clean -nf
git clean -nfd
```

> 推荐

## 其他

### 生成一个可供发布的压缩包

```shell
git archive
```

### 以远程分支为基础创建本地分支

```shell
git checkout -b bugfix-myContact origin/release
```
