import React, { useCallback, useEffect } from 'react';
import './Matrix.scss';
import { Action, IChildrenInheritedProps, Ii18nProps } from '@echino/echino.ui.sdk';
import { Sizing } from '../Sizing/Sizing';
import { Box } from '../Box/Box';
import { Popover } from '@headlessui/react';
import { Dropdown } from '../Dropdown/Dropdown';
import { getFormattedValue, Label, LabelType } from '../Label/Label';

interface IMatrixProps extends IChildrenInheritedProps<IItemProps>, Ii18nProps {
	HasLayout?: boolean;
	OnChange?: Action<IMatrixStructure>;
	_internalOnChange?: (value: IMatrixStructure) => void;
	Vertical?: string[] | number[];
	Horizontal?: string[] | number[];

	VerticalLabel?: string;
	VerticalIcon?: string;

	HorizontalLabel?: string;
	HorizontalIcon?: string;

	Template?: (v, h) => any;
	Availability?: (v, h) => boolean;
}

interface IItemProps {
	Field: string;
	Type?: LabelType;
}


interface IMatrixStructure {
	[vertical: string | number]: {
		[horizontal: string | number]: any
	};
}


export const Matrix: React.FC<IMatrixProps> = (props) => {
	const vertical = props.Vertical || [];
	const horizontal = props.Horizontal || [];
	const [data, setData] = React.useState<IMatrixStructure>({});


	const toggle = (vertical: number | string) => {
		const isSelected = data[vertical] !== undefined;
		if (isSelected) {
			const newData = { ...data };
			delete newData[vertical];
			setData(newData);
		} else {
			const horizontalKey = horizontal[0];
			setData({
				...data,
				[vertical]: {
					[horizontalKey]: props.Template ? props.Template(vertical, horizontalKey) : {}
				}
			});
		}
	};

	const add = (vertical: number | string, nextHorizontal: string | number) => {
		const horizontalData: any = props.Template ? props.Template(vertical, nextHorizontal) : {}

		setData((prevData) => ({
			...prevData,
			[vertical]: {
				...prevData[vertical],
				[nextHorizontal]: horizontalData
			}
		}));
	};


	const remove = (vertical: number | string, horizontal: string | number) => {
		console.log('Remove', vertical, horizontal);
		if (Object.keys(data[vertical]).length === 1) {
			setData((prevData) => {
				const newData = { ...prevData };
				if (newData[vertical]) {
					delete newData[vertical];
				}
				return newData;
			});
		}
		else {
			setData((prevData) => {
				const newData = { ...prevData };
				if (newData[vertical]) {
					delete newData[vertical][horizontal];
					if (Object.keys(newData[vertical]).length === 0) {
						delete newData[vertical];
					}
				}
				return newData;
			});
		}
	};

	const change = (vertical: number | string, horizontal: string | number, newValue: any) => {
		setData((prevData) => ({
			...prevData,
			[vertical]: {
				...prevData[vertical],
				[horizontal]: newValue
			}
		}));

		props.OnChange?.(data);
		props._internalOnChange?.(data);
	};

	const changeKey = (vertical: number | string, oldKey: string | number, newKey: string | number) => {
		setData((prevData) => {
			const newData = { ...prevData };
			if (newData[vertical]) {
				newData[vertical][newKey] = props.Template ? props.Template(vertical, newKey) : {};
				delete newData[vertical][oldKey];
			}
			return newData;
		});
	};

	const getNext = (vertical: number | string): { next: string | number | undefined, available: (string | number)[] } => {
		const filteredHorizontalKeys = props.Availability ? horizontal.filter(h => props.Availability?.(vertical, h)) : horizontal;
		const currentHorizontalKeys = data[vertical] ? Object.keys(data[vertical]) : [];
		const availableHorizontalKeys = filteredHorizontalKeys.filter(h => !currentHorizontalKeys.includes(h.toString()));
		const resultKeys = availableHorizontalKeys.length > 0 ? availableHorizontalKeys : [];
		if (!data[vertical])
			return { next: undefined, available: resultKeys };

		if (horizontal.length === 0)
			return { next: undefined, available: resultKeys };

		return { next: resultKeys[0], available: resultKeys };
	}


	const getContent = () => (
		<div className='grid grid-cols-[auto_auto_1fr_auto] items-start text-gray-700 dark:text-gray-400 gap-x-2 px-2'>
			{vertical.map((v, vi) => {
				const isSelected = data[v] !== undefined;
				const verticalData = data[v] || undefined;
				const { next, available } = getNext(v);

				return (
					<React.Fragment key={v}>
						<div className='h-9 my-2 flex items-center'>
							<div onClick={() => toggle(v)}
								className={`dark:bg-gray-900 ml-2 cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 hover:ring-3 hover:ring-primary/10 flex size-5 items-center justify-center rounded-md border
								${isSelected ? 'border-primary bg-primary dark:bg-primary' : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'} `}>

								{isSelected &&
									<i className="fa-solid fa-check text-white flex items-center justify-center"></i>
								}
							</div>
						</div>


						<div className='h-9 my-2 flex items-center'>
							<div className={`capitalize flex gap-1 ${isSelected ? 'text-gray-700 dark:text-white' : ''}`}>
								{props.VerticalIcon && <i className={`${props.VerticalIcon} text-xs flex items-center`}></i>}
								<span>{v}</span>
								{props.VerticalLabel && <span>{props.VerticalLabel}</span>}
							</div>
						</div>

						<div className='flex gap-2 min-h-9 items-center flex-wrap  mt-2'>
							{Object.keys(verticalData || {}).map((h, hi) => {
								const horizontalData = verticalData[h];
								return (
									<div className='flex' key={`${v}-${h}`}>
										<div className='flex bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:ring-3 hover:ring-primary/10 border hover:border-primary hover:dark:border-primary rounded-l-lg'>
											<MatrixItem
												OnChange={(d) => change(v, h, d)}
												OnChangeKey={(oldKey, newKey) => changeKey(v, oldKey, newKey)}
												HorizontalLabel={props.HorizontalLabel}
												HorizontalIcon={props.HorizontalIcon}
												data={horizontalData}
												childrenProps={props.childrenProps}
												language={props.language}
												HorizontalKey={h}
												VerticalKey={v}
												AvailableKeys={available}>

												{props.children}
											</MatrixItem>
										</div>

										<div className='flex items-center bg-white dark:bg-gray-900 justify-center px-2 border-r rounded-r-lg border-y cursor-pointer hover:opacity-80 border-gray-300 dark:border-gray-700' onClick={() => remove(v, h)}>
											<i className="fa-solid fa-trash text-sm text-alizarin  flex items-center justify-center" ></i>
										</div>
									</div>
								);
							})}
						</div>

						<div className='h-9 my-2 flex items-center'>
							{isSelected && next !== undefined &&
								<button
									onClick={() => add(v, next)}
									className='rounded-lg bg-primary size-6 mr-2 text-white flex items-center justify-center cursor-pointer'>
									<i className="fa-solid fa-plus text-sm flex items-center justify-center"></i>
								</button>
							}
						</div>

						<div className='col-span-4 border-b border-gray-200 dark:border-gray-800'></div>
					</React.Fragment>
				)
			})}
		</div>
	)

	if (props.HasLayout !== undefined && props.HasLayout === false) {
		return (
			<Sizing>
				{getContent()}
			</Sizing>
		)
	}
	else {
		return (
			<Box {...props} DisablePadding={true}>
				{getContent()}
			</Box>
		)
	}
}



interface IMatrixItemProps extends IChildrenInheritedProps<IItemProps> {
	HorizontalKey: string | number;
	VerticalKey: string | number;
	data: any;
	language: string;
	AvailableKeys: (string | number)[];
	HorizontalLabel?: string;
	HorizontalIcon?: string;
	OnChange: (data: any) => void;
	OnChangeKey: (oldKey: string | number, newKey: string | number) => void;
}

const MatrixItem: React.FC<IMatrixItemProps> = (props) => {
	const [data, setData] = React.useState<any>(props.data);
	const [isOpen, setIsOpen] = React.useState(false);
	const { OnChange } = props;
	const ref = React.useRef<HTMLDivElement>(null);

	useEffect(() => {
		setData(props.data);
	}, [props.data]);


	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				console.log("You clicked outside of me!");
				setIsOpen(false);
			}
		}
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);

	const handleChange = (value: any, field: string) => {
		if (JSON.stringify(value) !== JSON.stringify(data[field])) {
			setData((prevData: any) => {
				const newData = { ...prevData, [field]: value };

				OnChange(newData);
				return newData;
			});

		}
	};

	const getChildren = useCallback(() => {

		console.log('Matrix::getChildren')
		return React.Children.map(props.children, (child, index) => {
			//@ts-ignore
			let effectiveProps: any = { ...child.props };
			let field: string | undefined = props.childrenProps?.[index]?.Field;

			effectiveProps.children.props = {
				...effectiveProps?.children?.props,
				Value: data ? data[Object.keys(data)[index]] : undefined,
				OnChange: field ? (value: any) => { handleChange(value, field) } : undefined,
			}

			if (React.isValidElement(child)) {
				//@ts-ignore
				return React.cloneElement(child, effectiveProps);
			}
		});
	}, [data, props.children, props.childrenProps, props.VerticalKey, props.HorizontalKey, handleChange]);

	const getIcon = (index: number) => {
		const child: any = React.Children.toArray(props.children)[index] as any;
		if (child?.props?.children?.props?.Icon) {
			return <i className={`${child.props.children.props.Icon} text-xs flex items-center`}></i>;
		}
		return null;
	};

	return (
		<div className="relative">
			<div onClick={() => setIsOpen(!isOpen)}
				className={`h-8 cursor-pointer text-sm border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white/90 flex divide-gray-300 dark:divide-gray-700 divide-x`}>
				<div className='flex items-center gap-1 px-2 '>
					<div>{props.HorizontalKey}</div>
					{props.HorizontalIcon && <i className={`${props.HorizontalIcon} text-xs flex items-center`}></i>}
				</div>

				{Object.entries(data).map(([key, value], index) => {
					if (!value)
						return null;

					return props.childrenProps?.[index]?.Type ?
						(
							<div key={index} className='flex items-center gap-1 px-2 '>
								{value !== '' && value !== false && <div>{getFormattedValue(props.childrenProps[index].Type, (value as string), props.language)}</div>}
								{getIcon(index)}
							</div>
						) :
						(
							<div key={index} className='flex items-center gap-1 px-2 '>
								{value !== '' && typeof (value) !== 'boolean' && <div>{value}</div>}
								{getIcon(index)}
							</div>
						);
				})}
			</div>

			<div ref={ref} key={`${props.VerticalKey}-${props.HorizontalKey}`}
				style={{ display: isOpen ? 'block' : 'none' }}
				className="absolute z-10 shadow-lg top-full min-w-xs mt-1 flex flex-col gap-2 p-2 text-gray-800 dark:text-white/90 bg-white border border-gray-300  dark:border-gray-700 dark:bg-gray-800 rounded-lg">

				{props.AvailableKeys.length > 0 &&
					<Dropdown
						Title={props.HorizontalLabel}
						Icon={props.HorizontalIcon}
						Source={[props.HorizontalKey, ...props.AvailableKeys]}
						Value={props.HorizontalKey}
						declareFunction={() => { }}
						onPropertyChanged={(v, o, n) => {
							if (props.HorizontalKey !== n) {
								props.OnChangeKey(props.HorizontalKey, n);
							}
						}} />
				}
				{getChildren()}
			</div>
		</div>
	)
}