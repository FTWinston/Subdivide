import { ILevel, NoteType, Triplet } from '../musicData';

const level: ILevel = {
    name: 'Triplets',
    noteSequences: [
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
                duration: 2,
                notes: [NoteType.Note, NoteType.Note, NoteType.Note],
                type: Triplet,
            }
        ],
        [
            {
                duration: 2,
                notes: [NoteType.Note, NoteType.Note, NoteType.Note],
                type: Triplet,
            }
        ],
    ],
    numberOfBars: 4,
    tempo: [4, 80],
    timeSignature: [4, 4],
}

export default level;