import React from 'react';
import './Radial.scss';
import { IPageInheritedProps } from '../Page/Page';
import { Box, IBoxProps } from '../Box/Box';
import { Sizing } from '../Sizing/Sizing';

interface IRadialProps extends IPageInheritedProps, IBoxProps {
}

interface IRadialState {
}

export class Radial extends React.Component<IRadialProps, IRadialState> {

	constructor(props: IRadialProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<Sizing {...this.props}>
				<Box {...this.props}>
					<span>RadialChart</span>
					<i className="fa-duotone fa-light fa-heart-crack text-lg"></i>
				</Box>
			</Sizing>
		)
	}

}