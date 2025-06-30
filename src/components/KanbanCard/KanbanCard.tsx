import React from 'react';
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { getColorFromName } from '../../utils/DefaultColorPalette';
import { CSS } from "@dnd-kit/utilities";
import { Id } from '../Kanban/Kanban';
import { useSortable } from '@dnd-kit/sortable';


export type ICardProps = {
	CardId: Id;
	ColumnId: Id;


	Title?: string;
	Due?: string;
	CommentsCount?: string;
	Description?: string;
	ImageUrl?: string;
	UserImageUrl?: string;
	Tags?: string;
}

export const KanbanCard: React.FC<ICardProps> = ({ CardId, ColumnId, Title, Due, Tags, Description, CommentsCount, ImageUrl, UserImageUrl }) => {
	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: CardId,
		data: { type: "Card", card: { CardId, ColumnId, Title, Due, Tags, Description, CommentsCount, ImageUrl, UserImageUrl } },
	});

	const style = {
		transition,
		transform: CSS.Translate.toString(transform)
	};


	function getDuration() {
		var y = dayjs()
		var x = dayjs(Due);

		console.log("x", x);
		console.log("y", y, Due);
		console.log("diff", x.diff(y));
		console.log("diff2", dayjs.duration(x.diff(y)));

		return dayjs.duration(x.diff(y)).locale("fr").humanize(true);
	}


	function getTags() {
		if (Tags) {
			if (Array.isArray(Tags)) {
				return (
					<div className="mt-3 flex flex-wrap gap-2">
						{Tags.map((tag: string, index: number) => {
							let color = getColorFromName(tag);
							return (
								<span key={index} className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
									{tag}
								</span>
							)
						})}
					</div>
				)
			}
			else if (typeof Tags === 'string') {
				let color = getColorFromName(Tags);
				return (
					<span className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
						{Tags}
					</span>)
			}
		}

		return null;
	}


	return (
		<div {...attributes} {...listeners}
			ref={setNodeRef} style={style}
			className="rounded-xl shadow-sm border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5">

			{CardId} / {ColumnId}

			{Title &&
				<h4 className="mb-2 text-base text-gray-800 dark:text-white/90">
					{Title}
				</h4>
			}

			{Description &&
				<p className="text-sm mb-2 text-gray-500 dark:text-gray-400">
					{Description}
				</p>
			}

			{ImageUrl &&
				<div className="my-4">
					<img src={ImageUrl} alt="task" className="overflow-hidden rounded-xl border-[0.5px] border-gray-200 dark:border-gray-800 object-cover" />
				</div>
			}

			<div className="flex items-start justify-between gap-6">
				<div>
					<div className="flex items-center gap-3">
						{Due &&
							<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
								<i className="far fa-calendar"></i>
								<span>{getDuration()}</span>
							</span>
						}

						{CommentsCount &&
							<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
								<i className="far fa-comment"></i>
								<span>{CommentsCount}</span>
							</span>
						}
					</div>


				</div>

				{UserImageUrl &&
					<div className="h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
						<img src={UserImageUrl} alt="user" />
					</div>
				}

			</div>

			{Tags && getTags()}
		</div>
	);
}