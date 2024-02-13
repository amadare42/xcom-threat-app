import React from "react";

interface Props {
    msg?: MessageData;
    children: () => React.ReactNode;
}

interface State {
    msg?: MessageData;
    endTime: number;
}

export interface MessageData {
    id: any;
    text: string;
    time?: number;
}

export class Message extends React.Component<Props, State> {

    state: State = {
        msg: { id: '', text: '' },
        endTime: 0
    };

    interval: any;

    static getDerivedStateFromProps(props: Props, prev: State): State {
        const prevId = prev && prev.msg ? prev.msg.id : -1;
        const isNew = !prev || (props.msg && props.msg.id !== prevId);
        if (isNew) {
            return {
                endTime: Date.now() + (props.msg!.time || 2000),
                msg: props.msg!
            };
        }
        return prev;
    }

    componentDidMount = () => {
        this.interval = setInterval(() => this.forceUpdate(), 500);
    };

    componentWillUnmount(): void {
        if (this.interval) {
            try {
                clearInterval(this.interval);
            } catch (e) {

            }
        }
    }

    render = () => {
        return (Date.now() < this.state.endTime) && this.state.msg
            ? this.state.msg.text
            : this.props.children();
    }
}
