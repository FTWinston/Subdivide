import { ILevel, NoteDuration, NoteType } from '../musicData';

const level: ILevel = {
    name: 'More rests',
    noteSequences: [
        [
            {
                duration: NoteDuration.Crotchet,
                type: NoteType.Note,
            }
        ],
        [
            {
                duration: NoteDuration.Crotchet,
                type: NoteType.Rest,
            }
        ]
    ],
    numberOfBars: 4,
    tempo: [NoteDuration.Crotchet, 80],
    timeSignature: [4, NoteDuration.Crotchet],
}

export default level;