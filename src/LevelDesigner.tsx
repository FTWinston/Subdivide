import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { loadCustomLevel, saveCustomLevel } from './customLevels';
import { ErrorBoundary } from './ErrorBoundary';
import './LevelDesigner.css';
import { IMusic, NoteLength, NoteType } from './musicData';
import { MusicDisplay } from './MusicDisplay';

interface IProps {
    loadData?: string;
}

interface IState extends IMusic {
    navigateUrl?: string;
    remainingTicksInBar: number;
}

export class LevelDesigner extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        if (props.loadData === undefined) {
            this.state = {
                bars: [[]],
                name: 'Custom rhythm',
                remainingTicksInBar: 4 * NoteLength.Crotchet,
                tempo: [NoteLength.Crotchet, 80],
                timeSignature: [4, NoteLength.Crotchet],
            };
        }
        else {
            const level = loadCustomLevel(props.loadData);
            this.state = {
                bars: level.bars,
                name: level.name,
                remainingTicksInBar: level.timeSignature[0] * level.timeSignature[1],
                tempo: level.tempo,
                timeSignature: level.timeSignature,
            }
        }
    }
    
    public render() {
        if (this.state.navigateUrl !== undefined) {
            return <Redirect to={this.state.navigateUrl} push={true} />
        }

        const timeSigBeatNumbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
            .map(i => <option key={i} value={i}>{i}</option>);
            
        const timeSigNumberChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newVal = parseInt(e.target.value, 10);

            this.setState({
                remainingTicksInBar: newVal * this.state.timeSignature[1],
                timeSignature: [newVal, this.state.timeSignature[1]],
            });
        }

        const timeSigLengthChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newVal = parseInt(e.target.value, 10);
            
            this.setState({
                remainingTicksInBar: this.state.timeSignature[0] * newVal,
                timeSignature: [this.state.timeSignature[0], newVal],
            });
        }
        
        const tempoNumberChanged = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
            tempo: [this.state.tempo[0], parseInt(e.target.value, 10)],
        });
        const tempoLengthChanged = (e: React.ChangeEvent<HTMLSelectElement>) => this.setState({
            tempo: [parseInt(e.target.value, 10), this.state.tempo[1]],
        });

        const visitLevel = () => this.visitLevel();
        return (
            <div className="screen screen--designer">
                <h2>Custom rhythm</h2>
                <p>
                    Select a time signature, enter a rhythm, and pick a tempo.
                    <br/>Play it / save it / share it!
                </p>
                <div className="configuration">
                    <h3>Time signature</h3>
                    <select value={this.state.timeSignature[0]} onChange={timeSigNumberChanged}>
                        {timeSigBeatNumbers}
                    </select>
                    <select value={this.state.timeSignature[1]} onChange={timeSigLengthChanged}>
                        <option value={NoteLength.Semibreve}>semibreve</option>
                        <option value={NoteLength.Minim}>minim</option>
                        <option value={NoteLength.Crotchet}>crotchet</option>
                        <option value={NoteLength.Quaver}>quaver</option>
                        <option value={NoteLength.Semiquaver}>semiquaver</option>
                    </select>
                    &nbsp;beats per bar
                </div>
                <div className="configuration">
                    <h3>Tempo</h3>

                    <input type="number" style={{width: '3em'}} value={this.state.tempo[1]} onChange={tempoNumberChanged} />
                    
                    <select value={this.state.tempo[0]} onChange={tempoLengthChanged}>
                        <option value={NoteLength.Semibreve}>semibreves</option>
                        <option value={NoteLength.Minim}>minims</option>
                        <option value={NoteLength.Crotchet}>crotchets</option>
                        <option value={NoteLength.Quaver}>quavers</option>
                        <option value={NoteLength.Semiquaver}>semiquavers</option>
                    </select>
                    &nbsp;per minute
                </div>
                <div className="configuration configuration--addNotes">
                    <h3>Add notes</h3>
                    <div className="content">
                        {this.renderNoteButtons('Semibreve', NoteLength.Semibreve)}
                        {this.renderNoteButtons('Minim', NoteLength.Minim, NoteLength.DottedMinim, NoteLength.TripletMinim)}
                        {this.renderNoteButtons('Crotchet', NoteLength.Crotchet, NoteLength.DottedCrotchet, NoteLength.TripletCrotchet)}
                        {this.renderNoteButtons('Quaver', NoteLength.Quaver, NoteLength.DottedQuaver, NoteLength.TripletQuaver)}
                        {this.renderNoteButtons('Semiquaver', NoteLength.Semiquaver, NoteLength.DottedSemiquaver, NoteLength.TripletSemiquaver)}
                    </div>
                </div>
                
                <ErrorBoundary>
                    <MusicDisplay
                        bars={this.state.bars}
                        tempo={this.state.tempo}
                        timeSignature={this.state.timeSignature}
                    />
                </ErrorBoundary>

                
                <div className="actions">
                    <a href="" onClick={visitLevel}>Play level</a>
                    <Link to="/">Back to menu</Link>
                </div>
            </div>
        )
    }

    private visitLevel() {
        const gameID = saveCustomLevel(this.state);

        this.setState({
            navigateUrl: `/custom/${gameID}`,
        });
    }

    private addNote(length: NoteLength, type: NoteType) {
        const bars = this.state.bars.slice();
        let lastBar = bars[bars.length - 1];

        // check if this would make the bar too long. If so, add a new bar.
        const currentBarTicks = lastBar.reduce((tot, note) => tot + note.length, 0);
        const targetTicks = this.state.timeSignature[0] * this.state.timeSignature[1];

        if (currentBarTicks + length > targetTicks) {
            lastBar = [];
            bars.push(lastBar);
        }

        lastBar.push({
            length,
            type,
        });

        const remainingTicks = this.state.remainingTicksInBar - length
        
        this.setState({
            bars,
            remainingTicksInBar: remainingTicks <= 0
                ? this.state.timeSignature[0] * this.state.timeSignature[1]
                : remainingTicks,
        });
    }
    
    private renderNoteButtons(name: string, normalLength: NoteLength, dottedLength?: NoteLength, tripletLength?: NoteLength): any {

        const addNormal = normalLength <= this.state.remainingTicksInBar ? () => this.addNote(normalLength, NoteType.Note) : undefined;
        const addNormalRest = normalLength <= this.state.remainingTicksInBar ? () => this.addNote(normalLength, NoteType.Rest) : undefined;
        
        let dottedGroup: JSX.Element | undefined;
        let tripletGroup: JSX.Element | undefined;

        if (dottedLength !== undefined) {
            const addDotted = dottedLength <= this.state.remainingTicksInBar ? () => this.addNote(dottedLength, NoteType.Note) : undefined;
            const addDottedRest = dottedLength <= this.state.remainingTicksInBar ? () => this.addNote(dottedLength, NoteType.Rest) : undefined;

            dottedGroup = <div className="noteButtons__lengthGroup">
                <div className="noteButtons__label">Dotted {name.toLowerCase()}</div>
                <button onClick={addDotted} disabled={addDotted === undefined}>Note</button>
                <button onClick={addDottedRest} disabled={addDottedRest === undefined}>Rest</button>
            </div>
        }

        if (tripletLength !== undefined) {
            const addTriplet = tripletLength <= this.state.remainingTicksInBar ? () => this.addNote(tripletLength, NoteType.Note) : undefined;
            const addTripletRest = tripletLength <= this.state.remainingTicksInBar ? () => this.addNote(tripletLength, NoteType.Rest) : undefined;

            tripletGroup = <div className="noteButtons__lengthGroup">
                <div className="noteButtons__label">Triplet {name.toLowerCase()}</div>
                <button onClick={addTriplet} disabled={addTriplet === undefined}>Note</button>
                <button onClick={addTripletRest} disabled={addTripletRest === undefined}>Rest</button>
            </div>
        }

        return <div className="noteButtons">
            <div className="noteButtons__lengthGroup noteButtons__lengthGroup--main">
                <div className="noteButtons__label">{name}</div>
                <button onClick={addNormal} disabled={addNormal === undefined}>Note</button>
                <button onClick={addNormalRest} disabled={addNormalRest === undefined}>Rest</button>
            </div>
            {dottedGroup}
            {tripletGroup}
        </div>
    }
}
