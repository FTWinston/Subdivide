import * as React from 'react';
import { CountIn, CountInType } from './CountIn';
import { determineRhythm } from './determineRhythm';
import { ErrorBoundary } from './ErrorBoundary';
import './LevelDisplay.css';
import { loadLevel } from './loadLevel';
import { ILevel, INote, Rhythm } from './musicData';
import { MusicDisplay } from './MusicDisplay';
import { delay, playRhythm, stopRhythm } from './playRhythm';
import { RhythmDisplay } from './RhythmDisplay';

interface IProps {
    countIn: CountInType;
    level: ILevel;
    cancel: () => void;
    next?: () => void;
}

const enum PlaybackStatus {
    Before,
    Playing,
    After,
}

interface IState {
    bars: INote[][];
    playbackStatus: PlaybackStatus;
    correctRhythm: Rhythm;
    userRhythm: Rhythm;
}

export class LevelDisplay extends React.PureComponent<IProps, IState> {
    private timeSinceUserBeat: number;
    
    constructor(props: IProps) {
        super(props);

        const level = loadLevel(props.level);

        this.state = {
            bars: level.bars,
            correctRhythm: [],
            playbackStatus: PlaybackStatus.Before,
            userRhythm: [],
        };
    }

    public componentWillReceiveProps(newProps: IProps) {
        this.stopRhythm()
        const level = loadLevel(newProps.level);

        this.setState({
            bars: level.bars,
            correctRhythm: [],
            userRhythm: [],
        });
    }

    public componentWillUnmount() {
        this.stopRhythm();
    }

    public render() {
        const bottomSection = this.state.playbackStatus === PlaybackStatus.Playing
            ? <CountIn type={this.props.countIn} tempo={this.props.level.tempo} timeSignature={this.props.level.timeSignature} />
            : this.renderActions()

        let correctRhythm;
        let userRhythm;
        if (this.state.playbackStatus === PlaybackStatus.After) {
            correctRhythm = <RhythmDisplay rhythm={this.state.correctRhythm} forUser={false} />
            userRhythm = <RhythmDisplay rhythm={this.state.userRhythm} forUser={true} />
        }

        return (
            <div className="screen screen--level">
                <h2>{this.props.level.name}</h2>
                <ErrorBoundary>
                    <MusicDisplay
                        bars={this.state.bars}
                        tempo={this.props.level.tempo}
                        timeSignature={this.props.level.timeSignature}
                    />
                </ErrorBoundary>
                {correctRhythm}
                {userRhythm}
                {bottomSection}
            </div>
        )
    }

    private renderActions() {
        const startPlaying = () => this.playRhythm();

        const startLabel = this.state.playbackStatus === PlaybackStatus.Before
            ? 'Start playing'
            : 'Play again';

        return <div className="actions">
            <button onClick={startPlaying}>{startLabel}</button>
            <button onClick={this.props.next} disabled={this.props.next === undefined}>Next level</button>
            <button onClick={this.props.cancel}>Go back</button>
        </div>
    }

    private userBeatHandle = () => this.userBeat();

    private startListeningForBeats() {
        document.addEventListener('keydown', this.userBeatHandle);
        document.addEventListener('mousedown', this.userBeatHandle);
    }

    private stopListeningForBeats() {
        document.removeEventListener('keydown', this.userBeatHandle);
        document.removeEventListener('mousedown', this.userBeatHandle);
    }

    private stopRhythm() {
        stopRhythm();
        this.stopListeningForBeats();

        this.setState({
            playbackStatus: PlaybackStatus.Before,
        });
    }

    private async playRhythm() {
        const rhythm = determineRhythm(this.state.bars, this.props.level.tempo);
    
        this.setState({
            correctRhythm: rhythm,
            playbackStatus: PlaybackStatus.Playing,
            userRhythm: [],
        });

        this.startListeningForBeats();

        this.timeSinceUserBeat = new Date().getTime();

        const countInDelay = CountIn.determineDelay(this.props.countIn, this.props.level.timeSignature, this.props.level.tempo);
        await delay(countInDelay);

        await playRhythm(rhythm, () => this.beat());

        this.stopListeningForBeats();

        // add a remaining entry to userRhythm, to pad it to the full length
        const now = new Date().getTime();
        const trailingDelay = now - this.timeSinceUserBeat;

        this.setState(state => {
            return {
                playbackStatus: PlaybackStatus.After,
                userRhythm: state.userRhythm.concat(trailingDelay),
            };
        });

        this.applyInitialDelay(countInDelay);
    }

    private applyInitialDelay(initialDelayCorrect: number) {
        const initialDelayUser = this.state.userRhythm[0];

        let newDelayCorrect = 0;
        let newDelayUser = 0;

        if (initialDelayCorrect < initialDelayUser) {
            newDelayUser = initialDelayUser - initialDelayCorrect;
        }
        else {
            newDelayCorrect = initialDelayCorrect - initialDelayUser;
        }

        
        this.setState(state => {
            const correct = state.correctRhythm.slice();
            const user = state.userRhythm.slice();
            correct[0] = newDelayCorrect;
            user[0] = newDelayUser;

            return {
                correctRhythm: correct,
                userRhythm: user,
            };
        });
    }

    private beat() {
        console.log('beat');
    }

    private userBeat() {
        const now = new Date().getTime();
        const beatDelay = now - this.timeSinceUserBeat;
        this.timeSinceUserBeat = now;
        console.log('user beat');

        this.setState(state => {
            return {
                userRhythm: state.userRhythm.concat(beatDelay)
            }
        });
    }
}
