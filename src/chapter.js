const vscode = require('vscode')
const fs = require('fs')

// 构造目录单项并添加命令
class Chapter extends vscode.TreeItem {
  constructor(args) {
    // 第一个参数为显示的label，第二个参数控制树形是否折叠
    super(args.title, vscode.TreeItemCollapsibleState.None)
    this.command = {
      command: 'zero-reader.jumpChapter',
      title: 'Jump Chapter 跳转章节',
      arguments: [args]
    }
  }
}
// 构造目录
class ChapterList {
  constructor(chapters) {
    this.chapters = chapters
  }
  getTreeItem (element) {
    return element
  }
  getChildren (element) {
    if (element) {
      return Promise.resolve([])
    } else {
      if (!this.chapters) return Promise.resolve([])
      return this.chapters.map(i => new Chapter(i))// 你可以按你的需求增加更多章节
    }
  }
}

// 根据路径创建目录
function generateChapter (filePath) {
  let chapterData = generateChaptersFromTextFile(filePath) // 获取目录
  let chapterList = new ChapterList(chapterData)
  vscode.window.registerTreeDataProvider("chapters", chapterList)// 渲染目录
}
// 根据路径获取目录
function generateChaptersFromTextFile (filePath) {
  if (!filePath) {
    return []
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const lines = fileContent.split('\n')
  const chapters = []
  let currentChapter = null
  lines.forEach((item, index) => {
    const line = item.trim()
    let reg = /^([^Pp]|)+第(.{1,9})[章节卷集部篇回](.*)/  //不以p开头（PS:）,匹配第几章节
    if (reg.test(line)) {
      let title = line.substring(line.indexOf('第')).replace(/===/g, '')
      currentChapter = {
        title,
        startLine: index + 1, // 行号从 1 开始计数
      }
      chapters.push(currentChapter)
    }
    // 如果已经有当前章节，并且该行不为空，则认为是章节的内容行
    if (currentChapter && line.length > 0) {
      currentChapter['endLine'] = index + 1 // 记录章节结束行号（循环更新结束行，直到下次匹配到currentChapter，更新下一个）
    }
  })
  vscode.window.showInformationMessage('目录导入成功！')
  return chapters
}

module.exports = generateChapter