import * as React from 'react';
import './CountIn.css';
import { determineTickDuration } from './determineRhythm';
import { Tempo, TimeSignature } from './musicData';

export const enum CountInType {
    OneBar,
    TwoBars,
    HalfBar,
    OneBeat,
}

interface IProps {
    tempo: Tempo;
    timeSignature: TimeSignature;
    type: CountInType;
}

export class CountIn extends React.PureComponent<IProps> {
    public static determineDelay(type: CountInType, timeSignature: TimeSignature, tempo: Tempo): any {
        const oneBeat = determineTickDuration(tempo) * timeSignature[1];
        const numBeats = CountIn.determineBeatNumbers(type, timeSignature, tempo).length - 0.5; // chop off half a beat as there is one extra, but we want a half beat added for the animation
        return oneBeat * numBeats;
    }

    private static determineBeatNumbers(type: CountInType, timeSignature: TimeSignature, tempo: Tempo) {
        const beatsPerBar = timeSignature[0];
        const beatNumbers = [];

        switch (type) {
            case CountInType.TwoBars:
                for (let i = 1; i <= beatsPerBar; i++) {
                    beatNumbers.push(i);
                }
            case CountInType.OneBar:
                for (let i = 1; i <= beatsPerBar; i++) {
                    beatNumbers.push(i);
                }
                break;
            case CountInType.HalfBar:
                for (let i = Math.floor(beatsPerBar / 2); i <= beatsPerBar; i++) {
                    beatNumbers.push(i);
                }
                break;
            case CountInType.OneBeat:
                beatNumbers.push(beatsPerBar);
                break;
        }

        beatNumbers.push(1); // always add a down beat

        return beatNumbers;
    }
    
    public render() {
        return <div className="countIn">{this.renderBeats()}</div>
    }

    private renderBeats() {
        const beatNumbers = CountIn.determineBeatNumbers(this.props.type, this.props.timeSignature, this.props.tempo);
        const beatDuration = this.props.timeSignature[1] * determineTickDuration(this.props.tempo);

        return beatNumbers.map((n, i) => {
            const beatStyle: React.CSSProperties = {
                animationDelay: `${i * beatDuration}ms`,
                animationDuration: `${beatDuration}ms`,
            };

            return <div className="countIn__beat" style={beatStyle} key={i}>{n}</div>
        });
    }
}
