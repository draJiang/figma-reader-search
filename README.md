# Figma 只读权限搜索工具

![image](https://user-images.githubusercontent.com/38482112/190867791-1f76ab54-2111-4bfb-8ff8-ff7893c3bde8.png)

Figma 暂时没有原生的文档内搜索工具，拥有编辑权限的用户可通过插件实现搜索，但只读权限的用户则无计可施。
此工具支持**只读**权限的用户对设计稿进行文字搜索。

## 使用方法

1. 复制这个链接，添加到书签栏
``` javascript
javascript:(function()%7Bfetch("https://raw.githubusercontent.com/draJiang/figma-reader-search/main/figma_search.js").then((r) %3D> r.text().then((c) %3D> eval(c)))%7D)()
```
![添加到书签栏的示意图](https://user-images.githubusercontent.com/38482112/190867843-898d7dd0-3502-4ac6-acbb-1492954a061c.png)
2. 点击此书签即可打开工具

## 使用场景
- 搜索设计系统
- 搜索修订记录
- 搜索动效需求
- 搜索埋点日志
- ……

## 已知问题

- 需要登录才能使用
