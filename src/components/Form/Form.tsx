import React from 'react';
import './Form.scss';
import { Box, IBoxProps } from '../Box/Box';
import { IPageInheritedProps } from '../Page/Page';
import { Sizing } from '../Sizing/Sizing';

interface IFormProps extends IBoxProps, IPageInheritedProps {
	HasLayout?: boolean;
}

interface IFormState {
}

export class Form extends React.Component<IFormProps, IFormState> {

	static defaultProps: IFormProps = {
		HasLayout: true,
	};

	constructor(props: IFormProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		if (this.props.HasLayout) {
			return (
				<Sizing {...this.props}>
					<Box {...this.props}>
						<div className='grid grid-cols-12 gap-4 md:gap-6'>
							{this.props.children}
						</div>
					</Box>
				</Sizing>
			)
		}
		else {
			return (
				<>
					{this.props.children}
				</>
			)
		}

	}

}