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
}

export class LevelDesigner extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        if (props.loadData === undefined) {
            this.state = {
                bars: [[]],
                name: 'Custom rhythm',
                tempo: [NoteLength.Crotchet, 80],
                timeSignature: [4, NoteLength.Crotchet],
            };
        }
        else {
            const level = loadCustomLevel(props.loadData);
            this.state = {
                bars: level.bars,
                name: level.name,
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
        const timeSigNumberChanged = (e: React.ChangeEvent<HTMLSelectElement>) => this.setState({
            timeSignature: [parseInt(e.target.value, 10), this.state.timeSignature[1]],
        });
        const timeSigLengthChanged = (e: React.ChangeEvent<HTMLSelectElement>) => this.setState({
            timeSignature: [this.state.timeSignature[0], parseInt(e.target.value, 10)],
        });
        
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
        })

        this.setState({
            bars
        })
    }
    
    private renderNoteButtons(name: string, normalLength: NoteLength, dottedLength?: NoteLength, tripletLength?: NoteLength): any {
        const addNormal = () => this.addNote(normalLength, NoteType.Note);
        const addNormalRest = () => this.addNote(normalLength, NoteType.Rest);
        
        const addDotted = () => this.addNote(dottedLength!, NoteType.Note);
        const addDottedRest = () => this.addNote(dottedLength!, NoteType.Rest);

        const addTriplet = () => this.addNote(tripletLength!, NoteType.Note);
        const addTripletRest = () => this.addNote(tripletLength!, NoteType.Rest);

        const dottedGroup = dottedLength === undefined
             ? undefined
             : <div className="noteButtons__lengthGroup">
                <div className="noteButtons__label">Dotted {name.toLowerCase()}</div>
                 <button onClick={addDotted}>Note</button>
                 <button onClick={addDottedRest}>Rest</button>
             </div>

        const tripletGroup = tripletLength === undefined
             ? undefined
             : <div className="noteButtons__lengthGroup">
                <div className="noteButtons__label">Triplet {name.toLowerCase()}</div>
                 <button onClick={addTriplet}>Note</button>
                 <button onClick={addTripletRest}>Rest</button>
             </div>

        return <div className="noteButtons">
            <div className="noteButtons__lengthGroup noteButtons__lengthGroup--main">
                <div className="noteButtons__label">{name}</div>
                <button onClick={addNormal}>Note</button>
                <button onClick={addNormalRest}>Rest</button>
            </div>
            {dottedGroup}
            {tripletGroup}
        </div>
    }
}
