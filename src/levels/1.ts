import { ILevel, NoteType } from '../musicData';

const level: ILevel = {
    name: 'Straight notes',
    noteSequences: [
        [
            {
                duration: 4,
                type: NoteType.Note,
            }
        ]
    ],
    numberOfBars: 1,
    tempo: [4, 80],
    timeSignature: [4, 4],
}

export default level;