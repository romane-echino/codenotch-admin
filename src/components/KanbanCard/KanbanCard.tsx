import React from 'react';
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'




interface IKanbanCardProps {
	Source: any;

	Title?: string;
	Due?: string;
	CommentsCount?: string;
	Description?: string;
	ImageUrl?: string;
	UserImageUrl?: string;
	Tags?: string;

}

interface IKanbanCardState {
}

export class KanbanCard extends React.Component<IKanbanCardProps, IKanbanCardState> {

	constructor(props: IKanbanCardProps) {
		super(props);

		this.state = {
		}
	}

	getDuration() {
		var y = dayjs()
		var x = dayjs(this.getData(this.props.Due));

		console.log("x", x);
		console.log("y", y, this.getData(this.props.Due));
		console.log("diff", x.diff(y));
		console.log("diff2", dayjs.duration(x.diff(y)));

		return dayjs.duration(x.diff(y)).locale("fr").humanize(true);
	}

	getData(field: string | undefined) {
		if (field && this.props.Source && this.props.Source[field]) {
			return this.props.Source[field];
		}

		return null;
	}


	getTagColorFromName(name: string) {
		let firstLetter = name.charAt(0).toLowerCase();

		switch (firstLetter) {
			case 'a':
				return 'text-turquoise bg-turquoise/10';
			case 'b':
				return 'text-emerald bg-emerald/10';
			case 'c':
				return 'text-peter-river bg-peter-river/10';
			case 'd':
				return 'text-amethyst bg-amethyst/10';
			case 'e':
				return 'text-wet-asphalt bg-wet-asphalt/10';
			case 'f':
				return 'text-green-sea bg-green-sea/10';
			case 'g':
				return 'text-nephritis bg-nephritis/10';
			case 'h':
				return 'text-belize-hole bg-belize-hole/10';
			case 'i':
				return 'text-wisteria bg-wisteria/10';
			case 'j':
				return 'text-midnight-blue bg-midnight-blue/10';
			case 'k':
				return 'text-sun-flower bg-sun-flower/10';
			case 'l':
				return 'text-carrot bg-carrot/10';
			case 'm':
				return 'text-alizarin bg-alizarin/10';
			case 'n':
				return 'text-gray-500 bg-clouds/10';
			case 'o':
				return 'text-gray-500 bg-silver/10';
			case 'p':
				return 'text-gray-500 bg-concrete/10';
			case 'q':
				return 'text-pumpkin bg-pumpkin/10';
			case 'r':
				return 'text-pomegranate bg-pomegranate/10';
			case 's':
				return 'text-asbestos bg-asbestos/10';
			case 't':
				return 'text-turquoise bg-turquoise/10';
			case 'u':
				return 'text-emerald bg-emerald/10';
			case 'v':
				return 'text-peter-river bg-peter-river/10';
			case 'w':
				return 'text-amethyst bg-amethyst/10';
			case 'x':
				return 'text-wet-asphalt bg-wet-asphalt/10';
			case 'y':
				return 'text-green-sea bg-green-sea/10';
			case 'z':
				return 'text-nephritis bg-nephritis/10';
			default:
				return 'text-gray-500 bg-gray-200/10'; 
		}
	}

	getTags() {

		let tags = this.getData(this.props.Tags);
		if (tags) {
			if (Array.isArray(tags)) {
				return (
					<div className="mt-3 flex flex-wrap gap-2">
						{tags.map((tag: string, index: number) => {
							let color = this.getTagColorFromName(tag);
							return (
								<span key={index} className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
									{tag}
								</span>
							)
						})}
					</div>
				)
			}
			else if( typeof tags === 'string') {
				let color = this.getTagColorFromName(tags);
				return (
					<span className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
						{this.getData(this.props.Tags)}
					</span>)
			}
		}

		return null;
	}

	onDragStart = (e, fromList) => {
    console.log(`what a drag!`)
    const dragInfo = {
      taskId: e.currentTarget.id,
      fromList: fromList
    }
  
    localStorage.setItem('dragInfo', JSON.stringify(dragInfo));
  }

	render() {
		return (
			<div draggable="true" className="task rounded-xl shadow-sm border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5">
				{this.getData(this.props.Title) &&
					<h4 className="mb-2 text-base text-gray-800 dark:text-white/90">
						{this.getData(this.props.Title)}
					</h4>
				}

				{this.getData(this.props.Description) &&
					<p className="text-sm mb-2 text-gray-500 dark:text-gray-400">
						{this.getData(this.props.Description)}
					</p>
				}

				{this.getData(this.props.ImageUrl) &&
					<div className="my-4">
						<img src={this.getData(this.props.ImageUrl)} alt="task" className="overflow-hidden rounded-xl border-[0.5px] border-gray-200 dark:border-gray-800 object-cover" />
					</div>
				}

				<div className="flex items-start justify-between gap-6">
					<div>
						<div className="flex items-center gap-3">
							{this.getData(this.props.Due) &&
								<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
									<i className="far fa-calendar"></i>
									<span>{this.getDuration()}</span>
								</span>
							}

							{this.getData(this.props.CommentsCount) &&
								<span className="flex cursor-pointer items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
									<i className="far fa-comment"></i>

									<span>{this.getData(this.props.CommentsCount)}</span>
								</span>
							}
						</div>


					</div>

					{this.getData(this.props.UserImageUrl) &&
						<div className="h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
							<img src={this.getData(this.props.UserImageUrl)} alt="user" />
						</div>
					}

				</div>

				{this.getData(this.props.Tags) && this.getTags()}
			</div>
		)
	}

}