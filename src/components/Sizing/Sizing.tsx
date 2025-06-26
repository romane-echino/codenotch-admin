import React from 'react';
import { IPageInheritedProps } from '../Page/Page';

interface ISizingProps extends IPageInheritedProps {
    Containered?: boolean;
}
interface ISizingState {
}

export class Sizing extends React.Component<ISizingProps, ISizingState> {

    constructor(props: ISizingProps) {
        super(props);

        this.state = {
        }
    }

    render() {
        let classes = '';
        if (this.props.Containered) {
           switch (this.props.ColSpan) {
            case '1/2': classes += 'col-span-12 @xl:col-span-6'; break;
            case '1/3': classes += 'col-span-12 @xl:col-span-4'; break;
            case '2/3': classes += 'col-span-12 @xl:col-span-8'; break;
            case '3/4': classes += 'col-span-12 @xl:col-span-9'; break;
            case '1/4': classes += 'col-span-12 @xl:col-span-3'; break;
            case 'full': classes += 'col-span-12'; break;
            default: classes += 'col-span-12 '; break;
        }
        }else{
            switch (this.props.ColSpan) {
            case '1/2': classes += 'col-span-12 xl:col-span-6'; break;
            case '1/3': classes += 'col-span-12 xl:col-span-4'; break;
            case '2/3': classes += 'col-span-12 xl:col-span-8'; break;
            case '3/4': classes += 'col-span-12 xl:col-span-9'; break;
            case '1/4': classes += 'col-span-12 xl:col-span-3'; break;
            case 'full': classes += 'col-span-12'; break;
            default: classes += 'col-span-12 '; break;
        }
        }

        let style: React.CSSProperties = {};
        if (this.props.RowSpan) {
            style.gridRow = `span ${this.props.RowSpan}`;
        }

        return (
            <div className={`${classes}`} style={style}>
                {this.props.children}
            </div>
        )
    }

}