const vscode = require('vscode')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
	console.log('Congratulations, your extension "zero-reader" is now active!')

	let disposable = vscode.commands.registerCommand('zero-reader.selectFile', function () {
		vscode.window.showInformationMessage('Hello World from zero-reader!')
	})

	context.subscriptions.push(disposable)
}

function deactivate () { }

module.exports = {
	activate,
	deactivate
}
