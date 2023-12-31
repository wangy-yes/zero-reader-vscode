# Vscode插件开发
## 创建插件
``` bash
// 安装需要的包
npm install -g yo generator-code
// 运行
yo code 
```
## 配置说明
```json
{
  "name": "zero-reader", // 插件名
  "displayName": "zero-reader", // 显示在应用市场的名字
  "description": "read in console.", // 具体描述
  "version": "0.0.1", // 插件的版本号
  "engines": {
    "vscode": "^1.79.0" // 最低支持的vscode版本,打包时不能低于自己当前版本，否则打包会报错
  },
  "categories": [
    "Other" // 扩展类别
  ],
  // 激活事件组，在那些事件情况下插件被激活
  "activationEvents": [],
  "main": "./src/index.js", // 插件的主入口文件
  // 各种附加配置
  "contributes": {
    // 命令，ctrl+shift+p后选择对应title可以执行对应command
    "commands": [
      {
        "command": "zero-reader.selectFile",
        "title": "Zero-Reader:选择文件"
      }
    ]
  },
  // 脚本代码
  "scripts": {
    "lint": "eslint .",
    "pretest": "yarn run lint",
    "test": "node ./test/runTest.js"
  },
  // 开发依赖
  "devDependencies": {
    "@types/vscode": "^1.79.0",
    "@types/glob": "^8.1.0",
    "@types/mocha": "^10.0.1",
    "@types/node": "20.2.5",
    "eslint": "^8.41.0",
    "glob": "^8.1.0",
    "mocha": "^10.2.0",
    "typescript": "^5.1.3",
    "@vscode/test-electron": "^2.3.2"
  }
}
```

### 激活时机——activationEvents
- onLanguage 打开解析为特定语言文件时被激活，例如"onLanguage:python"
- onCommand 在调用命令时被激活
- onDebug 在启动调试话之前被激活
- onDebugInitialConfigurations
- onDebugResolve
- workspaceContains 每当打开文件夹并且该文件夹包含至少一个与 glob 模式匹配的文件时
- onFileSystem 每当读取来自特定方案的文件或文件夹时
- onView 每当在 VS Code 侧栏中展开指定 id 的视图
- onUri 每当打开该扩展的系统范围的 Uri 时
- onWebviewPanel
- onCustomEditor
- onAuthenticationRequest
- onStartupFinished只要一启动vscode，插件就会被激活

### contributes
- breakpoints 断点
- colors 主题颜色
- commands 命令
- configuration 配置
- configurationDefaults 默认的特定于语言的编辑器配置
- customEditors 自定义编辑器
- debuggers
- grammars
- iconThemes
- jsonValidation
- keybindings 快捷键绑定
- languages
- menus
- problemMatchers
- problemPatterns
- productIconThemes
- resourceLabelFormatters
- snippets 特定语言的片段
- submenus
- taskDefinitions
- themes 颜色主题
- typescriptServerPlugins
- views
- viewsContainers
- viewsWelcome
- walkthroughs

## 打包
使用 vsce 打包
```bash
npm  i vsce -g
vsce package
```
运行后会在根目录生成 .vsix 文件
package.json必须包含发布者信息添加 "publisher": "Wangyes"
插件在扩展中显示的图片，不能使用SVG, "icon": "images/zero.png",
README 文件需要进行修改，第一行不做修改会报错不让打包
插件打包会提示添加 LICENSE 文件，可忽略，我添加的MIT LICENSE
## 发布
发布在 vscode 扩展市场需要 visualstudio 发布者账号
- 创建发布者账号 https://marketplace.visualstudio.com/manage (老版命令 vsce create-publisher your-publisher-name 已经无法创建)
- 然后可以直接将打包好的 vsix 文件拖入进行发布，发布完成后 version 会变成绿色的对钩，或者使用 vsce 命令进行发布
- 使用 vsce 命令需要确保有你已经有微软账号，没有的话先注册一个 https://login.live.com/
- 然后访问 AzureDevOps , https://aka.ms/SignupAzureDevOps，同样登录后需要先创建一个项目
- 然后在 AzureDevOps 右上角 user setting ,打开 Personal access tokens ,创建一个 token
- 创建 token 时Organization要选择all accessible organizations，Scopes要选择Full access,否则后面会发布失败
- 创建好token复制保存网站不会自动保存
- 先使用命令 vsce login username (填写你创建的用户名这里需要与 package.json 中保持一致),这里会提示输入 token
- 登录成功后使用 vsce publish 可以进行发布
- 如果想让版本号自增，可以使用增量发布 vsce publish patch
- 取消发布 vsce unpublish (publisher name).(extension name)
- 

## 拓展
### 设置侧边栏视图
1.在 contributes 中设置容器
```js
// 视图容器
"viewsContainers": {
  "activitybar": [
    {
      "id": "ZeroSidebar",
      "title": "zero-reader",
      "icon": "images/zero.svg" // 图标选择svg文件
    }
  ]
},
// 对应上面容器创建tab
"views": {
  "ZeroSidebar": [
    {
      "id": "chapters",
      "name": "目录"
    }
  ]
}
```
2.设置触发事件为打开侧边视图时触发activate事件（activate事件只会触发一次）
```js
"activationEvents": [
  "onView:ZeroSidebar" // 对应视图id
],
```
3.创建 TreeView
```js
// 定义目录单项并添加命令
class Chapter extends vscode.TreeItem {
  constructor(args) {
    super(args.title, vscode.TreeItemCollapsibleState.None)//不折叠
    this.command = {
      command: 'zero-reader.jumpChapter',
      title: 'Jump Chapter 跳转章节',
      arguments: [args]
    }
  }
}
// 定义目录
class ChapterList {
  constructor(chapters) {
    this.chapters = chapters
  }
  // 当前ui展示项
  getTreeItem (element) {
    return element
  }
  // 当折叠项打开时执行的函数
  getChildren (element) {
    if (element) {
      return Promise.resolve([])
    } else {
      return this.chapters.map(i => new Chapter(i))
    }
  }
}
// 创建树形视图
let chapterList = new ChapterList(chapterData)
vscode.window.registerTreeDataProvider("chapters", chapterList)
```

### 创建终端
```js
const term = vscode.window.createTerminal('cd')
term.show() // 显示终端
term.sendText(`cd ${filePath}`) // 执行指令
```
### 创建输出
```js
let outputChannel = vscode.window.createOutputChannel('Reader')
  outputChannel.clear() // 清空输出控制台
  outputChannel.append(data) // 添加文本
  outputChannel.appendLine(data) // 添加换行文本
  outputChannel.show() // 打开输出控制台
  outputChannel.dispose() // 销毁输出控制台
```
### 进度条
```js
const progress = (args, fn) => {
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: "载入xxxx的进度...",
    cancellable: true
  }, (progress) => {
    progress.report({ increment: 50, message: "正在加载目录..." }) //increment:进度，message：提示文本
    return new Promise(async resolve => {
      await fn(args)
      resolve()
    })
  })
}
```
### 文件状态
可获取文件大小&创建修改时间
```js
fs.stat(filePath, (err, stats) => {
  console.log(stats, 'stats')
})

atime:Wed Jun 21 2023 16:42:28 GMT+0800 (香港标准时间)
atimeMs:1687336948312.8538
birthtime:Wed Jun 21 2023 15:07:03 GMT+0800 (香港标准时间)
birthtimeMs:1687331223561.081
blksize:4096
blocks:0
ctime:Wed Jun 21 2023 15:07:22 GMT+0800 (香港标准时间)
ctimeMs:1687331242769.1758
dev:1456229637
gid:0
ino:2251799815833726
mode:33206
mtime:Wed Jun 21 2023 15:07:22 GMT+0800 (香港标准时间)
mtimeMs:1687331242769.1758
nlink:1
rdev:0
size:38

```

### 底部状态栏 statusbar
```js
// 创建底部状态栏消息，第一个参数为显示名，第二个参数为持续时间
const bar = vscode.window.setStatusBarMessage('目录导入成功！', 1000) 
bar.dispose() // 销毁
bar.hide() // 隐藏

// 状态栏按钮，第一个参数为布局左右，第二个参数为定位层级
let bottom = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0)
bottom.text = "选择文件" // 添加label
bottom.command = "extension.selectFile" // 注册事件命令
bottom.show() // 展示
```

### 缓存
在 package.json 的 contributes 中设置插件配置以编辑书籍路径并实现缓存
```json
"configuration": {
  "title": "Zero-Reader",
  "type": "object",
  "properties": {
    "bookReader.filePath": {
      "type": "string",
      "default": "",
      "description": "本地书籍路径"
    }
  }
}
```
获取配置
```js
vscode.workspace.getConfiguration().get("zeroReader.filePath")
```
更新配置
```js
vscode.workspace.getConfiguration().update("zeroReader.filePath", filePath, true)
```

### 快捷键
在 package.json 的 contributes 中设置快捷键
```json
"keybindings": [
  {
    "command": "extension.selectFile",
    "key": "ctrl+m",
    "mac": "cmd+m",
    "when": "textInputFocus"
  }
]
```