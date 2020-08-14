
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { addListNodes } from 'prosemirror-schema-list'
import { schema } from 'prosemirror-schema-basic'
import { setup } from './setup.js'

importShim.fetch = async (url) => await fetch(url.indexOf('.js') < 0 ? url + '.js' : url)

const mySchema = new Schema({
	nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
	marks: schema.spec.marks
})

window.view = new EditorView(document.querySelector('#editor'), {
	state: EditorState.create({
		doc: DOMParser.fromSchema(mySchema).parse(document.querySelector('#content')),
		plugins: setup({schema: mySchema})
	})
})
