const vscode = require('vscode')
const fs = require('fs')
const generateChapter = require('./chapter')

let outputChannel = null
let bookData = null
let fileName = null

const getBook = (filePath) => {
  // 根据path获取文件名
  const nameIndex = filePath.lastIndexOf('\\')
  fileName = filePath.substr(nameIndex + 1)
  const typeIndex = fileName.lastIndexOf('.')
  fileName = fileName.slice(0, typeIndex)

  // 获取文件内容
  let data = fs.readFileSync(filePath, "utf-8")
  data = data
    .toString()
    .replace(/　　/g, " ")
    .replace(/  /g, " ")
    .replace(/\r\n|\n\r/g, "\r")
    .replace(/\r\r/g, "\r")
    .replace(/\n\n/g, '\n')
  bookData = data // 缓存书籍数据

  // 控制台显示
  if (outputChannel) {
    outputChannel.dispose()
  }
  outputChannel = vscode.window.createOutputChannel(fileName)
  outputChannel.append(data)//文本
  outputChannel.show()
}

// 根据 keyword 截取书籍章节内容
const jumpChapter = (/** @type {string} */ keyword) => {
  let keyIndex = bookData.indexOf(keyword)
  let chapterBookData
  if (keyIndex >= 0) {
    chapterBookData = bookData.substring(keyIndex)
  } else {
    chapterBookData = '未找到该章节'
    vscode.window.showErrorMessage("Chapter not found")
  }
  // 清空后重新输出新内容
  outputChannel.clear()
  outputChannel.append(chapterBookData) // 文本
  outputChannel.show()
}

// 注册点击目录章节跳转命令
vscode.commands.registerCommand('zero-reader.jumpChapter', args => {
  // console.log(args, 'args') // {title,startLine,endLine}
  // 输入章节标题作为 keyword 进行跳转
  jumpChapter(args.title)
})

// 快捷隐藏按钮
let flag = true
vscode.commands.registerCommand('zero-reader.bossCode', () => {
  if (outputChannel) {
    if (flag) {
      outputChannel.dispose()
      generateChapter('')
    } else {
      const filePath = vscode.workspace.getConfiguration().get("zeroReader.filePath")
      getBook(filePath)
      generateChapter(filePath)
    }
    flag = !flag
  }
})

module.exports = getBook