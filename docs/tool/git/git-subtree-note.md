# git subtree 使用

## 主要命令

```bash
git subtree add   --prefix=<prefix> <commit>
git subtree add   --prefix=<prefix> <repository> <ref>
git subtree pull  --prefix=<prefix> <repository> <ref>
git subtree push  --prefix=<prefix> <repository> <ref>
git subtree merge --prefix=<prefix> <commit>
git subtree split --prefix=<prefix> [OPTIONS] [<commit>]
```

## 使用 split 分割子项目

将项目某个目录作为子项目进行分割，指定分支将会创建新分支并将该目录的提交从以前提交记录剥离出来，如果不指定分支名，使用目录名作为分支名。

```bash
git subtree split -P <path/to/dir> -b <subModel>
```

将子目录 subModel 提交，推送到远程 RemoteA 仓库的 master 分支。

```bash
git subtree push -P <subModel> <RemoteA> master
```

或者本地创建一个新仓库

```bash
mkdir <NewRepo>
cd <NewRepo>
git init
git pull <OriginRepo> <subModel>
```

## 在父仓库添加子仓库

将远程 RemoteA 仓库的 master 分支，作为项目的子模块，位于 subModel 下。

```bash
git subtree add --prefix=<subModel> <RemoteA> master --squash
```

`--squash` 不拉取历史信息，只生成一条 commit 信息

拉取更新

```bash
git subtree pull --prefix=<subModel> <RemoteA> master --squash
```

推送更新

```bash
git subtree push --prefix=<subModel> <RemoteA> master
```

## 简化操作

将子仓库的地址作为一个 remote

```bash
git remote add -f <subModel> <RemoteA>

# 添加子仓库
git subtree add --prefix=<subDir> <subModel> master --squash
# 拉取
git subtree pull --prefix=<subDir> <subModel> master --squash
# 推送
git subtree push --prefix=<subDir> <subModel> master
```
