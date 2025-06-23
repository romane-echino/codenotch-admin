import React from 'react';
import './ObjectViewer.scss';

interface IObjectViewerProps {
}

interface IObjectViewerState {
}

export class ObjectViewer extends React.Component<IObjectViewerProps, IObjectViewerState> {

	constructor(props: IObjectViewerProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="object-viewer">ObjectViewer</div>
		)
	}

}