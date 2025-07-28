import React from 'react';
import './CurrencyInput.scss';

interface ICurrencyInputProps {
}

interface ICurrencyInputState {
}

export class CurrencyInput extends React.Component<ICurrencyInputProps, ICurrencyInputState> {

	constructor(props: ICurrencyInputProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="currency-input">CurrencyInput</div>
		)
	}

}