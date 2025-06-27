import React from 'react';
import './DisplayField.scss';

interface IDisplayFieldProps {
}

interface IDisplayFieldState {
}

export class DisplayField extends React.Component<IDisplayFieldProps, IDisplayFieldState> {

	constructor(props: IDisplayFieldProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="display-field">DisplayField</div>
		)
	}

}