import React from 'react';
import './TabItem.scss';

interface ITabItemProps {
}

interface ITabItemState {
}

export class TabItem extends React.Component<ITabItemProps, ITabItemState> {

	constructor(props: ITabItemProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div>
				{this.props.children}
			</div>
		)
	}

}