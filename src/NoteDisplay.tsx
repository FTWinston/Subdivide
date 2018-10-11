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
                break;
        }

        switch (this.props.duration) {
            case NoteLength.Semibreve:
                return this.props.type === NoteType.Rest
                    ? <SemibreveRest className={classes} />
                    : <Semibreve className={classes} />;

            case NoteLength.Minim:
            case NoteLength.DottedMinim:
            case NoteLength.TripletMinim:
                return this.props.type === NoteType.Rest
                    ? <MinimRest className={classes} />
                    : <Minim className={classes} />;
                    
            case NoteLength.Crotchet:
            case NoteLength.DottedCrotchet:
            case NoteLength.TripletCrotchet:
                return this.props.type === NoteType.Rest
                    ? <CrotchetRest className={classes} />
                    : <Crotchet className={classes} />;
                    
            case NoteLength.Quaver:
            case NoteLength.DottedQuaver:
            case NoteLength.TripletQuaver:
                return this.props.type === NoteType.Rest
                    ? <QuaverRest className={classes} />
                    : <Quaver className={classes} />;
                    
            case NoteLength.Semiquaver:
            case NoteLength.DottedSemiquaver:
            case NoteLength.TripletSemiquaver:
                return this.props.type === NoteType.Rest
                    ? <SemiquaverRest className={classes} />
                    : <Semiquaver className={classes} />;

            default:
                return null;
        }
    }
}
