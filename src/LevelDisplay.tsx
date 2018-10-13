import * as React from 'react';
import { determineRhythm, determineTickDuration } from './determineRhythm';
import { loadLevel } from './loadLevel';
import { ILevel, INote, Rhythm } from './musicData';
import { MusicDisplay } from './MusicDisplay';
import { playRhythm, stopRhythm } from './playRhythm';
import { RhythmDisplay } from './RhythmDisplay';

interface IProps {
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
        const startStop = this.state.playbackStatus === PlaybackStatus.Playing
            ? () => this.stopRhythm()
            : () => this.playRhythm();

        const startStopLabel = this.state.playbackStatus === PlaybackStatus.Before
            ? 'Start playing'
            : this.state.playbackStatus === PlaybackStatus.Playing
                ? 'Stop playing'
                : 'Play again';

        const userBeat = this.state.playbackStatus === PlaybackStatus.Playing
            ? () => this.userBeat()
            : undefined;

        let correctRhythm;
        let userRhythm;
        if (this.state.playbackStatus === PlaybackStatus.After) {
            correctRhythm = <RhythmDisplay rhythm={this.state.correctRhythm} forUser={false} />
            userRhythm = <RhythmDisplay rhythm={this.state.userRhythm} forUser={true} />
        }

        return (
            <div className="screen screen--level" onTouchStartCapture={userBeat}>
                <h2>{this.props.level.name}</h2>
                <MusicDisplay
                    bars={this.state.bars}
                    tempo={this.props.level.tempo}
                    timeSignature={this.props.level.timeSignature}
                />
                {correctRhythm}
                {userRhythm}

                <div className="actions">
                    <button onClick={startStop}>{startStopLabel}</button>
                    <button onClick={this.props.next} disabled={this.props.next === undefined}>Next level</button>
                    <button onClick={this.props.cancel}>Go back</button>
                </div>
            </div>
        )
    }

    private keyDownHandle = () => this.userBeat();

    private stopRhythm() {
        stopRhythm();
        document.removeEventListener('keydown', this.keyDownHandle);

        this.setState({
            playbackStatus: PlaybackStatus.Before,
        });
    }

    private async playRhythm() {
        const initialDelay = this.props.level.timeSignature[0] * this.props.level.timeSignature[1] * determineTickDuration(this.props.level.tempo);
        const rhythm = determineRhythm(this.state.bars, this.props.level.tempo, initialDelay);
    
        this.setState({
            correctRhythm: rhythm,
            playbackStatus: PlaybackStatus.Playing,
            userRhythm: [],
        });

        document.addEventListener('keydown', this.keyDownHandle);

        this.timeSinceUserBeat = new Date().getTime();
        await playRhythm(rhythm, () => this.beat());

        document.removeEventListener('keydown', this.keyDownHandle);

        // add a remaining entry to userRhythm, to pad it to the full length
        const now = new Date().getTime();
        const trailingDelay = now - this.timeSinceUserBeat;

        this.setState(state => {
            return {
                playbackStatus: PlaybackStatus.After,
                userRhythm: state.userRhythm.concat(trailingDelay),
            };
        });

        this.removeInitialDelay();
    }

    private removeInitialDelay() {
        const initialDelayCorrect = this.state.correctRhythm[0];
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
