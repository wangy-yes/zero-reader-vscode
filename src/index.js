const vscode = require('vscode')
const generateChapter = require('./chapter')
const getBook = require('./book')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
	console.log('Congratulations, your extension "zero-reader" is now active!')

	// 添加状态栏按钮
	let bottom = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0)
	bottom.text = "选择文件"
	bottom.command = "zero-reader.selectFile"
	bottom.show()

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
