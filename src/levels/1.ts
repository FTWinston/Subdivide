import { ILevel, NoteLength, NoteType } from '../musicData';

const level: ILevel = {
    name: 'Straight notes',
    noteSequences: [
        [
            {
                length: NoteLength.Crotchet,
                type: NoteType.Note,
            }
        ]
    ],
    numberOfBars: 1,
    tempo: [NoteLength.Crotchet, 80],
    timeSignature: [4, NoteLength.Crotchet],
}

export default level;