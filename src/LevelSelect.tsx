import * as React from 'react';
import { Link } from 'react-router-dom';
import './LevelSelect.css';
import { ILevel } from './musicData';

interface IProps {
    levels: ILevel[];
}

export class LevelSelect extends React.PureComponent<IProps> {
    public render() {
        const levels = this.props.levels.map((l, i) => <Link to={`level/${i+1}`} className="levelSelect__level" key={i}>#<b>{i+1}</b>: {l.name}</Link>);

        return (
        <div className="screen screen--levelSelect">
            <h2>Select a level</h2>
            <div className="levelSelect">
                {levels}
            </div>
        </div>
        );
    }
}
