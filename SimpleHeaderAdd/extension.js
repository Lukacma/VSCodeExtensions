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

	// The command has been defined in the package.json file
	// Now provide   the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let addHeaders = vscode.commands.registerCommand('extension.addHeaders', AddHeader);
	let IncludeGuards = vscode.commands.registerCommand('extension.addIncludeGuards', addIncludeGuardsCommand);

	context.subscriptions.push(addHeaders);
	context.subscriptions.push(IncludeGuards);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

function AddHeader() {
	var hppPath;
	var cppPath = vscode.window.activeTextEditor.document.fileName;
	var cppName = path.basename(cppPath);
	if (/.*\.cpp/.test(cppName)) {
		//checking for file hierarchy
		if (/src\//.test(cppPath)) { hppPath = cppPath.replace(/src\/.*/, 'inc/' + cppName.replace(/\.cpp/, '.hpp')); }
		else { hppPath = cppPath.replace(cppName, cppName.replace(/\.cpp/, '.hpp')); }
		//creating the header
		let created_new_file = false;
		if (!fs.existsSync(hppPath)) {
			fs.writeFileSync(hppPath, '', 'utf8');
			created_new_file = true;
		}
		var openPath = vscode.Uri.file(hppPath); //A request file path
		//switching to the file
		vscode.workspace.openTextDocument(openPath).then(doc => {
			vscode.window.showTextDocument(doc).then(textEditor => {
				let hppName = path.basename(hppPath).replace(/\..*/, '');
				if (created_new_file) addIncludeGuards(hppName);
			})
		});
	}
	else {
		vscode.window.showErrorMessage("Requires cpp file");
	}
}

function addIncludeGuards(hppName) {
	const textEditor = vscode.window.activeTextEditor;
	//creating the guard
	let headerGuard = "#ifndef " + hppName.toUpperCase() + "_HPP\n";
	headerGuard += "#define " + hppName.toUpperCase() + "_HPP\n";
	headerGuard += "\n#endif";
	let position = textEditor.document.positionAt(30);
	//inserting it into header
	try {
		textEditor.edit((edit) => {
			edit.insert(position, headerGuard);
		}).then((smh) => {
			const editor = vscode.window.activeTextEditor;
			const cur_position = editor.selection.active;

			var newPosition = cur_position.with({ line: 2, character: 0 });
			var newSelection = new vscode.Selection(newPosition, newPosition);
			editor.selection = newSelection;
		});
	}
	catch (error) {
		if (error instanceof Error) {
			vscode.window.showErrorMessage(error.message);
		} else {
			vscode.window.showErrorMessage('Unknown exception occured');
		}

	}
	//moving cursor

}

function addIncludeGuardsCommand() {
	let hppPath = vscode.window.activeTextEditor.document.fileName;
	let hppName = path.basename(hppPath).replace(/\..*/, '');
	addIncludeGuards(hppName);
}

module.exports = {
	activate,
	deactivate
}
