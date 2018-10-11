import { ILevel, NoteLength, NoteType } from '../musicData';

const level: ILevel = {
    name: 'Longer notes',
    noteSequences: [
        [
            {
                length: NoteLength.Crotchet,
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
                type: NoteType.Note,
            }
        ],
        [
            {
                length: NoteLength.Minim,
                type: NoteType.Note,
            }
        ],
        [
            {
                length: NoteLength.Minim,
                type: NoteType.Rest,
            }
        ],
    ],
    numberOfBars: 4,
    tempo: [NoteLength.Crotchet, 80],
    timeSignature: [4, NoteLength.Crotchet],
}

export default level;