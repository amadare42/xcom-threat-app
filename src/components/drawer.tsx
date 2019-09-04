import React, { MouseEvent, ReactNode } from 'react';
import { IoIosArrowDown, IoIosArrowUp, IoIosRefresh, IoIosRemoveCircleOutline, IoIosStarOutline } from 'react-icons/io';
import './drawer.css';
import { Play } from '../App';

interface DrawerItem {
    id: string;
    render: (state: DrawerState) => ReactNode;
    onActivate: ((state: DrawerState) => void) | 'toggle';
}

const items: DrawerItem[] = [
    {
        id: 'reset',
        render: () => <IoIosRefresh/>,
        onActivate: ({ actions: { onReset } }) => onReset()
    },
    { id: 'decrease', render: () => <IoIosRemoveCircleOutline/>, onActivate: ({ actions: { onDecrease } }) => onDecrease() },
    { id: 'graphics', render: () => <IoIosStarOutline/>, onActivate: ({ actions: { toggleGraphics } }) => toggleGraphics() },
    {
        id: 'show',
        render: ({ isOpen }) => {
            return isOpen ? <IoIosArrowUp/> : <IoIosArrowDown/>;
        },
        onActivate: 'toggle'
    },
];

interface Actions {
    onReset: () => void;
    onDecrease: () => void;
    toggleGraphics: () => void;
}

interface Props {
    play: Play;
    actions: Actions;
}

interface State {
    isOpen: boolean;
}

interface DrawerState {
    isOpen: boolean;
    actions: Actions;
}

export class Drawer extends React.Component<Props, State> {

    state: State = {
        isOpen: true
    };

    render = () => {
        const { isOpen } = this.state;
        return <div className={ 'Drawer-container' }>
            {
                items.map((item, idx) => {
                    let angle = 360 * ((idx + 1) / items.length);
                    if (angle > 180) angle = -(360 - angle);

                    if (angle < 180) {
                        angle /= 2;
                    } else if (angle > 180) {
                        angle = 180;
                    }
                    let parentStyle = isOpen ? { transform: `rotateZ(${ angle }deg)` } : {
                        transform: `rotateZ(0deg)`,
                        opacity: 0
                    };
                    const itemAngle = angle > 0 ? angle : 360 - angle;
                    const itemStyle = isOpen ? { transform: `rotateZ(${ itemAngle }deg)` } : undefined;
                    if (idx === items.length - 1) {
                        parentStyle.opacity = 1;
                    }
                    return <div className={ 'Drawer-itemParent' } key={ item.id } style={ parentStyle }>
                        <div className={ 'Drawer-item' } data-id={ item.id } onClick={ this.onActivate }>
                            <div style={ itemStyle }>
                                { item.render({ isOpen, actions: this.props.actions }) }
                            </div>
                        </div>
                    </div>
                })
            }
        </div>;
    };

    private onActivate = (evt: MouseEvent<HTMLDivElement>) => {
        evt.stopPropagation();
        const id = evt.currentTarget.getAttribute('data-id');
        const item = items.find(it => it.id === id);
        if (!item) return;
        if (item.onActivate === 'toggle') {
            this.toggle();
        } else {
            item.onActivate({ isOpen: this.state.isOpen, actions: this.props.actions });
        }
    };

    private toggle = () => {
        if (this.state.isOpen) {
            this.props.play('hudOff');
        } else {
            this.props.play('hudOn');

        }
        this.setState({ isOpen: !this.state.isOpen });
    }
}
