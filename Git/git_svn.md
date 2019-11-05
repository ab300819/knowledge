# git-svn

## 添加远程分支

```shell
git config --add svn-remote.newbranch.url https://svn/path_to_newbranch/
git config --add svn-remote.newbranch.fetch :refs/remotes/newbranch
git svn fetch newbranch [-r<rev>]
git checkout -b local-newbranch -t newbranch
git svn rebase newbranch
```
