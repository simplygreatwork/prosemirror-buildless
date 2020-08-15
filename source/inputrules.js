
import {
	inputRules, wrappingInputRule, textblockTypeInputRule, smartQuotes, emDash, ellipsis
} from 'prosemirror-inputrules'

function blockQuoteRule(nodeType) {
	
	return wrappingInputRule(/^\s*>\s$/, nodeType)
}

function orderedListRule(nodeType) {
	
	return wrappingInputRule(/^(\d+)\.\s$/, nodeType, match => ({order: +match[1]}),
	(match, node) => node.childCount + node.attrs.order == +match[1])
}

function bulletListRule(nodeType) {
	
	return wrappingInputRule(/^\s*([-+*])\s$/, nodeType)
}

function codeBlockRule(nodeType) {
	return textblockTypeInputRule(/^```$/, nodeType)
}

function headingRule(nodeType, maxLevel) {
	
	return textblockTypeInputRule(new RegExp('^(#{1,' + maxLevel + '})\\s$'),
	nodeType, match => ({level: match[1].length}))
}

export function buildInputRules(schema) {
	
	let rules = smartQuotes.concat(ellipsis, emDash)
	if (schema.nodes.blockquote) rules.push(blockQuoteRule(schema.nodes.blockquote))
	if (schema.nodes.ordered_list) rules.push(orderedListRule(schema.nodes.ordered_list))
	if (schema.nodes.bullet_list) rules.push(bulletListRule(schema.nodes.bullet_list))
	if (schema.nodes.code_block) rules.push(codeBlockRule(schema.nodes.code_block))
	if (schema.nodes.heading) rules.push(headingRule(schema.nodes.heading, 6))
	return inputRules({
		rules: rules
	})
}
