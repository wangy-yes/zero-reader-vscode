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

## 发布
使用 vsce 打包发布
```bash
npm  i vsce -g
vsce package
```
运行后会在根目录生成 .vsix 文件
package.json必须包含发布者信息添加 "publisher": "Wangyes"

## 拓展
### 设置侧边栏视图
在contributes中设置
```js
// 视图容器
"viewsContainers": {
  "activitybar": [
    {
      "id": "ZeroSidebar",
      "title": "zero-reader",
      "icon": "images/zero.svg"
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