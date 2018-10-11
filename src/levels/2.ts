import { ILevel, NoteDuration, NoteType } from '../musicData';

const level: ILevel = {
    name: 'Occasional rests',
    noteSequences: [
        [
            {
                length: NoteDuration.Crotchet,
                type: NoteType.Note,
            },
            {
                length: NoteDuration.Crotchet,
                type: NoteType.Note,
            }
        ],
        [
            {
                length: NoteDuration.Crotchet,
                type: NoteType.Note,
            },
            {
                length: NoteDuration.Crotchet,
                type: NoteType.Rest,
            }
        ]
    ],
    numberOfBars: 3,
    tempo: [NoteDuration.Crotchet, 80],
    timeSignature: [4, NoteDuration.Crotchet],
}

export default level;