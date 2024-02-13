import React from "react";

interface Props {
    start?: Date;
    children: (seconds: number) => React.ReactNode;
}

export class Timer extends React.Component<Props> {

    private interval?: any;

    render = () => {
        const { start, children } = this.props;
        if (!start) return null;
        return children(Math.floor((Date.now() - start.getTime()) / 1000));
    };

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
}
