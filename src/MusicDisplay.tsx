import * as React from 'react';
import { INote, NoteDuration, NoteType } from './musicData';
import './MusicDisplay.css';
import { NoteDisplay } from './NoteDisplay';

interface IProps {
    timeSignature: [number, NoteDuration];
    tempo: [NoteDuration, number];
    bars: INote[][];
}

export class MusicDisplay extends React.PureComponent<IProps> {
    public render() {
        const bars = this.props.bars.map((b, i) => this.renderBar(b, i));

        return (
            <div className="music">
                {this.renderTempo()}
                {this.renderTimeSignature()}
                {bars}
            </div>
        );
    }

    private renderTempo() {
        return <div className="music__tempo"><NoteDisplay duration={this.props.tempo[0]} type={NoteType.Note} /> = {this.props.tempo[1]}</div>
    }

    private renderTimeSignature() {
        const numBeats = this.props.timeSignature[0];
        const measure = NoteDuration.Semibreve / this.props.timeSignature[1];

        return <div className="music__bar music__bar--timeSignature timeSignature">
            <div className="timeSignature__beats">{numBeats}</div>
            <div className="timeSignature__measure">{measure}</div>
        </div>;
    }

    private renderBar(elements: INote[], key: number) {
        const elementDisplay = elements.map((e, i) => <NoteDisplay key={i} duration={e.duration} type={(e as INote).type} />);

        return (
            <div className="music__bar" key={key}>
                {elementDisplay}
            </div>
        );
    }
}
