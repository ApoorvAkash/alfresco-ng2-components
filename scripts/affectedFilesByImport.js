"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const ts = require("typescript");
function delint(sourceFile, findFiles) {
    let affectedFiles = [];
    delintNode(sourceFile);
    return affectedFiles;
    function delintNode(node) {
        switch (node.kind) {
            case ts.SyntaxKind.ImportSpecifier:
                let importSpecifier = node;
                const fileName = importSpecifier.name.escapedText;
                const found = findFiles.some((file) => file === fileName);
                if (found) {
                    // console.log(`Yeppa ${fileName} found. Run this e2e ${node.getSourceFile().fileName}`);
                    affectedFiles.push(node.getSourceFile().fileName);
                }
                break;
        }
        ts.forEachChild(node, delintNode);
    }
}
exports.delint = delint;
// var list = readdirSync(folder);
// list.forEach(function(file) {
// });
// readdirSync(folder, function (err, files) {
// 	//handling error
// 	if (err) {
// 			return console.log('Unable to scan directory: ' + err);
// 	}
// 	// console.log('Looking for: ' + lookinFor.toString());
// 	let globalAffectedFiles = [];
// 	files.forEach(function (file) {
// 			// console.log('Analyze: ' + file);
// 			// Parse a file
// 			let sourceFile = ts.createSourceFile(
// 				file,
// 			readFileSync(`${folder}/${file}`).toString(),
// 				ts.ScriptTarget.ES2015,
// 				/*setParentNodes */ true
// 			);
// 	// delint it
// 	let affectedFiles = delint(sourceFile, lookinFor);
// 	globalAffectedFiles.push(...new Set(affectedFiles));
// 	});
// 	console.log([...globalAffectedFiles]);
// 	// console.log(globalAffectedFiles.toString());
// });
const walkSync = function (dir, filelist, fileType) {
    var files = fs_1.readdirSync(dir);
    files.forEach(function (file) {
        // console.log(file)
        if (fs_1.statSync(dir + file).isDirectory()) {
            filelist = walkSync(dir + file + '/', filelist, fileType);
        }
        else if (file.endsWith(`.${fileType}.ts`)) {
            filelist.add(dir + file);
        }
    });
    //console.log(globalAffectedFiles.toString());
    return filelist;
};
const params = process.argv.slice(2);
const lookinFor = params[2].split(',');
const folder = params[1];
const type = params[0];
const items = new Set();
walkSync(folder, items, type);
// console.log("List of files to being analize");
// console.log([...items]);
// console.log("End");
let globalAffectedFiles = [];
items.forEach(function (file) {
    // console.log('Analyze: ' + file);
    // Parse a file
    let sourceFile = ts.createSourceFile(file, fs_1.readFileSync(`${file}`).toString(), ts.ScriptTarget.ES2015, 
    /*setParentNodes */ true);
    // delint it
    let affectedFiles = delint(sourceFile, lookinFor);
    globalAffectedFiles.push(...new Set(affectedFiles));
});
// console.log("List of Component that contains the "+ lookinFor);
console.log(globalAffectedFiles.toString());
//# sourceMappingURL=affectedFilesByImport.js.map