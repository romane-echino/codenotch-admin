import React, { PropsWithChildren } from 'react';
import { Sizing } from '../Sizing/Sizing';

interface IMarkdownProps extends PropsWithChildren<{}> {
	Type: 'Normal' | 'Error'
}
export const Markdown = (props: IMarkdownProps ) => {

	const { Type = 'Normal' } = props;

	const getContent = () => {
		let value = ' ';
		if (props.children && typeof props.children === 'string') {
			value = (props.children as string).trim();
			value = value.replace(/\t/g, '')
		}

		//titles
		value = value.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
			const level = hashes.length;
			return `<h${level}>${title}</h${level}>`;
		});
		// Horizontal rule
		value = value.replace(/^\s*[-*_]{3,}$/gm, '<hr/>')
			.replace(/\[(.*?)\]\((.*?)\s?(?:"(.*?)")?\)/gm, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
			.replace(/\*\*(.+?)\*\*|__(.+?)__/gm, '<strong>$1</strong>')
			.replace(/\*(.+?)\*|_(.+?)_/gm, '<em>$1</em>')
			.replace(/~~(.+?)~~/gm, '<del>$1</del>')
			.replace(/^```(?:\s*(\w+))?([\s\S]*?)^```$/gm, '<code>$1</code>')
			.replace(/`(.+?)`/gm, '<code>$1</code>')
			.replace(/^\s*[-+*]\s+\[([x\s-])\](.+)$/gm, (match, checked, text) => {
				const isChecked = checked.trim() === 'x';
				const isStarted = checked.trim() === '-';

				if (isStarted) {
					return `<div class="fill-primary"><i class="mr-2 fas fa-square-minus text-warning-500"></i> ${text.trim()}</div>`;
				}
				else if (isChecked) {
					return `<div class="fill-primary"><i class="mr-2 fas fa-square-check text-success-500"></i> ${text.trim()}</div>`;
				}
				else {
					return `<div class="fill-primary"><i class="mr-2 fas fa-square text-white/30"></i> ${text.trim()}</div>`;
				}
			})
			.replace(/^\s*[-+*]\s+(.+)$/gm, '<ul><li>$1</li></ul>')
			.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>')
			.replace(/^(?!<)(.+)$/gm, '<p>$1</p>')

		return value;
	}

	return (
		<Sizing {...props}>
			<div
				className={`mdblock ${Type === 'Error' ? 'md-error' : ''}`}
				dangerouslySetInnerHTML={{ __html: getContent() }}>

			</div>
		</Sizing>
	)

}