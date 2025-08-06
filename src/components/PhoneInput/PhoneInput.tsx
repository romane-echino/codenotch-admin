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
			<div className="grid grid-cols-1 md:grid-cols-12 border border-alizarin">
				<div className='border border-emerald col-span-4 text-white p-2 flex *:grow md:*:grow-0 md:justify-start'>
					<div className='border border-orange-500'>Box 1</div>
				</div>

				<div className='border border-emerald col-span-4 text-white p-2 flex md:justify-center'>
					<div className='border border-orange-500'>Box 1</div>
				</div>

				<div className='border border-peter-river col-span-4 text-white p-2 flex md:justify-end'>
				

					<button className='py-1 px-2 rounded-2xl bg-success-500 text-white outline-0'>Mon bouton</button>
				</div>
			</div>
		)
	}

}