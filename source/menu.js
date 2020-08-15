
import { Plugin } from 'prosemirror-state'
import { toggleMark, setBlockType, wrapIn } from 'prosemirror-commands'

export function buildMenu(schema) {
	
	return new Plugin({
		
		view(editorView) {
			
			let view = null
			view = new MenuView([{
				command: toggleMark(schema.marks.strong),
				element: element('Bold', 'strong')
			}, {
				command: toggleMark(schema.marks.em),
				element: element('Italic', 'em')
			}, {
				command: setBlockType(schema.nodes.paragraph),
				element: element('Paragraph', 'paragraph')
			}, {
				command: setBlockType(schema.nodes.heading, { level: 1 }),
				element: element('Heading 1', 'heading')
			}, {
				command: setBlockType(schema.nodes.heading, { level: 2 }),
				element: element('Heading 2', 'heading')
			}, {
				command: wrapIn(schema.nodes.blockquote),
				element: element('Blockquote', 'blockquote')
			}, {
				command: insertImage(schema.nodes.image),
				element: element('Image', 'image')
			}, {
				command: linkify(schema.marks.link),
				element: element('Link', 'link')
			}], editorView)
			editorView.dom.parentNode.insertBefore(view.dom, editorView.dom)
			return view
		}
	})
}

export function insertImage(nodeType) {
	
	return function(state, dispatch) {
		
		if (dispatch) {
			dispatch(state.tr.replaceSelectionWith(nodeType.createAndFill({
				src: 'https://prosemirror.net/img/picture.png',
				title: '',
				alt: 'paragraph'
			})))
			return false
		} else {
			return true
		}
	}
}

export function linkify(nodeType) {
	
	return function(state, dispatch) {
		
		if (dispatch) {
			toggleMark(nodeType, {
				href: 'http://apple.com',
				title: 'hello'
			})(state, dispatch)
			return false
		} else {
			return true
		}
	}
}

function element(text, name) {
	
	let span = document.createElement('span')
	span.className = 'menuicon ' + name
	span.title = name
	span.textContent = text
	return span
}

class MenuView {
	
	constructor(items, editorView) {
		
		this.items = items
		this.editorView = editorView
		this.dom = document.createElement('div')
		this.dom.className = 'menubar'
		items.forEach(function(item) {
			this.dom.appendChild(item.element)
		}.bind(this))
		this.update()
		this.dom.addEventListener('mousedown', event => {
			event.preventDefault()
			editorView.focus()
			items.forEach(function(item) {
				if (item.element.contains(event.target)) {
					item.command(editorView.state, editorView.dispatch, editorView)
				}
			}.bind(this))
		})
	}
	
	update() {
		
		this.items.forEach(function(item) {
			let active = item.command(this.editorView.state, null, this.editorView)
			item.element.style.display = active ? '' : 'none'  // fixme: disable not hide
		}.bind(this))
	}
	
	destroy() {
		this.dom.remove()
	}
}
