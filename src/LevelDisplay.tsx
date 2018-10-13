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

    public render() {
        const onClick = this.state.playbackStatus === PlaybackStatus.Playing
            ? () => this.stopRhythm()
            : () => this.playRhythm();

        let correctRhythm;
        let userRhythm;
        if (this.state.playbackStatus === PlaybackStatus.After) {
            correctRhythm = <RhythmDisplay rhythm={this.state.correctRhythm} />
            userRhythm = <RhythmDisplay rhythm={this.state.userRhythm} />
        }

        return (
            <div className="screen screen--level" onClickCapture={onClick}>
                <h2>{this.props.level.name}</h2>
                <MusicDisplay
                    bars={this.state.bars}
                    tempo={this.props.level.tempo}
                    timeSignature={this.props.level.timeSignature}
                />
                {correctRhythm}
                {userRhythm}

                <div className="actions">
                    <button onClick={this.props.next} disabled={this.props.next === undefined}>Next level</button>
                    <button onClick={this.props.cancel}>Go back</button>
                </div>
            </div>
        )
    }

    private stopRhythm() {
        stopRhythm();

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

        await playRhythm(rhythm, () => this.beat());

        this.setState({
            playbackStatus: PlaybackStatus.After,
        });
    }

    private beat() {
        console.log('beat');
    }
}
