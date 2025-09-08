import React from 'react';
import { IBoxProps } from '../Box/Box';
import { IChildrenInheritedProps, Ii18nProps } from '@echino/echino.ui.sdk';
import { getFormattedValue, LabelType } from '../Label/Label';
import { getDataFromSource } from '../../utils/SourceHandling';
import { BoxProxy } from '../Box/BoxProxy';

interface IHistoryProps extends IBoxProps, IChildrenInheritedProps<IHistoryItem>, Ii18nProps {
	HasLayout: boolean;
	Take?: number;
	Source?: any;
}

interface IHistoryItem {
	Icon?: string;
	Title?: string;
	Subtitle?: string;
	Label1?: string;
	Label1Type?: LabelType;
	Label2?: string;
	Label2Type?: LabelType;
}

export const History: React.FC<IHistoryProps> = (props) => {
	const { Take } = props;
	const [data, setData] = React.useState<any[]>([]);
	const [fields, setFields] = React.useState<IHistoryItem>({});
	const hasSource = props.Source !== undefined;

	React.useEffect(() => {
		console.log("History: updating data from source/childrenProps", props.Source, props.childrenProps);

		setData(
			props.Source !== undefined ?
				getDataFromSource(props.Source):
				props.childrenProps
		);

		if (hasSource && props.childrenProps.length > 0) {
			setFields(props.childrenProps[0] as IHistoryItem);
		}
	}, [props.Source, props.childrenProps, Take]);




const filteredData = data.slice(0, Take ?? undefined);

	return (
		<BoxProxy {...props}>
			<div className='grid grid-cols-[auto_1fr_auto] gap-x-4 @container'>

				{filteredData.map((child: any, index) => {

					const obj: IHistoryItem = {
						Icon: hasSource ? child[fields.Icon || 'Icon'] : child.Icon,
						Title: hasSource ? child[fields.Title || 'Title'] : child.Title,
						Subtitle: hasSource ? child[fields.Subtitle || 'Subtitle'] : child.Subtitle,
						Label1: hasSource ? child[fields.Label1 || 'Label1'] : child.Label1,
						Label1Type: hasSource ? child[fields.Label1Type || 'Label1Type'] : child.Label1Type,
						Label2: hasSource ? child[fields.Label2 || 'Label2'] : child.Label2,
						Label2Type: hasSource ? child[fields.Label2Type || 'Label2Type'] : child.Label2Type,
					}

					return (
						<React.Fragment key={index}>
							<div className="flex size-12 items-center justify-center rounded-full border-2 border-gray-50 bg-white text-gray-700 ring ring-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800">
								{obj.Icon ?
									<i className={`${obj.Icon} size-5 flex items-center justify-center`} />
									:
									<i className="fa-duotone fa-circle text-xs size-5 flex items-center justify-center" />
								}
							</div>

							<div className='self-center'>
								{obj.Title &&
									<h4 className="font-medium text-gray-800 dark:text-white/90">
										{obj.Title}
									</h4>
								}
								{obj.Subtitle &&
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{obj.Subtitle}
									</p>
								}
							</div>

							<div className='self-center text-right'>
								{obj.Label1 &&
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{obj.Label1Type ? getFormattedValue(obj.Label1Type, obj.Label1, props.language) : obj.Label1}
									</p>
								}
								{obj.Label2 &&
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{obj.Label2Type ? getFormattedValue(obj.Label2Type, obj.Label2, props.language) : obj.Label2}
									</p>
								}
							</div>

							{index < data.length - 1 &&
								<div className='col-span-3 h-4 relative'>
									<div className="w-px absolute inset-y-0 left-6 border border-dashed border-gray-300 dark:border-gray-700"></div>
								</div>
							}
						</React.Fragment>
					)
				})}

				{Take && Take < data.length &&
					<div className='col-span-3 text-center text-sm text-gray-500 dark:text-gray-400'>
						showing {Take} of {data.length} items
					</div>
				}

			</div>
		</BoxProxy>
	)
}
