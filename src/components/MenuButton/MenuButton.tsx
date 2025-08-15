import React from 'react';
import './MenuButton.scss';
import { Menu } from '@headlessui/react';

interface IMenuButtonProps {
}



export const MenuButton: React.FC<IMenuButtonProps> = (props) => {
	const [focus, setFocus] = React.useState<boolean>(false);
	const [popupPosition, setPopupPosition] = React.useState<'top' | 'bottom'>('bottom');
	const inputRef = React.useRef<HTMLButtonElement>(null);
	React.useEffect(() => {
		const calculatePosition = () => {
			if (!inputRef.current) return;

			const rect = inputRef.current.getBoundingClientRect();
			const inputMiddle = rect.top + rect.height / 2;
			const windowMiddle = window.innerHeight / 2;

			// If input is in the lower half of the screen, position popup above
			setPopupPosition(inputMiddle > windowMiddle ? 'top' : 'bottom');
		};

		if (focus) {
			calculatePosition();
			// Add event listeners when input is focused
			window.addEventListener('resize', calculatePosition);
			window.addEventListener('scroll', calculatePosition, true);
		}

		// Clean up
		return () => {
			window.removeEventListener('resize', calculatePosition);
			window.removeEventListener('scroll', calculatePosition, true);
		};
	}, [focus]);
	//${popupPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'}
	return (
		<Menu as="div" className="relative">
			<Menu.Button ref={inputRef}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
				className='size-8 text-lg cursor-pointer flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white'>
				<i className="fal fa-ellipsis-vertical"></i>
			</Menu.Button>
			<Menu.Items
				className={`absolute p-2 flex flex-col gap-1 right-0 -bottom-2 z-50 bg-white border border-gray-300  dark:border-gray-700 dark:bg-gray-800 translate-y-0.5 rounded-lg shadow-lg overflow-hidden`}>
				{props.children}
			</Menu.Items>
		</Menu>
	)
}

