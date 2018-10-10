import { ILevel, NoteType } from '../musicData';

const level: ILevel = {
    name: 'Longer notes',
    noteSequences: [
        [
            {
                duration: 4,
                type: NoteType.Note,
            },
            {
                duration: 4,
                type: NoteType.Rest,
            }
        ],
        [
            {
                duration: 4,
                type: NoteType.Rest,
            },
            {
                duration: 4,
                type: NoteType.Note,
            }
        ],
        [
            {
                duration: 4,
                type: NoteType.Note,
            },
            {
                duration: 4,
                type: NoteType.Note,
            }
        ],
        [
            {
                duration: 2,
                type: NoteType.Note,
            }
        ],
        [
            {
                duration: 2,
                type: NoteType.Rest,
            }
        ],
    ],
    numberOfBars: 4,
    tempo: [4, 80],
    timeSignature: [4, 4],
}

export default level;