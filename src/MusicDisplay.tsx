import * as React from 'react';
import { Flow as VF } from 'vexflow';
import { INote, NoteLength, NoteType, Tempo, TimeSignature } from './musicData';
import './MusicDisplay.css';

interface IProps {
    timeSignature: TimeSignature;
    tempo: Tempo;
    bars: INote[][];
}

const barWidth = 400;
const barSpacing = 100;
const firstBarX = 0;

export class MusicDisplay extends React.PureComponent<IProps> {
    private element: HTMLDivElement;

    public render() {
        return <div className="music" ref={e => this.element = e!} />;
    }

    public componentDidMount() {
        this.renderMusic();

        window.addEventListener('resize', this.resizeHandler);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler);
    }

    public componentDidUpdate() {
        this.renderMusic();
    }

    private resizeHandler = () => this.renderMusic();
    
    private renderMusic() {
        while (this.element.hasChildNodes()) {
            this.element.removeChild(this.element.lastChild!);
        }

        const renderer = new VF.Renderer(this.element, VF.Renderer.Backends.SVG);

        const barsWide = this.sizeToFit(renderer);
        let positionInRow = 0;

        const context = renderer.getContext();

        let prevBar: VF.Stave | undefined;
        this.props.bars.map((bar, i) => {
            const barStave = this.createBar(i === this.props.bars.length - 1, prevBar, positionInRow++ === 0);

            prevBar = barStave;
            if (positionInRow >= barsWide) {
                positionInRow = 0;
            }

            const notes = bar.map(note => this.createVfNote(note));

            const voice = new VF.Voice({num_beats: this.props.timeSignature[0], beat_value: NoteLength.Semibreve / this.props.tempo[0]});

            voice.setStrict(false);
            voice.addTickables(notes);

            new VF.Formatter()
                .joinVoices([voice])
                .format([voice], 400);

            voice.draw(context, barStave);

            this.drawTriplets(barStave, context, notes, bar);
        });
    }

    private sizeToFit(renderer: VF.Renderer) {
        const availableWidth = window.innerWidth - 40;
        const numBars = this.props.bars.length;

        const barsWide = Math.min(numBars, Math.floor(availableWidth / barWidth));
        const rowsHigh = Math.ceil(numBars / barsWide);

        const width = Math.min(barsWide * barWidth, availableWidth) + 10;
        const height = rowsHigh * barSpacing + 60;

        renderer.resize(width, height);

        return barsWide;
    }

    private createBar(isLast: boolean, prevBar: VF.Stave | undefined, wrapLine: boolean) {
        let bar;

        if (prevBar === undefined) {
            bar = new VF.Stave(firstBarX, 40, barWidth);
            
            bar.setBegBarType(VF.Barline.type.NONE);

            const numBeats = this.props.timeSignature[0];
            const measure = NoteLength.Semibreve / this.props.timeSignature[1];
            bar.addTimeSignature(`${numBeats}/${measure}`, 25);

            bar.setTempo({
                bpm: this.props.tempo[1],
                dots: 0,
                duration: (NoteLength.Semibreve / this.props.tempo[0]).toString(),
            }, -10);
        }
        else {
            let x = barWidth + prevBar.getX();
            let y = prevBar.getBottomY() - 130;

            if (wrapLine) {
                x = firstBarX;
                y += barSpacing;
            }

            bar = new VF.Stave(x, y, barWidth);
        }
        
        bar.setEndBarType(isLast ? VF.Barline.type.DOUBLE : VF.Barline.type.SINGLE);
        
        return bar;
    }

    private createVfNote(note: INote) {
        let duration: string;
        let pitch: string;

        switch (note.length) {
            case NoteLength.Semibreve:
                duration = '1'; break;

            case NoteLength.Minim:
            case NoteLength.TripletMinim:
            case NoteLength.DottedMinim:
                duration = '2'; break;

            case NoteLength.Crotchet:
            case NoteLength.TripletCrotchet:
            case NoteLength.DottedCrotchet:
                duration = '4'; break;

            case NoteLength.Quaver:
            case NoteLength.TripletQuaver:
            case NoteLength.DottedQuaver:
                duration = '8'; break;

            case NoteLength.Semiquaver:
            case NoteLength.TripletSemiquaver:
            case NoteLength.DottedSemiquaver:
                duration = '16'; break;

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

        const staveNote = new VF.StaveNote({clef: 'treble', keys: [pitch], duration });

        switch (note.length) {
            case NoteLength.DottedMinim:
            case NoteLength.DottedCrotchet:
            case NoteLength.DottedQuaver:
            case NoteLength.DottedSemiquaver:
                staveNote.addDotToAll();
                break;
        }

        return staveNote;
    }

    private drawTriplets(barStave: VF.Stave, context: Vex.IRenderContext, notes: VF.StaveNote[], bar: INote[]){ 
        let tuplet: VF.StaveNote[] = [];

        for (let iNote = 0; iNote < notes.length; iNote++) {
            const beatLength = bar[iNote].length;
            if (beatLength !== NoteLength.TripletMinim
                && beatLength !== NoteLength.TripletCrotchet
                && beatLength !== NoteLength.TripletQuaver
                && beatLength !== NoteLength.TripletSemiquaver) {
                continue;
            }
                
            tuplet.push(notes[iNote]);

            if (tuplet.length === 3) {
                const triplet = new VF.Tuplet(tuplet);
                triplet
                    .setContext(context)
                    .draw();

                tuplet = [];
            }
        }

        barStave.setContext(context).draw();
    }
}
