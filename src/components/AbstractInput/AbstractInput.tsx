import React from 'react';
import { Action } from '@echino/echino.ui.sdk';
import { Sizing } from '../Sizing/Sizing';

export interface IAbstractInputProps extends IInputProps {
    Focus: boolean;
}

export interface IAbstractListAction{
   value:any, 
   index: number
}

export interface IInputProps{
    Title?: string;
    Placeholder?: string;
    Value?: string;
    OnChange?: Action<any>;
    OnSelect?: Action<IAbstractListAction>;
    Icon?: string;
    Disabled?: boolean;
    Helper?:string;

    Prefix?: React.ReactNode;
    Suffix?: React.ReactNode;
}

interface IAbstractInputState{
    focused: boolean;
}

export class AbstractInput extends React.Component<IAbstractInputProps, IAbstractInputState> {

    constructor(props: IAbstractInputProps) {
        super(props);
        this.state = {
            focused: false
        };
    }


componentDidUpdate(prevProps: Readonly<IAbstractInputProps>, prevState: Readonly<IAbstractInputState>, snapshot?: any): void {
    if (this.props.Focus !== prevProps.Focus) {
        this.setState({ focused: this.props.Focus });
    }
}

    render() {
        return (
            <Sizing {...this.props} Containered={true}>
                {this.props.Title &&
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        {this.props.Title}
                    </label>
                }

                <div  className={` cursor-text flex dark:bg-dark-900 min-h-11 w-full rounded-lg border  bg-transparent  text-sm   dark:bg-gray-900 text-gray-800 dark:text-white/90 
                    ${this.state.focused && !this.props.Disabled ? 'border-primary-300 dark:border-primary-800 ring-primary-500/10 ring-3' : 'border-gray-300 dark:border-gray-700'}`}>

                    {this.props.Prefix &&
                        <span className="pointer-events-none flex items-center justify-center border-r border-gray-200 py-3 pr-3 pl-3.5  dark:border-gray-800">
                            {this.props.Prefix}
                        </span>
                    }

                    <div className='relative grow group'>
                        {this.props.Icon &&
                            <span className="absolute pointer-events-none left-3 top-1/2 -translate-y-1/2">
                                <i className={`${this.props.Icon} text-gray-500 dark:text-gray-400`}></i>
                            </span>
                        }

                        {this.props.children}
                    </div>

                    {this.props.Suffix &&
                        <span className="pointer-events-none flex items-center justify-center border-l border-gray-200 py-3 pl-3 pr-3.5  dark:border-gray-800">
                            {this.props.Suffix}
                        </span>
                    }
                </div>
            </Sizing>
        )
    }

}