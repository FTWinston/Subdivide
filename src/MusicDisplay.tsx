import * as React from 'react';
import { determineRhythm } from './determineRhythm';
import { INote, NoteLength, NoteType, Tempo, TimeSignature } from './musicData';
import './MusicDisplay.css';
import { NoteDisplay } from './NoteDisplay';

interface IProps {
    timeSignature: TimeSignature;
    tempo: Tempo;
    bars: INote[][];
}

interface IState {
    playing: boolean;
}

export class MusicDisplay extends React.PureComponent<IProps, IState> {
    private timeout: NodeJS.Timer | undefined;

    constructor(props: IProps) {
        super(props);
        this.state = {
            playing: false,
        };
    }

    public render() {
        const bars = this.props.bars.map((b, i) => this.renderBar(b, i));
        const onClick = this.state.playing
            ? () => this.stopRhythm()
            : () => this.playRhythm();

        return (
            <div className="music" onClickCapture={onClick}>
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
        const elementDisplay = elements.map((e, i) => <NoteDisplay key={i} duration={e.length} type={(e as INote).type} />);

        return (
            <div className="music__bar" key={key}>
                {elementDisplay}
            </div>
        );
    }

    private async delay(ms: number) {
        return new Promise( resolve => {
            this.timeout = setTimeout(resolve, ms);
        } );
    }

    private stopRhythm() {
        if (this.timeout !== undefined) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }

        this.setState({
            playing: false,
        });
    }

    private async playRhythm() {
        const rhythm = determineRhythm(this.props.bars, this.props.tempo);
    
        this.setState({
            playing: true,
        });

        const beats = rhythm.beatSeparation.slice();

        if (rhythm.startWithRest) {
            await this.delay(beats.shift()!);
        }

        while (true) {
            const beat = beats.shift();
            if (beat === undefined) {
                break;
            }

            this.beat();
            await this.delay(beat);
        }

        this.setState({
            playing: false,
        });
    }

    private beat() {
        console.log('beat');
    }
}
