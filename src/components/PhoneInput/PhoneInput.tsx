import React from 'react';
import './PhoneInput.scss';

interface IPhoneInputProps {
}

interface IPhoneInputState {
}

export class PhoneInput extends React.Component<IPhoneInputProps, IPhoneInputState> {

	constructor(props: IPhoneInputProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="phone-input">PhoneInput</div>
		)
	}

}