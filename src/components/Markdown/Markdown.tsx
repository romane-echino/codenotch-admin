import React from 'react';
import './Markdown.scss';
import ReactMarkdown from 'react-markdown';

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
		let value = ' ';
		if (this.props.children && typeof this.props.children === 'string') {
			value = (this.props.children as string).trim();
			value = value.replace(/\t/g, '')
		}

		return (
			<ReactMarkdown
				className='mdblock text-gray-800 dark:text-white/90'
				children={value} />
		)
	}

}