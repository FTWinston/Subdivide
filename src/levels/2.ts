import { ILevel, NoteType } from '../musicData';

const level: ILevel = {
    name: 'Occasional rests',
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
        ]
    ],
    numberOfBars: 3,
    tempo: [4, 80],
    timeSignature: [4, 4],
}

export default level;