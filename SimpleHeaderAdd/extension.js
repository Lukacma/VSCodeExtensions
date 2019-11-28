// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
var path = require("path");
const fs = require('fs');


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide   the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.addHeaders', AddHeader);

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

function AddHeader() {
	var hppPath;
	var cppPath = vscode.window.activeTextEditor.document.fileName;
	var cppName = path.basename(cppPath);
	if (/.*\.cpp/.test(cppName)) {
		if (/src\//.test(cppPath)) { hppPath = cppPath.replace(/src\/.*/, 'inc/' + cppName.replace(/\.cpp/, '.hpp')); }
		else { hppPath = cppPath.replace(cppName, cppName.replace(/\.cpp/, '.hpp')); }
		fs.appendFileSync(hppPath, '', 'utf8');
		var openPath = vscode.Uri.file(hppPath); //A request file path

		vscode.workspace.openTextDocument(openPath).then(doc => {
			vscode.window.showTextDocument(doc);
		});
	}
	else {
		vscode.window.showErrorMessage("Requires cpp file");
	}
}

module.exports = {
	activate,
	deactivate
}
