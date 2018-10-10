import * as React from 'react';
import { INote, ITriplet, MusicElement, NoteDuration, Triplet } from './musicData';
import './MusicDisplay.css';
import { NoteDisplay } from './NoteDisplay';
import { TripletDisplay } from './TripletDisplay';

interface IProps {
    timeSignature: [NoteDuration, number];
    tempo: [NoteDuration, number];
    bars: MusicElement[][];
}

export class MusicDisplay extends React.PureComponent<IProps> {
    public render() {
        const bars = this.props.bars.map((b, i) => this.renderBar(b, i));

        return (
            <div className="music">
                <div className="music__tempo" data-beat={this.props.tempo[0]}>{this.props.tempo[1]}</div>
                <div className="music__timeSignature timeSignature">
                    <div className="timeSignature__beats">{this.props.timeSignature[0]}</div>
                    <div className="timeSignature__measure">{this.props.timeSignature[1]}</div>
                </div>

                {bars}
            </div>
        );
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
