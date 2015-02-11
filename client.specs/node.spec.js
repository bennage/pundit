import { Node } from '../client/Node';

describe('An unflattened tree', () => {

	var flat_tree = [
		{ path: 'file1', type: 'blob', sha: 'a1b2c3d4' },
		{ path: 'folder1', type: 'tree'},
		{ path: 'folder1/fileA', type: 'blob'},
		{ path: 'folder1/fileB', type: 'blob' }
	];

	var tree = Node.unflatten(flat_tree);

	it('has a name for the root node', () => {
		expect(tree.name).toBe('_root_');
	});

	it('has files and folders on the `nodes`', () => {
		expect(tree.nodes.file1.name).toBe('file1');
		expect(tree.nodes.folder1.name).toBe('folder1');
		expect(tree.nodes.folder1.name).toBe('folder1');
	});

	describe('has nodes, and any node', () => {

		it('returns is path', () => {
			var node = tree.nodes.folder1.nodes.fileA;
			expect(node.fullPath).toBe('folder1/fileA');
		});

		it('can provide its children as array, with folders listed before files', () => {
			var children = tree.nodesToArray();

			expect(children[0].name).toBe('folder1');
			expect(children[1].name).toBe('file1');
			expect(children[2]).toBeUndefined();
		});

	});

	describe('has folders, and any folder', () => {

		var folder = tree.nodes.folder1;

		it('is recognized as a folder', () => {
			expect(folder.isFolder).toBeTruthy();
		});

		it('has a falsy value for `blobSha`', () => {
			expect(folder.blobSha).toBeFalsy();
		});
	});

	describe('has files, and any file', () => {

		var file = tree.nodes.file1;

		it('is not recognized as a folder', () => {
			expect(file.isFolder).toBeFalsy();
		});

		it('exposes its sha', () => {
			expect(file.blobSha).toBe('a1b2c3d4');
		});
	});

	describe('when looking up a node by path', () => {

		it('returns `null` when the path is falsy', ()=> {
			var node = tree.lookupFileByPath();
			expect(node).toBeNull();
		});

		it('returns `null` when the path is an empty string', ()=> {
			var node = tree.lookupFileByPath('');
			expect(node).toBeNull();
		});

		it('returns `null` when the path resolves to a folder', ()=> {
			//TODO: is this what we expect?
			var node = tree.lookupFileByPath('folder1');
			expect(node).toBeNull();
		});

		it('returns the file node specified by the path', ()=> {
			var node = tree.lookupFileByPath('file1');
			expect(node).not.toBeNull();
			expect(node.name).toBe('file1');
		});

		it('returns the file node specified by the path, not at the root', ()=> {
			var node = tree.lookupFileByPath('folder1/fileA');
			expect(node).not.toBeNull();
			expect(node.name).toBe('fileA');
		});

	});
});