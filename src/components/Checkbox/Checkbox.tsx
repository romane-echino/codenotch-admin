import React, { useRef } from 'react';
import './Checkbox.scss';

interface ICheckboxProps {
	Label: string;
}

interface ICheckboxState {
}

export const Checkbox: React.FC<ICheckboxProps> = (props) => {

	const checkboxRef = useRef<HTMLInputElement>(null);

	return (
		<div className="flex cursor-pointer items-center text-sm font-medium text-gray-700 select-none dark:text-gray-400">
			<div className="relative">
				<input type="checkbox" ref={checkboxRef} />
				<div className={`hover:border-brand-500 dark:hover:border-brand-500 mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] border-brand-500 bg-brand-500`}>
					<span>
						<i className="fa-solid fa-check"></i>
					</span>
				</div>
			</div>
			{props.Label}
		</div>
	)
}