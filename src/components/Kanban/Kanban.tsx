import React, { useEffect, useState } from 'react';
import './Kanban.scss';
import { IPageInheritedProps } from '../Page/Page';
import { Box, IBoxProps } from '../Box/Box';
import { Sizing } from '../Sizing/Sizing';
import { KanbanCard } from '../KanbanCard/KanbanCard';
import { CSS } from "@dnd-kit/utilities";
import {

	DndContext,
	MouseSensor,
	TouchSensor,
	useDroppable,
	UniqueIdentifier,
	useSensors,
	useSensor,
	DragOverEvent,
	DragEndEvent,
	closestCorners,
	DragStartEvent,
} from '@dnd-kit/core';
import {
	SortableContext,
	useSortable,
	arrayMove,
	rectSortingStrategy,
} from '@dnd-kit/sortable';

import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import { ColumnContainer } from './Parts/ColumnContainer';
import { getColorFromName } from '../../utils/DefaultColorPalette';

interface IKanbanProps extends IPageInheritedProps, IBoxProps {
	Source?: any[];
	CardRenderer: (data: any, index: number) => React.ReactNode;
	CardField?: string
}



export type Id = string | number;

export type CardColumn = {
	id: Id;
	title: string;
}

export type Card = {
	id: Id;
	columnId: Id;
	content: any;
}
export const Kanban: React.FC<IKanbanProps> = (props) => {
	const [columns, setColumns] = React.useState<CardColumn[]>([]);
	const [activeColumn, setActiveColumn] = React.useState<CardColumn | null>(null)
	const [activeCard, setActiveCard] = React.useState<Card | null>(null)
	const [cards, setCards] = React.useState<Card[]>([])
	const cardField = props.CardField || 'items';

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
	);

	useEffect(() => {
		updateSource();
	}, [props.Source, props.children]);

	function generateId() {
		return Math.floor(Math.random() * 1000) + 1;
	}

	function onDragStart(event: DragStartEvent) {
		console.log("Drag Start", event)
		if (event.active.data.current?.type === "Column") {
			setActiveColumn(event.active.data.current.column);
			return;
		}
		if (event.active.data.current?.type === "Card") {
			setActiveCard(event.active.data.current.card);
			return;
		}
	}

	function onDragEnd(event: DragEndEvent) {
		setActiveColumn(null);
		setActiveCard(null);
		const { active, over } = event;
		if (!over) return;

		const activeColumnId = active.id;
		const overColumnId = over.id;
		if (activeColumnId === overColumnId) return;

		setColumns((columns) => {
			const activeColumnIndex = columns.findIndex(
				(col) => col.id === activeColumnId
			);
			const overColumnIndex = columns.findIndex(
				(col) => col.id === overColumnId
			);
			return arrayMove(columns, activeColumnIndex, overColumnIndex)
		})
	}

	function onDragOver(event: DragOverEvent) {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;
		const isActiveACard = active.data.current?.type === "Card";
		const isOverACard = over.data.current?.type === "Card";

		if (!isActiveACard) return;

		// dropping a task over another task
		if (isActiveACard && isOverACard) {
			setCards((cards) => {
				const activeIndex = cards.findIndex((t) => t.id === activeId);
				const overIndex = cards.findIndex((t) => t.id === overId);
				cards[activeIndex].columnId = cards[overIndex].columnId
				return arrayMove(cards, activeIndex, overIndex)
			})
		}

		const isOverAColumn = over.data.current?.type === "Column";
		//dorpping a task over another coloumn
		if (isActiveACard && isOverAColumn) {
			setCards((cards) => {
				const activeIndex = cards.findIndex((t) => t.id === activeId);
				cards[activeIndex].columnId = overId
				return arrayMove(cards, activeIndex, activeIndex)
			})
		}
	}

	function updateSource() {
		if (props.Source === undefined || props.Source.length === 0) {
			setColumns([]);
			return;
		}

		let columns: CardColumn[] = [];
		let cards: Card[] = [];
		let customColumns = React.Children.toArray(props.children)
			.map(c => (c as any).props.children.props)
			.filter(c => c.componentDescription.tag.split(':')[1] === 'KanbanColumn')

		let defaultCardField = Object.keys(props.Source[0]).find((key) => Array.isArray(props.Source![0][key])) ?? 'items';
		if (customColumns.length > 0) {
			columns = customColumns.map((col: any, index: number) => {
				let sourceData = props.Source![index];
				let columnId = generateId();

				if (sourceData[props.CardField ?? defaultCardField]) {
					cards = cards.concat(sourceData[props.CardField ?? defaultCardField].map((card: any) => {
						return {
							id: generateId(),
							content: card,
							columnId: columnId
						};
					}));
				}
				return {
					id: columnId,
					title: col.Label || col.Field.charAt(0).toUpperCase() + col.Field.slice(1) || 'Column ' + (index + 1),

				}
			});
		}
		else {
			columns = props.Source!.map((col, index) => {
				let name = col['name'] as string ?? undefined;
				if (name) name = name.charAt(0).toUpperCase() + name.slice(1);
				let columnId = generateId();
				if (col[props.CardField ?? defaultCardField]) {
					cards = cards.concat(col[props.CardField ?? defaultCardField].map((card: any) => {
						return {
							id: generateId(),
							content: card,
							columnId: columnId
						};
					}));
				}

				return {
					id: columnId,
					title: name || 'Column ' + (index + 1),
				};
			});
		}

		setCards(cards);
		setColumns(columns);
	}

	return (
		<Box {...props}>
			<DndContext
				sensors={sensors}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				onDragOver={onDragOver}>

				<div className=" divide-x-[1px] divide-gray-200 dark:divide-gray-800 mt-7 -mb-6 -mx-6 grid grid-cols-1 border-t border-gray-200 dark:border-gray-800 sm:mt-0 sm:grid-cols-2 xl:grid-cols-3">

					{columns.map((column) => (
						<ColumnContainer
							column={column}
							cardRenderer={props.CardRenderer}
							cards={cards.filter((card) => card.columnId === column.id)}
							key={column.id}

						></ColumnContainer>
					))}
				</div>
			</DndContext>
		</Box>
	)
}

/*interface IKanbanState {
	columns: IKanbanColumns[];
	cardField?: string;
}

export interface IKanbanColumns {
	Field: string;
	Label?: string;
}

const sensors = useSensors(
	useSensor(MouseSensor),
	useSensor(TouchSensor),
);

export class Kanban extends React.Component<IKanbanProps, IKanbanState> {

	constructor(props: IKanbanProps) {
		super(props);

		this.state = {
			columns: []
		}
	}

	componentDidMount(): void {
		this.updateSource();
	}

	componentDidUpdate(prevProps: Readonly<IKanbanProps>, prevState: Readonly<IKanbanState>, snapshot?: any): void {
		if (JSON.stringify(prevProps.Source) !== JSON.stringify(this.props.Source)) {
			this.updateSource();
		}
	}


	updateSource() {
		let columns: IKanbanColumns[] = [];
		let cardField: string | undefined;

		let customColumns = React.Children.toArray(this.props.children)
			.map(c => (c as any).props.children.props)
			.filter(c => c.componentDescription.tag.split(':')[1] === 'DisplayField')

		if (customColumns.length > 0) {
			columns = customColumns.map((col: any) => {
				return {
					Field: col.Field,
					Label: col.Label
				};
			});
			// When source is a direct array reference
		}

		if (this.props.Source && this.props.Source.length > 0) {
			let first = this.props.Source[0];
			let key = Object.keys(first).find((key) => Array.isArray(first[key]));
			console.log('key', key, Object.keys(this.props.Source[0]));
			if (typeof key === 'string') {
				cardField = key;
			}
		}

		this.setState({ columns, cardField: cardField });
	}

	defaultCardRenderer(card: any) {
		console.log('defaultCardRenderer', Object.keys(card)[0], card);
		return (
			<KanbanCard Source={card} />
		);
	}

	render() {

		let columns = this.state.columns.length > 0 ? this.state.columns : this.props.Source || [];
		let columnIds: UniqueIdentifier[] = columns && columns.map((col) => col.id) || [];
		
		return (
			<DndContext
				sensors={sensors}
				onDragStart={() => { }}
				onDragEnd={() => { }}
				onDragOver={() => { }}
			>
				<div className="mt-7 -mx-6 grid grid-cols-1 border-t border-gray-200 dark:border-gray-800 sm:mt-0 sm:grid-cols-2 xl:grid-cols-3">
					<SortableContext items={columnIds}>
						{columns.map((column) => (
							<div className="swim-lane flex flex-col gap-5 p-4 xl:p-6">
								<div className="mb-1 flex items-center justify-between">
									<h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
										To Do {this.state.cardField}
										<span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
											3
										</span>
									</h3>

									<div x-data="{openDropDown: false}" className="relative">
										<button className="text-gray-700 dark:text-gray-400">
											<svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path fill-rule="evenodd" clip-rule="evenodd" d="M5.99902 10.2451C6.96552 10.2451 7.74902 11.0286 7.74902 11.9951V12.0051C7.74902 12.9716 6.96552 13.7551 5.99902 13.7551C5.03253 13.7551 4.24902 12.9716 4.24902 12.0051V11.9951C4.24902 11.0286 5.03253 10.2451 5.99902 10.2451ZM17.999 10.2451C18.9655 10.2451 19.749 11.0286 19.749 11.9951V12.0051C19.749 12.9716 18.9655 13.7551 17.999 13.7551C17.0325 13.7551 16.249 12.9716 16.249 12.0051V11.9951C16.249 11.0286 17.0325 10.2451 17.999 10.2451ZM13.749 11.9951C13.749 11.0286 12.9655 10.2451 11.999 10.2451C11.0325 10.2451 10.249 11.0286 10.249 11.9951V12.0051C10.249 12.9716 11.0325 13.7551 11.999 13.7551C12.9655 13.7551 13.749 12.9716 13.749 12.0051V11.9951Z" fill=""></path>
											</svg>
										</button>
										<div x-show="openDropDown" className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark" style={{ display: 'none' }}>
											<button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
												Edit
											</button>
											<button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
												Delete
											</button>
											<button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
												Clear All
											</button>
										</div>
									</div>
								</div>

								{this.state.cardField && column[this.state.cardField] && column[this.state.cardField].map((card: any, cardIndex: number) => (
									<>
										{this.props.CardRenderer ?
											this.props.CardRenderer('item', card) :
											this.defaultCardRenderer(card)}
									</>
								))}

							</div>
						))}
					</SortableContext>
				</div>

				{"document" in window &&
					createPortal(
						<DragOverlay>
							{activeColumn && (
								<BoardColumn
									isOverlay
									column={activeColumn}
									tasks={tasks.filter(
										(task) => task.columnId === activeColumn.id
									)}
								/>
							)}
							{activeTask && <TaskCard task={activeTask} isOverlay />}
						</DragOverlay>,
						document.body
					)}
			</DndContext>
		)
		return (
			<Sizing {...this.props}>
				<Box {...this.props}>


					<div className="mt-7 -mx-6 grid grid-cols-1 border-t border-gray-200 dark:border-gray-800 sm:mt-0 sm:grid-cols-2 xl:grid-cols-3">
						{this.props.Source && this.props.Source.map((column, index) => (


							<div className="swim-lane flex flex-col gap-5 p-4 xl:p-6">
								<div className="mb-1 flex items-center justify-between">
									<h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
										To Do {this.state.cardField}
										<span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
											3
										</span>
									</h3>

									<div x-data="{openDropDown: false}" className="relative">
										<button className="text-gray-700 dark:text-gray-400">
											<svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path fill-rule="evenodd" clip-rule="evenodd" d="M5.99902 10.2451C6.96552 10.2451 7.74902 11.0286 7.74902 11.9951V12.0051C7.74902 12.9716 6.96552 13.7551 5.99902 13.7551C5.03253 13.7551 4.24902 12.9716 4.24902 12.0051V11.9951C4.24902 11.0286 5.03253 10.2451 5.99902 10.2451ZM17.999 10.2451C18.9655 10.2451 19.749 11.0286 19.749 11.9951V12.0051C19.749 12.9716 18.9655 13.7551 17.999 13.7551C17.0325 13.7551 16.249 12.9716 16.249 12.0051V11.9951C16.249 11.0286 17.0325 10.2451 17.999 10.2451ZM13.749 11.9951C13.749 11.0286 12.9655 10.2451 11.999 10.2451C11.0325 10.2451 10.249 11.0286 10.249 11.9951V12.0051C10.249 12.9716 11.0325 13.7551 11.999 13.7551C12.9655 13.7551 13.749 12.9716 13.749 12.0051V11.9951Z" fill=""></path>
											</svg>
										</button>
										<div x-show="openDropDown" className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark" style={{ display: 'none' }}>
											<button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
												Edit
											</button>
											<button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
												Delete
											</button>
											<button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
												Clear All
											</button>
										</div>
									</div>
								</div>

								{this.state.cardField && column[this.state.cardField] && column[this.state.cardField].map((card: any, cardIndex: number) => (
									<>
										{this.props.CardRenderer ?
											this.props.CardRenderer('item', card) :
											this.defaultCardRenderer(card)}
									</>
								))}

							</div>
						))}

						<div className="swim-lane flex flex-col gap-5 border-x border-gray-200 p-4 dark:border-gray-800 xl:p-6">
							<div className="mb-1 flex items-center justify-between">
								<h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
									In Progress
									<span className="inline-flex rounded-full bg-warning-50 px-2 py-0.5 text-theme-xs font-medium text-warning-700 dark:bg-warning-500/15 dark:text-orange-400">
										5
									</span>
								</h3>

								<div x-data="{openDropDown: false}" className="relative">
									<button className="text-gray-700 dark:text-gray-400">
										<svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path fill-rule="evenodd" clip-rule="evenodd" d="M5.99902 10.2451C6.96552 10.2451 7.74902 11.0286 7.74902 11.9951V12.0051C7.74902 12.9716 6.96552 13.7551 5.99902 13.7551C5.03253 13.7551 4.24902 12.9716 4.24902 12.0051V11.9951C4.24902 11.0286 5.03253 10.2451 5.99902 10.2451ZM17.999 10.2451C18.9655 10.2451 19.749 11.0286 19.749 11.9951V12.0051C19.749 12.9716 18.9655 13.7551 17.999 13.7551C17.0325 13.7551 16.249 12.9716 16.249 12.0051V11.9951C16.249 11.0286 17.0325 10.2451 17.999 10.2451ZM13.749 11.9951C13.749 11.0286 12.9655 10.2451 11.999 10.2451C11.0325 10.2451 10.249 11.0286 10.249 11.9951V12.0051C10.249 12.9716 11.0325 13.7551 11.999 13.7551C12.9655 13.7551 13.749 12.9716 13.749 12.0051V11.9951Z" fill=""></path>
										</svg>
									</button>
									<div x-show="openDropDown" className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark" style={{ display: 'none' }}>
										<button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
											Edit
										</button>
										<button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
											Delete
										</button>
										<button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
											Clear All
										</button>
									</div>
								</div>
							</div>

							<div draggable="true" className="task rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
								<div className="flex items-start justify-between gap-6">
									<div>
										<h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
											Work In Progress (WIP) Dashboard
										</h4>

										<div className="flex items-center gap-3">
											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path fill-rule="evenodd" clip-rule="evenodd" d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z" fill=""></path>
												</svg>
												Today
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
										<img src="src/images/user/user-09.jpg" alt="user" />
									</div>
								</div>
							</div>

							<div draggable="true" className="task rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
								<div className="flex items-start justify-between gap-6">
									<div>
										<h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
											Kanban Flow Manager
										</h4>

										<div className="flex items-center gap-3">
											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path fill-rule="evenodd" clip-rule="evenodd" d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z" fill=""></path>
												</svg>
												Feb 12, 2027
											</span>

											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="stroke-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M9 15.6343C12.6244 15.6343 15.5625 12.6961 15.5625 9.07178C15.5625 5.44741 12.6244 2.50928 9 2.50928C5.37563 2.50928 2.4375 5.44741 2.4375 9.07178C2.4375 10.884 3.17203 12.5246 4.35961 13.7122L2.4375 15.6343H9Z" stroke="" stroke-width="1.5" stroke-linejoin="round"></path>
												</svg>

												8
											</span>

											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path fill-rule="evenodd" clip-rule="evenodd" d="M6.88066 3.10905C8.54039 1.44932 11.2313 1.44933 12.8911 3.10906C14.5508 4.76878 14.5508 7.45973 12.8911 9.11946L12.0657 9.94479L11.0051 8.88413L11.8304 8.0588C12.9043 6.98486 12.9043 5.24366 11.8304 4.16972C10.7565 3.09577 9.01526 3.09577 7.94132 4.16971L7.11599 4.99504L6.05533 3.93438L6.88066 3.10905ZM8.88376 11.0055L9.94442 12.0661L9.11983 12.8907C7.4601 14.5504 4.76915 14.5504 3.10942 12.8907C1.44969 11.231 1.44969 8.54002 3.10942 6.88029L3.93401 6.0557L4.99467 7.11636L4.17008 7.94095C3.09614 9.01489 3.09614 10.7561 4.17008 11.83C5.24402 12.904 6.98522 12.904 8.05917 11.83L8.88376 11.0055ZM9.94458 7.11599C10.2375 6.8231 10.2375 6.34823 9.94458 6.05533C9.65169 5.76244 9.17682 5.76244 8.88392 6.05533L6.0555 8.88376C5.7626 9.17665 5.7626 9.65153 6.0555 9.94442C6.34839 10.2373 6.82326 10.2373 7.11616 9.94442L9.94458 7.11599Z" fill=""></path>
												</svg>

												2
											</span>
										</div>

										<span className="mt-3 inline-flex rounded-full bg-success-50 px-2 py-0.5 text-theme-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-500">
											Template
										</span>
									</div>

									<div className="h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
										<img src="src/images/user/user-10.jpg" alt="user" />
									</div>
								</div>
							</div>

							<div draggable="true" className="task rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
								<div>
									<h4 className="mb-2 text-base text-gray-800 dark:text-white/90">
										Product Update - Q4 2024
									</h4>

									<p className="text-sm text-gray-500 dark:text-gray-400">
										Dedicated form for a category of users that will perform
										actions.
									</p>

									<div className="my-4">
										<img src="src/images/task/task.png" alt="task" className="overflow-hidden rounded-xl border-[0.5px] border-gray-200 dark:border-gray-800" />
									</div>

									<div className="flex items-start justify-between gap-6">
										<div className="flex items-center gap-3">
											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path fill-rule="evenodd" clip-rule="evenodd" d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z" fill=""></path>
												</svg>
												Feb 12, 2027
											</span>

											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="stroke-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M9 15.6343C12.6244 15.6343 15.5625 12.6961 15.5625 9.07178C15.5625 5.44741 12.6244 2.50928 9 2.50928C5.37563 2.50928 2.4375 5.44741 2.4375 9.07178C2.4375 10.884 3.17203 12.5246 4.35961 13.7122L2.4375 15.6343H9Z" stroke="" stroke-width="1.5" stroke-linejoin="round"></path>
												</svg>

												8
											</span>
										</div>

										<div className="h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
											<img src="src/images/user/user-11.jpg" alt="user" />
										</div>
									</div>
								</div>
							</div>

							<div draggable="true" className="task rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
								<div className="flex items-start justify-between gap-6">
									<div>
										<h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
											Make figbot send comment when ticket is auto-moved
											back to inbox
										</h4>

										<div className="flex items-center gap-3">
											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path fill-rule="evenodd" clip-rule="evenodd" d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z" fill=""></path>
												</svg>
												Mar 08, 2027
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
										<img src="src/images/user/user-12.jpg" alt="user" />
									</div>
								</div>
							</div>
						</div>

						<div className="swim-lane flex flex-col gap-5 p-4 xl:p-6">
							<div className="mb-1 flex items-center justify-between">
								<h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
									Completed
									<span className="inline-flex rounded-full bg-success-50 px-2 py-0.5 text-theme-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-500">
										4
									</span>
								</h3>

								<div x-data="{openDropDown: false}" className="relative">
									<button className="text-gray-700 dark:text-gray-400">
										<svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path fill-rule="evenodd" clip-rule="evenodd" d="M5.99902 10.2451C6.96552 10.2451 7.74902 11.0286 7.74902 11.9951V12.0051C7.74902 12.9716 6.96552 13.7551 5.99902 13.7551C5.03253 13.7551 4.24902 12.9716 4.24902 12.0051V11.9951C4.24902 11.0286 5.03253 10.2451 5.99902 10.2451ZM17.999 10.2451C18.9655 10.2451 19.749 11.0286 19.749 11.9951V12.0051C19.749 12.9716 18.9655 13.7551 17.999 13.7551C17.0325 13.7551 16.249 12.9716 16.249 12.0051V11.9951C16.249 11.0286 17.0325 10.2451 17.999 10.2451ZM13.749 11.9951C13.749 11.0286 12.9655 10.2451 11.999 10.2451C11.0325 10.2451 10.249 11.0286 10.249 11.9951V12.0051C10.249 12.9716 11.0325 13.7551 11.999 13.7551C12.9655 13.7551 13.749 12.9716 13.749 12.0051V11.9951Z" fill=""></path>
										</svg>
									</button>
									<div x-show="openDropDown" className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark" style={{ display: 'none' }}>
										<button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
											Edit
										</button>
										<button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
											Delete
										</button>
										<button className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
											Clear All
										</button>
									</div>
								</div>
							</div>

							<div draggable="true" className="task rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
								<div className="flex items-start justify-between gap-6">
									<div>
										<h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
											Manage internal feedback
										</h4>

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
										<img src="src/images/user/user-13.jpg" alt="user" />
									</div>
								</div>
							</div>

							<div draggable="true" className="task rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
								<div className="flex items-start justify-between gap-6">
									<div>
										<h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
											Do some projects on React Native with Flutter
										</h4>

										<div className="flex items-center gap-3">
											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path fill-rule="evenodd" clip-rule="evenodd" d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z" fill=""></path>
												</svg>
												Jan 8, 2027
											</span>
										</div>

										<span className="mt-3 inline-flex rounded-full bg-orange-400/10 px-2 py-0.5 text-theme-xs font-medium text-orange-400">
											Development
										</span>
									</div>

									<div className="h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
										<img src="src/images/user/user-14.jpg" alt="user" />
									</div>
								</div>
							</div>

							<div draggable="true" className="task rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
								<div className="flex items-start justify-between gap-6">
									<div>
										<h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
											Design marketing assets
										</h4>

										<div className="flex items-center gap-3">
											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path fill-rule="evenodd" clip-rule="evenodd" d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z" fill=""></path>
												</svg>
												Jan 8, 2027
											</span>

											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="stroke-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M9 15.6343C12.6244 15.6343 15.5625 12.6961 15.5625 9.07178C15.5625 5.44741 12.6244 2.50928 9 2.50928C5.37563 2.50928 2.4375 5.44741 2.4375 9.07178C2.4375 10.884 3.17203 12.5246 4.35961 13.7122L2.4375 15.6343H9Z" stroke="" stroke-width="1.5" stroke-linejoin="round"></path>
												</svg>

												2
											</span>

											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path fill-rule="evenodd" clip-rule="evenodd" d="M6.88066 3.10905C8.54039 1.44932 11.2313 1.44933 12.8911 3.10906C14.5508 4.76878 14.5508 7.45973 12.8911 9.11946L12.0657 9.94479L11.0051 8.88413L11.8304 8.0588C12.9043 6.98486 12.9043 5.24366 11.8304 4.16972C10.7565 3.09577 9.01526 3.09577 7.94132 4.16971L7.11599 4.99504L6.05533 3.93438L6.88066 3.10905ZM8.88376 11.0055L9.94442 12.0661L9.11983 12.8907C7.4601 14.5504 4.76915 14.5504 3.10942 12.8907C1.44969 11.231 1.44969 8.54002 3.10942 6.88029L3.93401 6.0557L4.99467 7.11636L4.17008 7.94095C3.09614 9.01489 3.09614 10.7561 4.17008 11.83C5.24402 12.904 6.98522 12.904 8.05917 11.83L8.88376 11.0055ZM9.94458 7.11599C10.2375 6.8231 10.2375 6.34823 9.94458 6.05533C9.65169 5.76244 9.17682 5.76244 8.88392 6.05533L6.0555 8.88376C5.7626 9.17665 5.7626 9.65153 6.0555 9.94442C6.34839 10.2373 6.82326 10.2373 7.11616 9.94442L9.94458 7.11599Z" fill=""></path>
												</svg>

												1
											</span>
										</div>

										<span className="mt-3 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-theme-xs font-medium text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
											Marketing
										</span>
									</div>

									<div className="h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
										<img src="src/images/user/user-15.jpg" alt="user" />
									</div>
								</div>
							</div>

							<div draggable="true" className="task rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
								<div className="flex items-start justify-between gap-6">
									<div>
										<h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
											Kanban Flow Manager
										</h4>

										<div className="flex items-center gap-3">
											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path fill-rule="evenodd" clip-rule="evenodd" d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z" fill=""></path>
												</svg>
												Feb 12, 2027
											</span>

											<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
												<svg className="stroke-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M9 15.6343C12.6244 15.6343 15.5625 12.6961 15.5625 9.07178C15.5625 5.44741 12.6244 2.50928 9 2.50928C5.37563 2.50928 2.4375 5.44741 2.4375 9.07178C2.4375 10.884 3.17203 12.5246 4.35961 13.7122L2.4375 15.6343H9Z" stroke="" stroke-width="1.5" stroke-linejoin="round"></path>
												</svg>

												8
											</span>
										</div>

										<span className="mt-3 inline-flex rounded-full bg-success-50 px-2 py-0.5 text-theme-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-500">
											Template
										</span>
									</div>

									<div className="h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
										<img src="src/images/user/user-16.jpg" alt="user" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</Box>
			</Sizing>
		)
	}

}*/