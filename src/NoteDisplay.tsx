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

import { NoteDuration, NoteType } from './musicData';
import './NoteDisplay.css';

interface IProps {
    duration: NoteDuration;
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
            case NoteDuration.DottedMinim:
            case NoteDuration.DottedCrotchet:
            case NoteDuration.DottedQuaver:
            case NoteDuration.DottedSemiquaver:
                classes += ' note--dotted';
                break;
            case NoteDuration.TripletMinim:
            case NoteDuration.TripletCrotchet:
            case NoteDuration.TripletQuaver:
            case NoteDuration.TripletSemiquaver:
                classes += ' note--triplet';
                break;
        }

        switch (this.props.duration) {
            case NoteDuration.Semibreve:
                return this.props.type === NoteType.Rest
                    ? <SemibreveRest className={classes} />
                    : <Semibreve className={classes} />;

            case NoteDuration.Minim:
            case NoteDuration.DottedMinim:
            case NoteDuration.TripletMinim:
                return this.props.type === NoteType.Rest
                    ? <MinimRest className={classes} />
                    : <Minim className={classes} />;
                    
            case NoteDuration.Crotchet:
            case NoteDuration.DottedCrotchet:
            case NoteDuration.TripletCrotchet:
                return this.props.type === NoteType.Rest
                    ? <CrotchetRest className={classes} />
                    : <Crotchet className={classes} />;
                    
            case NoteDuration.Quaver:
            case NoteDuration.DottedQuaver:
            case NoteDuration.TripletQuaver:
                return this.props.type === NoteType.Rest
                    ? <QuaverRest className={classes} />
                    : <Quaver className={classes} />;
                    
            case NoteDuration.Semiquaver:
            case NoteDuration.DottedSemiquaver:
            case NoteDuration.TripletSemiquaver:
                return this.props.type === NoteType.Rest
                    ? <SemiquaverRest className={classes} />
                    : <Semiquaver className={classes} />;

            default:
                return null;
        }
    }
}
