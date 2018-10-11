import { ILevel, NoteDuration, NoteType } from '../musicData';

const level: ILevel = {
    name: 'Straight notes',
    noteSequences: [
        [
            {
                length: NoteDuration.Crotchet,
                type: NoteType.Note,
            }
        ]
    ],
    numberOfBars: 1,
    tempo: [NoteDuration.Crotchet, 80],
    timeSignature: [4, NoteDuration.Crotchet],
}

export default level;