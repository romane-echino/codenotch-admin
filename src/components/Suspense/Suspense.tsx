import { DeclarationState, IDeclarationListenerProps } from '@echino/echino.ui.sdk';
import React from 'react';
import { AnimatePresence, motion, Reorder } from "framer-motion";

interface ISuspenseStackProps extends IDeclarationListenerProps {
    On?:any;
    NoGap?:boolean;
    Gap?:string;
    Overflow?:string;
    IsScrollable?:boolean;
}

interface ISuspenseStackState{
    suspenseResolved:boolean;
    showLoading:boolean;
}

export class SuspenseStack extends React.Component<ISuspenseStackProps, ISuspenseStackState> {
    mountedAt?:number;
    timeoutRef:any;
    timeoutAfter:number = 300;

	constructor(props: any) {
		super(props);
        this.state = {
            suspenseResolved : SuspenseStack.shouldRender(this.props),
            showLoading : false
        }
    }

    // When suspense isn't resolved on mount
    // Run timeout and store time
    componentDidMount() {
        if(this.state.suspenseResolved === false){
            this.mountedAt = performance.now();
            this.timeoutRef = setTimeout(this.checkTimeout.bind(this), 100);
        }
    }

    // When timeout is reached, change to "loading=true", or recheck further
    checkTimeout(){
        if(this.state.showLoading === true || this.state.suspenseResolved === true)
            return;

        let ellapsed = performance.now() - this.mountedAt!;
        if(ellapsed > this.timeoutAfter){
            this.setState({
                showLoading : true
            });
        }
        else{
            this.timeoutRef = setTimeout(this.checkTimeout.bind(this), 100);
        }
    }

    componentWillUpdate(nextProps: Readonly<ISuspenseStackProps>, nextState: Readonly<{}>, nextContext: any): void {
        if(this.state.suspenseResolved === true){
            // When suspense is resolved it can restart (auml refresh call on declaration)
            if(SuspenseStack.shouldRender(nextProps) === false){
                clearTimeout(this.timeoutRef);
                this.mountedAt = performance.now();
                this.setState({
                    suspenseResolved : false,
                    showLoading : false
                });
            }
            return;
        }
        else{
            let suspenseIsResolved = SuspenseStack.shouldRender(nextProps);
            if(suspenseIsResolved){
                clearTimeout(this.timeoutRef);
                console.log("Suspense Resolved");
                this.setState({
                    suspenseResolved : true,
                    showLoading : false
                });
            }
        }
    }

    // The suspense will show content on some conditions :
    // 1 : 'true' if you pass a boolean
    // 2 : declarations states that are not "loading"
    static shouldRender(props:ISuspenseStackProps){
        let children = (props as any).children as any[];
        if(children.length === 0)
            return false;

        let on = props.On;
        if(on === undefined || on === null)
            return false;

        let renderContent = false;
        if(typeof on === 'string'){
            let value = on.trim();
            if(value === 'true'){
                renderContent = true;
            }
            else{
                let declarationIds = value.split(" ").map(c => c.trim()).filter(c => c !== '');
                let isDeclaration = true;
                let states :DeclarationState[] = [];
                if(declarationIds.length > 0){
                    for(let i = 0;i<declarationIds.length;i++){
                        try{
                            let state = props.getState(declarationIds[i]);
                            states.push(state);
                        }
                        catch{
                            isDeclaration = false;
                            break;
                        }
                    }
                }
                
                if(isDeclaration){
                    renderContent = states.filter(c => c === DeclarationState.LOADING).length === 0;
                }
            }
        }

        return renderContent;
    }

	render() {
        if(this.state.showLoading){
            return <AnimatePresence>
            <motion.div  
                initial={{opacity:0}}
                animate={{opacity:1}}>
                    <div className='flex flex-col items-center my-4'><i className='text-xl fad fa-spinner-third fa-spin text-tint dark:text-tint'/></div>
                </motion.div>
            </AnimatePresence>
        }

        if(this.state.suspenseResolved === false)
            return null;

        let children = this.props.children as any[];
		return <div style={{
            overflow : this.props.Overflow,
            gap : this.props.Gap
        }} className={`grow flex flex-col ${this.props.NoGap === true ? '' : 'gap-2 @3xl:pt-1'} pt-0 h-full`}>
            {children.map((child, index) =>{
                return <AnimatePresence>
                    <motion.div key={index} 
                    initial={{opacity:0, translateX:-10}}
                    animate={{opacity:1, translateX:0}}
                    className={`${index === children.length -1 ? "grow flex flex-col" : 'flex flex-col'} ${this.props.IsScrollable === true ? 'scrollUI' : ''}`}
                    style={{
                        overflow : this.props.Overflow
                    }}
                    transition={{delay:(0.05* index)}}>
                        {child}
                    </motion.div>
                </AnimatePresence>
            })}
        </div>
	}
}