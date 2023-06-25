const vscode = require('vscode')
const generateChapter = require('./chapter')
const getBook = require('./book')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
	console.log('Congratulations, your extension "zero-reader" is now active!')
	// 如果有缓存书籍路径，下次默认打开该书籍
	const filePath = vscode.workspace.getConfiguration().get("zeroReader.filePath")
	if (filePath) {
		generateChapter(filePath) // 加载目录
		getBook(filePath)// 加载书籍,在控制台显示
	}

	// 添加状态栏按钮
	let bottom = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0)
	bottom.text = "选择文件"
	bottom.command = "zero-reader.selectFile"
	bottom.show()

	// 选择文件后执行命令
	const selectFile = vscode.commands.registerCommand('zero-reader.selectFile', function () {
		vscode.window.showOpenDialog({
			canSelectFolders: false, // 禁止选择文件夹
			canSelectFiles: true, // 可以选择文件
			canSelectMany: false, // 禁止多选
			openLabel: '选择', // 打开按钮文字
			filters: {
				'Text files': ['txt']
			}
		}).then(files => {
			if (files) {
				let filePath = files[0].fsPath
				vscode.workspace.getConfiguration().update("zeroReader.filePath", filePath, true) // 更新文件路径
				try {
					generateChapter(filePath) // 加载目录
				} catch (e) {
					console.log('创建目录失败:', e)
					vscode.window.showErrorMessage('创建目录失败:', e)
				}
				getBook(filePath)// 加载书籍,在控制台显示
			}
		})
	})

	context.subscriptions.push(selectFile)
}

function deactivate () { }

module.exports = {
	activate,
	deactivate
}
