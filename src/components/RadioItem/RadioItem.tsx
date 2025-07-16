import React from 'react';
import './RadioItem.scss';

interface IRadioItemProps {
}

interface IRadioItemState {
}

export class RadioItem extends React.Component<IRadioItemProps, IRadioItemState> {

	constructor(props: IRadioItemProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="radio-item">RadioItem</div>
		)
	}

}