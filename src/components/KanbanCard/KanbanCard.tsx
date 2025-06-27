import React from 'react';
import './KanbanCard.scss';

interface IKanbanCardProps {
	Title?: string;

}

interface IKanbanCardState {
}

export class KanbanCard extends React.Component<IKanbanCardProps, IKanbanCardState> {

	constructor(props: IKanbanCardProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div draggable="true" className="task rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
				<div className="flex items-start justify-between gap-6">
					<div>
						{this.props.Title &&
							<h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
								{this.props.Title}
							</h4>
						}

						<div className="flex items-center gap-3">
							<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
								<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill-rule="evenodd" clip-rule="evenodd" d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z" fill=""></path>
								</svg>
								Tomorrow
							</span>

							<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
								<svg className="stroke-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M9 15.6343C12.6244 15.6343 15.5625 12.6961 15.5625 9.07178C15.5625 5.44741 12.6244 2.50928 9 2.50928C5.37563 2.50928 2.4375 5.44741 2.4375 9.07178C2.4375 10.884 3.17203 12.5246 4.35961 13.7122L2.4375 15.6343H9Z" stroke="" stroke-width="1.5" stroke-linejoin="round"></path>
								</svg>

								1
							</span>
						</div>
					</div>

					<div className="h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
						<img src="src/images/user/user-01.jpg" alt="user" />
					</div>
				</div>
			</div>
		)
	}

}