import React from 'react';
import './IconInput.scss';

interface IIconInputProps {
}

interface IIconInputState {
}

export class IconInput extends React.Component<IIconInputProps, IIconInputState> {

	constructor(props: IIconInputProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="icon-input">IconInput</div>
		)
	}

}