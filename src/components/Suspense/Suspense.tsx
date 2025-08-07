import { DeclarationState, IDeclarationListenerProps } from '@echino/echino.ui.sdk';
import React from 'react';
import { AnimatePresence, motion, Reorder } from "framer-motion";

interface ISSuspenseProps extends IDeclarationListenerProps {
    On?:any;
    NoGap?:boolean;
    Gap?:string;
    Overflow?:string;
    IsScrollable?:boolean;
}

interface ISuspenseState{
    suspenseResolved:boolean;
    showLoading:boolean;
}

export class Suspense extends React.Component<ISSuspenseProps, ISuspenseState> {
    mountedAt?:number;
    timeoutRef:any;
    timeoutAfter:number = 300;

	constructor(props: any) {
		super(props);
        this.state = {
            suspenseResolved : Suspense.shouldRender(this.props),
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

    componentWillUpdate(nextProps: Readonly<ISSuspenseProps>, nextState: Readonly<{}>, nextContext: any): void {
        if(this.state.suspenseResolved === true){
            // When suspense is resolved it can restart (auml refresh call on declaration)
            if(Suspense.shouldRender(nextProps) === false){
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
            let suspenseIsResolved = Suspense.shouldRender(nextProps);
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
    static shouldRender(props:ISSuspenseProps){
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
            return null;
        }

        if(this.state.suspenseResolved === false)
            return null;

        return this.props.children
	}
}