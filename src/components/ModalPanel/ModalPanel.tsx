import { IChildrenInheritedProps, IDialogProps } from '@echino/echino.ui.sdk';
import React, { useEffect } from 'react';
import { BoxTitle, IBoxProps } from '../Box/Box';
import { motion } from 'framer-motion'
import { Button } from '../Button/Button';


interface IModalPanelProps extends IDialogProps, IBoxProps, IChildrenInheritedProps<IModalPanelChildren> {
}

interface IModalPanelChildren {
	Title?: string;
	Subtitle?: string;
	Icon?: string;
}


export const ModalPanel: React.FC<IModalPanelProps> = (props) => {

	const [isPanelOpen, setIsPanelOpen] = React.useState(false);
	const [panelIndex, setPanelIndex] = React.useState(0);
	const [isMobile, setIsMobile] = React.useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		console.log('ModalPanel isMobile:', isMobile, panelIndex);
		isMobile ? setIsPanelOpen(false) : (panelIndex > 0 ? setIsPanelOpen(true) : setIsPanelOpen(false));
	}, [isMobile]);

	const childArray = React.Children.toArray(props.children);

	console.log('ModalPanel children:', childArray, 'isPanelOpen:', isPanelOpen, 'panelIndex:', panelIndex);
	const hasPanels = childArray.length > 1;
	return (
		<motion.div

			onClick={() => props.dialogId && props.cancelDialog(props.dialogId)}
			className='fixed p-5 inset-0 bg-gray-400/50 dark:bg-gray-900/50 backdrop-blur-lg flex md:justify-end z-50'>
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0 }}
				onClick={(e) => e.stopPropagation()} className='flex flex-row-reverse text-white border grow md:grow-0 border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-200 dark:bg-gray-900'>
				{/* Main Panel */}
				<motion.div

					className='rounded-r-2xl flex flex-col grow md:grow-0'>
					<BoxTitle {...props.childrenProps[isMobile ? panelIndex : 0]} Actions={<Button Type='Tertiary' Icon='fas fa-xmark' OnClick={() => props.dialogId && props.cancelDialog(props.dialogId)} />} />
					<div className='grow p-5 md:p-6 min-w-xs'>
						{childArray[isMobile ? panelIndex : 0]}
					</div>

					<div className='md:hidden px-4 py-2 border-t border-gray-300 dark:border-gray-700 dark:bg-white/[0.03] flex gap-2 justify-center'>
						{props.childrenProps.map((child, index) => (
							<ModalPanelButton key={index} Icon={child.Icon} OnClick={() => { setPanelIndex(index); }} Selected={panelIndex === index} />
						))}
					</div>
				</motion.div>

				{/* Tab Icons */}
				{hasPanels &&
					<div className={`hidden md:flex py-5 md:py-6 px-3 ${isPanelOpen ? 'border-l' : 'rounded-l-2xl'} flex-col gap-2 border-r border-gray-300 dark:border-gray-700 dark:bg-white/[0.03]`}>
						{props.childrenProps.map((child, index) => {
							if (index === 0) {
								return null; // Skip the first child as it is the main panel
							}
							return (
								<ModalPanelButton key={index} Icon={child.Icon} OnClick={() => { setPanelIndex(index); setIsPanelOpen(true); }} Selected={isPanelOpen && panelIndex === index} />
							)
						})}
					</div>
				}

				{/* Sidepanel */}
				<motion.div
					initial={{ width: '0px' }}
					variants={{
						open: { width: 'auto', opacity: 1 },
						closed: { width: '0px', opacity: 0 }
					}}
					animate={isPanelOpen ? 'open' : 'closed'}
					className='relative rounded-l-2xl overflow-hidden dark:bg-white/[0.03]'>
					<BoxTitle {...props.childrenProps[panelIndex]} Actions={<Button Type='Tertiary' Icon='fas fa-chevron-right' OnClick={() => setIsPanelOpen(false)} />} />

					<div className='p-5 md:p-6 min-w-xs'>
						{childArray[panelIndex]}
					</div>
				</motion.div>
			</motion.div>
		</motion.div>
	)
}

export const ModalPanelButton: React.FC<{ Icon?: string; OnClick: () => void, Selected: boolean }> = ({ Icon, OnClick, Selected }) => {
	return (
		<div onClick={OnClick}
			className={`bg-white dark:bg-gray-900 ${Selected ? 'bg-primary text-white dark:bg-primary dark:text-white' : ''} border border-primary ring-3 ring-primary/10 size-10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white cursor-pointer `}>
			<i className={`${Icon || 'fa-solid fa-circle'} flex items-center justify-center`}></i>
		</div>
	);
};