
import {
	inputRules, wrappingInputRule, textblockTypeInputRule, smartQuotes, emDash, ellipsis
} from 'prosemirror-inputrules'

export function blockQuoteRule(nodeType) {
	return wrappingInputRule(/^\s*>\s$/, nodeType)
}

export function orderedListRule(nodeType) {
	return wrappingInputRule(/^(\d+)\.\s$/, nodeType, match => ({order: +match[1]}),
	(match, node) => node.childCount + node.attrs.order == +match[1])
}

export function bulletListRule(nodeType) {
	return wrappingInputRule(/^\s*([-+*])\s$/, nodeType)
}

export function codeBlockRule(nodeType) {
	return textblockTypeInputRule(/^```$/, nodeType)
}

export function headingRule(nodeType, maxLevel) {
	return textblockTypeInputRule(new RegExp('^(#{1,' + maxLevel + '})\\s$'),
	nodeType, match => ({level: match[1].length}))
}

export function buildInputRules(schema) {
	
	let rules = smartQuotes.concat(ellipsis, emDash), type
	if (type = schema.nodes.blockquote) rules.push(blockQuoteRule(type))
	if (type = schema.nodes.ordered_list) rules.push(orderedListRule(type))
	if (type = schema.nodes.bullet_list) rules.push(bulletListRule(type))
	if (type = schema.nodes.code_block) rules.push(codeBlockRule(type))
	if (type = schema.nodes.heading) rules.push(headingRule(type, 6))
	return inputRules({rules})
}
