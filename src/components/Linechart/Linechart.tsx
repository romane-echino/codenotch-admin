import React from 'react';
import './Linechart.scss';
import { IPageInheritedProps } from '../Page/Page';
import { Sizing } from '../Sizing/Sizing';
import { Box, IBoxProps } from '../Box/Box';

interface ILinechartProps extends IPageInheritedProps, IBoxProps {
}

interface ILinechartState {
}

export class Linechart extends React.Component<ILinechartProps, ILinechartState> {

	constructor(props: ILinechartProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<Box {...this.props}>
				<span>LineChart</span>
				<i className="fa-duotone fa-light fa-heart-crack text-lg"></i>
			</Box>
		)
	}

}