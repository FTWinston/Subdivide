import * as React from 'react';
import { INote, NoteLength, NoteType, Tempo, TimeSignature } from './musicData';
import './MusicDisplay.css';
import { NoteDisplay } from './NoteDisplay';
interface IProps {
    timeSignature: TimeSignature;
    tempo: Tempo;
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
        const measure = NoteLength.Semibreve / this.props.timeSignature[1];

        return <div className="music__bar music__bar--timeSignature timeSignature">
            <div className="timeSignature__beats">{numBeats}</div>
            <div className="timeSignature__measure">{measure}</div>
        </div>;
    }

    private renderBar(elements: INote[], key: number) {
        let lastLength = 0;
        let groupPos = 0;
        
        const elementDisplay = elements.map((e, i) => {
            if (e.length === lastLength) {
                groupPos ++;
            }
            else {
                lastLength = e.length;
                groupPos = 1;
            }

            return <NoteDisplay key={i} duration={e.length} type={e.type} groupPos={groupPos} />
        });

        return (
            <div className="music__bar" key={key}>
                {elementDisplay}
            </div>
        );
    }
}
