import * as React from 'react';

import Crotchet from '-!svg-react-loader?name=Note!./notes/crotchet.svg';
import CrotchetRest from '-!svg-react-loader?name=Note!./notes/crotchetRest.svg';
import Minim from '-!svg-react-loader?name=Note!./notes/minim.svg';
import MinimRest from '-!svg-react-loader?name=Note!./notes/minimRest.svg';
import Quaver from '-!svg-react-loader?name=Note!./notes/quaver.svg';
import QuaverRest from '-!svg-react-loader?name=Note!./notes/quaverRest.svg';
import Semibreve from '-!svg-react-loader?name=Note!./notes/semibreve.svg';
import SemibreveRest from '-!svg-react-loader?name=Note!./notes/semibreveRest.svg';
import Semiquaver from '-!svg-react-loader?name=Note!./notes/semiquaver.svg';
import SemiquaverRest from '-!svg-react-loader?name=Note!./notes/semiquaverRest.svg';

import { NoteLength, NoteType } from './musicData';
import './NoteDisplay.css';

interface IProps {
    duration: NoteLength;
    type: NoteType;
    groupPos?: number;
}

export class NoteDisplay extends React.PureComponent<IProps> {
    public render() {
        let classes = "note";
        
        switch (this.props.type) {
            case NoteType.Note:
                break;
            case NoteType.Rest:
                classes += " note--rest";
                break;
            default:
                return null;
        }
        
        
        switch (this.props.duration) {
            case NoteLength.DottedMinim:
            case NoteLength.DottedCrotchet:
            case NoteLength.DottedQuaver:
            case NoteLength.DottedSemiquaver:
                classes += ' note--dotted';
                break;
            case NoteLength.TripletMinim:
            case NoteLength.TripletCrotchet:
            case NoteLength.TripletQuaver:
            case NoteLength.TripletSemiquaver:
                classes += ' note--triplet';

                if (this.props.groupPos !== undefined && this.props.groupPos % 3 === 1) {
                    classes += ' note--startGroup';
                }
                break;
        }

        switch (this.props.duration) {
            case NoteLength.Semibreve:
                return this.props.type === NoteType.Rest
                    ? <div className={classes}><SemibreveRest /></div>
                    : <div className={classes}><Semibreve /></div>;

            case NoteLength.Minim:
            case NoteLength.DottedMinim:
            case NoteLength.TripletMinim:
                return this.props.type === NoteType.Rest
                    ? <div className={classes}><MinimRest /></div>
                    : <div className={classes}><Minim /></div>;
                    
            case NoteLength.Crotchet:
            case NoteLength.DottedCrotchet:
            case NoteLength.TripletCrotchet:
                return this.props.type === NoteType.Rest
                    ? <div className={classes}><CrotchetRest /></div>
                    : <div className={classes}><Crotchet /></div>;
                    
            case NoteLength.Quaver:
            case NoteLength.DottedQuaver:
            case NoteLength.TripletQuaver:
                return this.props.type === NoteType.Rest
                    ? <div className={classes}><QuaverRest /></div>
                    : <div className={classes}><Quaver /></div>;
                    
            case NoteLength.Semiquaver:
            case NoteLength.DottedSemiquaver:
            case NoteLength.TripletSemiquaver:
                return this.props.type === NoteType.Rest
                    ? <div className={classes}><SemiquaverRest /></div>
                    : <div className={classes}><Semiquaver /></div>;

            default:
                return null;
        }
    }
}
