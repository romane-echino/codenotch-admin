import React from 'react';
import { Action } from '@echino/echino.ui.sdk';
import { Sizing } from '../Sizing/Sizing';
import { Helper } from './Helper';
import { Markdown } from '../Markdown/Markdown';

export interface IAbstractInputProps extends IInputProps {
    Focus?: boolean;
    Error?: boolean;
    ErrorText?: string;
    DisabledSizing?: boolean;
    Dashed?: boolean;
    Full?:boolean;
}

export interface IAbstractListAction {
    value: any,
    index: number
}

export interface IInputProps {
    Title?: string;
    Subtitle?: string;
    Placeholder?: string;
    Value?: string | number;
    OnChange?: Action<any>;
    OnSelect?: Action<IAbstractListAction>;
    Icon?: string;
    Disabled?: boolean;
    Helper?: string;

    Prefix?: React.ReactNode;
    Suffix?: React.ReactNode;
}

interface IAbstractInputState {
    focused: boolean;
    error: boolean;
}

export class AbstractInput extends React.Component<IAbstractInputProps, IAbstractInputState> {

    constructor(props: IAbstractInputProps) {
        super(props);
        this.state = {
            focused: false,
            error: false
        };
    }


    componentDidUpdate(prevProps: Readonly<IAbstractInputProps>, prevState: Readonly<IAbstractInputState>, snapshot?: any): void {
        if (this.props.Focus !== prevProps.Focus) {
            this.setState({ focused: this.props.Focus || false });
        }
        else if (this.props.Error !== prevProps.Error) {
            this.setState({ error: this.props.Error || false });
        }
    }


    getComponent() {
        return (
            <>
            <AbstractInputTitle {...this.props} />


                <div className={`flex min-h-11 w-full ${this.props.Full?'':'rounded-lg border'} ${this.props.Disabled?'opacity-50 pointer-events-none':''}  bg-transparent text-sm dark:bg-gray-900 text-gray-800 dark:text-white/90 
               
                    ${this.props.Dashed ? 'border-dashed' : 'border-solid'}
                    ${this.state.error ? 'border-alizarin dark:border-alizarin ring-alizarin/10 ring-3' :
                        (this.state.focused ? 'border-primary ring-primary/10 ring-3 z-10' :
                            'border-gray-300 dark:border-gray-700')}`}>

                    {this.props.Prefix &&
                        <span className="flex items-center justify-center pointer-events-none select-none border-r border-gray-200 pr-3 pl-3.5  dark:border-gray-800">
                            {this.props.Prefix}
                        </span>
                    }

                    <div className='relative grow group flex items-center '>
                        {this.props.Icon &&
                            <span className="absolute min-w-4 flex items-center justify-center pointer-events-none left-3 top-1/2 -translate-y-1/2">
                                <i className={`${this.props.Icon} text-gray-500 dark:text-gray-400`}></i>
                            </span>
                        }

                        {this.props.children}
                    </div>

                    {this.props.Suffix &&
                        <span className="flex items-center justify-center pointer-events-none select-none border-l border-gray-200 pl-3 pr-3.5  dark:border-gray-800">
                            {this.props.Suffix}
                        </span>
                    }
                </div>


                {this.state.error && this.props.ErrorText &&
                    <div className='mt-1 text-xs text-alizarin dark:text-alizarin'>
                        <Markdown Type='Error'>{this.props.ErrorText}</Markdown>
                    </div>
                }
            </>
        )
    }

    render() {
        if (this.props.DisabledSizing) {
            return (
                <div>
                    {this.getComponent()}
                </div>
            )
        }
        return (
            <Sizing {...this.props} Containered={true}>
                {this.getComponent()}
            </Sizing>
        )
    }

}


export const AbstractInputTitle = (props: { Title?: string, Subtitle?: string, Helper?: React.ReactNode }) => {
    return (
        <div className='flex justify-between'>
            <div>
                {props.Title &&
                    <label className={`${props.Subtitle ? '' : 'mb-1.5'} block text-sm font-medium text-gray-700 dark:text-gray-400`}>
                        {props.Title}
                    </label>
                }

                {props.Subtitle &&
                    <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-500">
                        {props.Subtitle}
                    </label>
                }
            </div>

            {props.Helper &&
                <Helper>
                    {props.Helper}
                </Helper>
            }
        </div>
    )
}