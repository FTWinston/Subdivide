import * as React from 'react';
import { Flow as VF } from 'vexflow';
import { INote, NoteLength, NoteType, Tempo, TimeSignature } from './musicData';
import './MusicDisplay.css';

interface IProps {
    timeSignature: TimeSignature;
    tempo: Tempo;
    bars: INote[][];
}

export class MusicDisplay extends React.PureComponent<IProps> {
    private element: HTMLDivElement;
    public render() {
        return <div className="music" ref={e => this.element = e!} />;
    }

    public componentDidMount() {
        this.renderMusic();
    }

    public componentDidUpdate() {
        this.renderMusic();
    }

    private renderMusic() {
        while (this.element.hasChildNodes()) {
            this.element.removeChild(this.element.lastChild!);
        }

        const renderer = new VF.Renderer(this.element, VF.Renderer.Backends.SVG);
        renderer.resize(800,200);

        const context = renderer.getContext() as VF.SVGContext;

        let prevBar: VF.Stave | undefined;
        this.props.bars.map((bar, i) => {
            const barStave = this.createBar(i === this.props.bars.length - 1, prevBar);
            prevBar = barStave;

            const notes = bar.map(note => this.createVfNote(note));

            const voice = new VF.Voice({num_beats: this.props.timeSignature[0], beat_value: NoteLength.Semibreve / this.props.tempo[0]});

            voice.addTickables(notes);

            new VF.Formatter().joinVoices([voice]).format([voice], 400);

            voice.draw(context, barStave);

            barStave.setContext(context).draw();
        });
    }

    private createBar(isLast: boolean, prevBar: VF.Stave | undefined) {
        const barWidth = 400;
        const bar = new VF.Stave(prevBar === undefined ? 10 : barWidth + prevBar.getX(), 40, barWidth);
        bar.setEndBarType(isLast ? VF.Barline.type.DOUBLE : VF.Barline.type.SINGLE);

        if (prevBar === undefined) {
            bar.setBegBarType(VF.Barline.type.NONE);

            const numBeats = this.props.timeSignature[0];
            const measure = NoteLength.Semibreve / this.props.timeSignature[1];
            bar.addTimeSignature(`${numBeats}/${measure}`);

            bar.setTempo({
                bpm: this.props.tempo[1],
                dots: 0,
                duration: (NoteLength.Semibreve / this.props.tempo[0]).toString(),
            }, 0);
        }
        
        return bar;
    }

    private createVfNote(note: INote) {
        let duration: string;
        let pitch: string;

        switch (note.length) {
            case NoteLength.Semibreve:
                duration = 'w'; break;

            case NoteLength.Minim:
                duration = 'h'; break;

            case NoteLength.DottedMinim:
                duration = 'hd'; break;

            // case NoteLength.TripletMinim:
                    
            case NoteLength.Crotchet:
                duration = 'q'; break;

            case NoteLength.DottedCrotchet:
                duration = 'qd'; break;
            
            // case NoteLength.TripletCrotchet:
                    
            case NoteLength.Quaver:
                duration = '8'; break;

            case NoteLength.DottedQuaver:
                duration = '8d'; break;

            // case NoteLength.TripletQuaver:
            
            case NoteLength.Semiquaver:
                duration = '16'; break;
            case NoteLength.DottedSemiquaver:
                duration = '16d'; break;
            
            // case NoteLength.TripletSemiquaver:

            default:
                duration = ''; break;
        }

        if (note.type === NoteType.Rest) {
            pitch = 'b/4';
            duration += 'r';
        }
        else {
            pitch = 'g/4';
        }

        return new VF.StaveNote({clef: 'treble', keys: [pitch], duration });
    }
}
