const vscode = require('vscode')
const generateChapter = require('./chapter')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
	console.log('Congratulations, your extension "zero-reader" is now active!')

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
				const filePath = files[0].fsPath
				try {
					generateChapter(filePath)
				} catch (e) {
					console.log('创建目录失败:', e)
					vscode.window.showErrorMessage('创建目录失败:', e)
				}
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
