import React from 'react';
import './ButtonGroup.scss';

interface IButtonGroupProps {
}

interface IButtonGroupState {
}

export class ButtonGroup extends React.Component<IButtonGroupProps, IButtonGroupState> {

	constructor(props: IButtonGroupProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="button-group">ButtonGroup</div>
		)
	}

}