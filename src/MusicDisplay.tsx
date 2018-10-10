import * as React from 'react';
import { INote, ITriplet, MusicElement, NoteDuration, NoteType, Triplet } from './musicData';
import './MusicDisplay.css';
import { NoteDisplay } from './NoteDisplay';
import { TripletDisplay } from './TripletDisplay';

interface IProps {
    timeSignature: [number, NoteDuration];
    tempo: [NoteDuration, number];
    bars: MusicElement[][];
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

    private renderBar(elements: MusicElement[], key: number) {
        const elementDisplay = elements.map((e, i) => {
            if (e.type === Triplet) {
                const noteDuration = e.duration * 2 / 3 as NoteDuration;
                return <TripletDisplay key={i} noteDuration={noteDuration} notes={(e as ITriplet).notes} />
            }
            else {
                return <NoteDisplay key={i} duration={e.duration} type={(e as INote).type} />
            }
        })

        return (
            <div className="music__bar" key={key}>
                {elementDisplay}
            </div>
        );
    }
}
