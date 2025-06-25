import React from 'react';
import './DateInput.scss';

interface IDateInputProps {
}

interface IDateInputState {
}

export class DateInput extends React.Component<IDateInputProps, IDateInputState> {

	constructor(props: IDateInputProps) {
		super(props);

		this.state = {
		}
	}

	render() {
		return (
			<div>
				<label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
					Date Picker Input
				</label>

				<div className="relative">
					<div className="flatpickr-wrapper">
						<input type="text" placeholder="Select date" className="dark:bg-dark-900 datepickerTwo shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 pl-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 flatpickr-input active" />
							<div className="flatpickr-calendar animate static null open arrowTop arrowLeft" >
								<div className="flatpickr-months">
									<span className="flatpickr-prev-month">
										<svg className="stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M15.25 6L9 12.25L15.25 18.5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
										</svg>
									</span>
									<div className="flatpickr-month">
										<div className="flatpickr-current-month">
											<span className="cur-month">June </span>
											<div className="numInputWrapper">
												<input className="numInput cur-year" type="number" aria-label="Year" />
												<span className="arrowUp"></span>
												<span className="arrowDown"></span>
											</div>
										</div>
									</div>
									<span className="flatpickr-next-month">
										<svg className="stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M8.75 19L15 12.75L8.75 6.5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">

											</path>
										</svg>
									</span>
								</div>
								<div className="flatpickr-innerContainer">
									<div className="flatpickr-rContainer"><div className="flatpickr-weekdays">
										<div className="flatpickr-weekdaycontainer">
											<span className="flatpickr-weekday">Sun</span>
											<span className="flatpickr-weekday">Mon</span>
											<span className="flatpickr-weekday">Tue</span>
											<span className="flatpickr-weekday">Wed</span>
											<span className="flatpickr-weekday">Thu</span>
											<span className="flatpickr-weekday">Fri</span>
											<span className="flatpickr-weekday">Sat</span>
										</div>
									</div>
										<div className="flatpickr-days" >
											<div className="dayContainer">
												<span className="flatpickr-day" aria-label="June 1, 2025" >1</span>
												<span className="flatpickr-day" aria-label="June 2, 2025" >2</span>
												<span className="flatpickr-day" aria-label="June 3, 2025" >3</span>
												<span className="flatpickr-day" aria-label="June 4, 2025" >4</span>
												<span className="flatpickr-day" aria-label="June 5, 2025" >5</span>
												<span className="flatpickr-day" aria-label="June 6, 2025" >6</span>
												<span className="flatpickr-day" aria-label="June 7, 2025" >7</span>
												<span className="flatpickr-day" aria-label="June 8, 2025" >8</span>
												<span className="flatpickr-day" aria-label="June 9, 2025" >9</span>
												<span className="flatpickr-day" aria-label="June 10, 2025" >10</span>
												<span className="flatpickr-day" aria-label="June 11, 2025" >11</span>
												<span className="flatpickr-day" aria-label="June 12, 2025" >12</span>
												<span className="flatpickr-day" aria-label="June 13, 2025" >13</span>
												<span className="flatpickr-day" aria-label="June 14, 2025" >14</span>
												<span className="flatpickr-day" aria-label="June 15, 2025" >15</span>
												<span className="flatpickr-day" aria-label="June 16, 2025" >16</span>
												<span className="flatpickr-day" aria-label="June 17, 2025" >17</span>
												<span className="flatpickr-day" aria-label="June 18, 2025" >18</span>
												<span className="flatpickr-day" aria-label="June 19, 2025" >19</span>
												<span className="flatpickr-day" aria-label="June 20, 2025" >20</span>
												<span className="flatpickr-day" aria-label="June 21, 2025" >21</span>
												<span className="flatpickr-day" aria-label="June 22, 2025" >22</span>
												<span className="flatpickr-day" aria-label="June 23, 2025" >23</span>
												<span className="flatpickr-day" aria-label="June 24, 2025" >24</span>
												<span className="flatpickr-day today" aria-label="June 25, 2025" aria-current="date" >25</span>
												<span className="flatpickr-day" aria-label="June 26, 2025" >26</span>
												<span className="flatpickr-day" aria-label="June 27, 2025" >27</span>
												<span className="flatpickr-day" aria-label="June 28, 2025" >28</span>
												<span className="flatpickr-day" aria-label="June 29, 2025" >29</span>
												<span className="flatpickr-day" aria-label="June 30, 2025" >30</span>
												<span className="flatpickr-day nextMonthDay" aria-label="July 1, 2025" >1</span>
												<span className="flatpickr-day nextMonthDay" aria-label="July 2, 2025" >2</span>
												<span className="flatpickr-day nextMonthDay" aria-label="July 3, 2025" >3</span>
												<span className="flatpickr-day nextMonthDay" aria-label="July 4, 2025" >4</span>
												<span className="flatpickr-day nextMonthDay" aria-label="July 5, 2025" >5</span>
												<span className="flatpickr-day nextMonthDay" aria-label="July 6, 2025" >6</span>
												<span className="flatpickr-day nextMonthDay" aria-label="July 7, 2025" >7</span>
												<span className="flatpickr-day nextMonthDay" aria-label="July 8, 2025" >8</span>
												<span className="flatpickr-day nextMonthDay" aria-label="July 9, 2025" >9</span>
												<span className="flatpickr-day nextMonthDay" aria-label="July 10, 2025" >10</span>
												<span className="flatpickr-day nextMonthDay" aria-label="July 11, 2025" >11</span>
												<span className="flatpickr-day nextMonthDay" aria-label="July 12, 2025" >12</span>
											</div>
										</div>
									</div>
								</div>
							</div>
					</div>
					<span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
						<svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z" fill=""></path>
						</svg>
					</span>
				</div>
			</div>
		)
	}

}