# 一些技巧

## vscode 手动安装 nupkg 插件

- Open Python extension sources folder in VS Code (there is `Open Extensions Folder` command)
- Open Python extension folder
- Create `languageServer` folder in the extension folder.
- Rename `.nupkg` to `.zip`
- Unzip contents with folders to `languageServer`
- in `languageServer` excute `chmod +x Microsoft.Python.LanguageServer`
- In VS Code set setting `python.downloadLanguageServer` to false.
- In VS Code set setting `python.jediEnabled` to false.

## `xcode-select` 切换开发工具目录

使用 `xcode-select -p` 查看当前工具位置

更改工具位置

```shell
sudo xcode-select -s /Library/Developer/CommandLineTools
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```
