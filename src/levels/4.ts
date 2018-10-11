import { ILevel, NoteDuration, NoteType } from '../musicData';

const level: ILevel = {
    name: 'Longer notes',
    noteSequences: [
        [
            {
                length: NoteDuration.Crotchet,
                type: NoteType.Note,
            },
            {
                length: NoteDuration.Crotchet,
                type: NoteType.Rest,
            }
        ],
        [
            {
                length: NoteDuration.Crotchet,
                type: NoteType.Rest,
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
                type: NoteType.Note,
            }
        ],
        [
            {
                length: NoteDuration.Minim,
                type: NoteType.Note,
            }
        ],
        [
            {
                length: NoteDuration.Minim,
                type: NoteType.Rest,
            }
        ],
    ],
    numberOfBars: 4,
    tempo: [NoteDuration.Crotchet, 80],
    timeSignature: [4, NoteDuration.Crotchet],
}

export default level;