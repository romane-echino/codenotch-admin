import React from 'react';
import './Slider.scss';

interface ISliderProps {
}

interface ISliderState {
}

export class Slider extends React.Component<ISliderProps, ISliderState> {

	constructor(props: ISliderProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div className="slider">Slider</div>
		)
	}

}