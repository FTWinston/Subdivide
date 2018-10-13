import * as React from 'react';
import './LevelSelect.css';
import { ILevel } from './musicData';

interface IProps {
    levels: ILevel[];
    onSelect: (level: ILevel) => void;
}

export class LevelSelect extends React.PureComponent<IProps> {
    public render() {
        const levels = this.props.levels.map((l, i) => {
            const selected = () => this.props.onSelect(l);
            return <li className="levelSelect__level" key={i} onClick={selected}>#<b>{i}</b>: {l.name}</li>
        });

        return (
        <div className="screen screen--levelSelect">
            <h2>Select a level</h2>
            <ul className="levelSelect">
                {levels}
            </ul>
        </div>
        );
    }
}
