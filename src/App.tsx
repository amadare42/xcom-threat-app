import React, { Component } from 'react';
import './App.css';
import { Timer } from './components/timer';
import { Drawer } from './components/drawer';
import { Helmet } from 'react-helmet';
import { Message, MessageData } from './components/message';

const colors = ['#282c34', '#364d59', '#595536', '#ba732d', '#850D04'];

interface State {
    threat: number;
    lastUpdate?: Date;
    prev?: number;
    graphicsLevel: number;
    message?: MessageData;
}

interface Props {

}

const sounds = {
    reset: new Audio('/sounds/ChatSend.ogg'),
    tap: new Audio('/sounds/MenuSelect.ogg'),
    hudOn: new Audio('/sounds/HUDOn.ogg'),
    hudOff: new Audio('/sounds/HudOff.ogg'),
    cancel: new Audio('/sounds/MenuCancel.ogg')
};

function play(sound: keyof typeof sounds) {
    sounds[sound].currentTime = 0;
    sounds[sound].play();
}

export type Play = typeof play;

let msgIndex = 0;

class App extends Component<Props, State> {

    prevThreatRef = React.createRef<HTMLParagraphElement>();
    threatRef = React.createRef<HTMLParagraphElement>();
    state: State = {
        threat: 1,
        graphicsLevel: parseInt(localStorage.getItem('graphics')!) || 2
    };

    renderGraphicsHelmet = (graphicsLevel: number) => {
        if (graphicsLevel === 1) {
            return <Helmet>
                <link rel="stylesheet" href="/App.low.css" data-id={ 'low-styles' }/>
            </Helmet>;
        }
        return <Helmet>
            <link rel="stylesheet" href="/App.high.css" data-id={ 'high-styles' }/>
            { graphicsLevel === 3 ? <link rel="stylesheet" href="/App.max.css" data-id={ 'max-styles' }/> : null }
        </Helmet>
    };

    render() {
        document.documentElement.style.setProperty('--danger-border-color', colors[this.state.threat - 1]);
        return (
            <div className="App">
                { this.renderGraphicsHelmet(this.state.graphicsLevel) }
                <header className="App-header" onClick={ this.onTap }>
                    <Drawer play={ play } actions={ {
                        onDecrease: this.decrease,
                        onReset: this.reset,
                        toggleGraphics: this.toggleGraphics
                    } }/>
                    <p className={ 'App-threat' } ref={ this.threatRef } data-text={ this.state.threat }
                       key={ this.state.threat + 'p' }> { this.state.threat } </p>
                    <p className={ 'App-threat' } ref={ this.prevThreatRef } data-text={ this.state.prev }
                       key={ this.state.prev + 'c' }> { this.state.prev } </p>

                    <p className={ 'time-ago' }>
                        <Message msg={this.state.message} >
                            {() => <Timer start={ this.state.lastUpdate }>
                                { (seconds) => seconds >= 3 ? `${ seconds } secs ago` : null }
                            </Timer>}
                        </Message>
                    </p>

                </header>
            </div>
        );
    }

    componentDidMount(): void {
        this.threatRef.current!.classList.add('App-threat-appear');
        document.addEventListener('touchstart', (evt) => {
            if (evt.touches.length === 2) {
                this.reset();
            }
        }, false);
    }

    componentDidUpdate(): void {
        this.threatRef.current!.classList.add('App-threat-appear');
        this.prevThreatRef.current!.classList.add('App-threat-disappear');
    }

    private onTap = () => {
        play('tap');
        let threat = this.state.threat;
        if (threat++ >= 5) {
            threat = 1;
        }
        this.setState({ threat, prev: this.state.threat, lastUpdate: new Date() });
    };

    private decrease = () => {
        play('cancel');
        let next = this.state.threat - 1;
        if (next <= 0) next = 1;
        this.setState({ threat: next, prev: this.state.threat, lastUpdate: new Date() });
        this.addMessage('decreased threat');
    };

    private toggleGraphics = () => {
        let { graphicsLevel } = this.state;
        if (++graphicsLevel > 3) {
            graphicsLevel = 1;
        }
        const presets: { [n: number]: string } = {
            1: 'low',
            2: 'med',
            3: 'max'
        };
        play('cancel');
        this.setState({ graphicsLevel });
        localStorage.setItem('graphics', graphicsLevel.toString());
        this.addMessage(`Graphics: ${ presets[graphicsLevel] }`);
    };

    private addMessage = (message: string, timeout: number = 2000) => {
        this.setState({
            message: {
                text: message,
                id: ++msgIndex,
                time: timeout
            }
        });
    };

    private reset = () => {
        play('reset');
        navigator.vibrate([10, 30, 20, 10]);
        this.setState({ threat: 1, prev: this.state.threat, lastUpdate: new Date() });
        this.addMessage('reset');
    }
}

export default App;
