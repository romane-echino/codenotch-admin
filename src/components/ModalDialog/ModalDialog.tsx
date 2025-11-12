import React from 'react';
import { Action, IDialogProps } from '@echino/echino.ui.sdk';
import { Box, IBoxProps } from '../Box/Box';
import { Button } from '../Button/Button';
import { motion } from 'framer-motion';
import { getTint } from '../../utils/ColorPaletteUtils';


interface IModalDialogProps extends IBoxProps, IDialogProps {
	OnClose: Action;
	Tint?: string;

	HasClose?: boolean;
}

export const ModalDialog: React.FC<IModalDialogProps> = (props) => {

	if(props.Tint)
		document.getElementsByTagName("body")[0].style = getTint(props.Tint);
	
	return (
		<div
			onClick={() => props.dialogId && props.cancelDialog(props.dialogId)}
			className='fixed p-2 inset-0 h-full w-full bg-gray-400/50 dark:bg-gray-900/50 backdrop-blur-[32px] flex items-end sm:items-center justify-center z-50'>
			<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			onClick={(e) => e.stopPropagation()} className='w-full max-w-[700px]'>
				<Box {...props} Modal={true} Actions={
					props.HasClose ? <Button Type='Tertiary' Icon='fas fa-xmark' OnClick={() => props.dialogId && props.cancelDialog(props.dialogId)} /> : undefined
				}>
					{props.children}
				</Box>
			</motion.div>
		</div>
	)
}