import React from 'react';
import './ToggleButton.scss';

interface IToggleButtonProps {
}

interface IToggleButtonState {
}

export class ToggleButton extends React.Component<IToggleButtonProps, IToggleButtonState> {

	constructor(props: IToggleButtonProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="toggle-button">ToggleButton</div>
		)
	}

}