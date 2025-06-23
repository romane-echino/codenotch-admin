import React from 'react';
import './Button.scss';

interface IButtonProps {
}

interface IButtonState {
}

export class Button extends React.Component<IButtonProps, IButtonState> {

	constructor(props: IButtonProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="button">Button</div>
		)
	}

}