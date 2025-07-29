import React from 'react';
import './Markdown.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface IMarkdownProps {
}

interface IMarkdownState {
}

export class Markdown extends React.Component<IMarkdownProps, IMarkdownState> {

	constructor(props: IMarkdownProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		let value =(this.props.children as string).trim();
		value = value.replace(/\t/g, '')
		//value = value.replace('\n', '');
		//value = value.replace(/^\s+|\s+$/g, ''); // Trim
		console.log(`Markdown "${value}"`);
		return (
			<ReactMarkdown 
			className='mdblock text-gray-800 dark:text-white/90' 
			children={value} />
		)
	}

}