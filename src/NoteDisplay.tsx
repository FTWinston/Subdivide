import * as React from 'react';
import { NoteDuration, NoteType } from './musicData';
import './NoteDisplay.css';

interface IProps {
    duration: NoteDuration;
    type: NoteType;
}

export class NoteDisplay extends React.PureComponent<IProps> {
    public render() {
        let strType: string;

        switch (this.props.type) {
            case NoteType.Note:
                strType = "normal";
                break;
            case NoteType.Rest:
                strType = "rest";
                break;
            default:
                return;
        }

        const classes = "note";
        return <div className={classes} data-type={strType} data-duration={this.props.duration} />
    }
}
