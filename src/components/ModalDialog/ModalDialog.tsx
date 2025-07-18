import React from 'react';
import './ModalDialog.scss';
import { Action, IDialogProps } from '@echino/echino.ui.sdk';
import { AnimatePresence, motion } from "framer-motion";
import { Box, IBoxProps } from '../Box/Box';
import { getTint } from '../../utils/ColorPaletteUtils';

interface IModalDialogProps extends IBoxProps, IDialogProps {
	OnClose: Action;
	Tint?: string;
}

interface IModalDialogState {
}

export class ModalDialog extends React.Component<IModalDialogProps, IModalDialogState> {

	constructor(props: IModalDialogProps) {
		super(props);

		this.state = {
		}
	}

	componentDidMount(): void {
		if(this.props.Tint){
			 document.getElementsByTagName("body")[0].style = getTint(this.props.Tint ?? '#465fff');
		}
	}

	render() {
		return (
			<motion.div
			 onClick={() => this.props.dialogId && this.props.cancelDialog(this.props.dialogId)} 
			className='fixed p-5 inset-0 h-full w-full bg-gray-400/50 dark:bg-gray-900/50 backdrop-blur-[32px] flex items-end sm:items-center justify-center z-50'>
				<div onClick={(e) => e.stopPropagation()} className='w-full max-w-[700px]'>
					<Box {...this.props} Modal={true}>
						{this.props.children}
					</Box>
				</div>
			</motion.div>
		)
	}

}