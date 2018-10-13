import * as React from 'react';
import { Rhythm } from './musicData';
import './RhythmDisplay.css';

interface IProps {
    rhythm: Rhythm;
}

export class RhythmDisplay extends React.PureComponent<IProps> {
    public render() {
        const totalDuration = this.props.rhythm.reduce((tot, val) => tot + val, 0);
        const spaces = this.props.rhythm.map((r, i) => <div className="rhythm__spacer" style={{width: `${r / totalDuration * 100}%`}} key={i} />);

        return (
            <div className="rhythm">
                {spaces}
            </div>
        )
    }
}
