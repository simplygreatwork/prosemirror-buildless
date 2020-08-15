
import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { addListNodes } from 'prosemirror-schema-list'
import { schema as schema_basic} from 'prosemirror-schema-basic'
import { keymap } from "prosemirror-keymap"
import { history } from "prosemirror-history"
import { baseKeymap, toggleMark, setBlockType, wrapIn } from "prosemirror-commands"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"
import { buildMenu } from "./menu.js"
import { buildKeymap } from "./keymap.js"
import { buildInputRules } from "./inputrules.js"

const schema = new Schema({
	nodes: addListNodes(schema_basic.spec.nodes, 'paragraph block*', 'block'),
	marks: schema_basic.spec.marks
})

window.view = new EditorView(document.querySelector('#editor'), {
	state: EditorState.create({
		doc: DOMParser.fromSchema(schema).parse(document.querySelector('#content')),
		plugins: [
			buildInputRules(schema),
			keymap(buildKeymap(schema)),
			keymap(baseKeymap),
			dropCursor(),
			gapCursor(),
			history(),
			buildMenu(schema)
		]
	})
})

window.setTimeout(function() {
	let doc = window.view.state.toJSON().doc
	console.log('doc: ' + JSON.stringify(doc, null, 2))
}, 1000)
