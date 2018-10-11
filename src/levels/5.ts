import { ILevel, NoteLength, NoteType } from '../musicData';

const level: ILevel = {
    name: 'Shorter notes',
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
                length: NoteLength.Quaver,
                type: NoteType.Note,
            },
            {
                length: NoteLength.Quaver,
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
                length: NoteLength.Quaver,
                type: NoteType.Note,
            },
            {
                length: NoteLength.Quaver,
                type: NoteType.Note,
            }
        ],
        [
            {
                length: NoteLength.Quaver,
                type: NoteType.Note,
            },
            {
                length: NoteLength.Quaver,
                type: NoteType.Note,
            },
            {
                length: NoteLength.Crotchet,
                type: NoteType.Rest,
            }
        ],
        [
            {
                length: NoteLength.Crotchet,
                type: NoteType.Rest,
            },
            {
                length: NoteLength.Quaver,
                type: NoteType.Note,
            },
            {
                length: NoteLength.Quaver,
                type: NoteType.Note,
            }
        ],
    ],
    numberOfBars: 4,
    tempo: [NoteLength.Crotchet, 80],
    timeSignature: [4, NoteLength.Crotchet],
}

export default level;