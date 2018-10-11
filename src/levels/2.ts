import { ILevel, NoteLength, NoteType } from '../musicData';

const level: ILevel = {
    name: 'Occasional rests',
    noteSequences: [
        [
            {
                length: NoteLength.Crotchet,
                type: NoteType.Note,
            },
            {
                length: NoteLength.Crotchet,
                type: NoteType.Note,
            }
        ],
        [
            {
                length: NoteLength.Crotchet,
                type: NoteType.Note,
            },
            {
                length: NoteLength.Crotchet,
                type: NoteType.Rest,
            }
        ]
    ],
    numberOfBars: 3,
    tempo: [NoteLength.Crotchet, 80],
    timeSignature: [4, NoteLength.Crotchet],
}

export default level;