import * as React from 'react';
import { NoteDuration, NoteType } from './musicData';
import { NoteDisplay } from './NoteDisplay';

interface IProps {
    noteDuration: NoteDuration;
    notes: [NoteType, NoteType, NoteType];
}

export class TripletDisplay extends React.PureComponent<IProps> {
    public render() {
        return this.props.notes.map((n, i) => <NoteDisplay duration={this.props.noteDuration} type={n} inTriplet={true} key={i} />);
    }
}
