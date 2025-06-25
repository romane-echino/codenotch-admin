import React from 'react';
import './TextInput.scss';
import { Action, IBindableComponentProps } from '@echino/echino.ui.sdk';
import { Sizing } from '../Sizing/Sizing';

interface IAbstractInputProps extends IBindableComponentProps {
    Title?: string;
    Placeholder?: string;
    Value?: string;
    OnChange?: Action<string>;
    Icon?: string;
    Disabled?: boolean;
    Helper?:string;

    Prefix?: React.ReactNode;
    Suffix?: React.ReactNode;
}

export class AbstractInput extends React.Component<IAbstractInputProps, undefined> {

    constructor(props: IAbstractInputProps) {
        super(props);
    }

    render() {
        return (
            <Sizing {...this.props}>
                {this.props.Title &&
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        {this.props.Title}
                    </label>
                }

                <div  className={` cursor-text flex dark:bg-dark-900 h-11 w-full rounded-lg border  bg-transparent  text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 
                    ${true && !this.props.Disabled ? 'border-primary-300 dark:border-primary-800 ring-primary-500/10 ring-3' : 'border-gray-300'}`}>

                    {this.props.Prefix &&
                        <span className="pointer-events-none flex items-center justify-center border-r border-gray-200 py-3 pr-3 pl-3.5  dark:border-gray-800">
                            {this.props.Prefix}
                        </span>
                    }

                    <div className='relative grow'>
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