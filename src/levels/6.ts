import { ILevel, NoteDuration, NoteType, Triplet } from '../musicData';

const level: ILevel = {
    name: 'Triplets',
    noteSequences: [
        [
            {
                duration: NoteDuration.Crotchet,
                type: NoteType.Note,
            },
            {
                duration: NoteDuration.Crotchet,
                type: NoteType.Note,
            }
        ],
        [
            {
                duration: NoteDuration.Crotchet,
                type: NoteType.Note,
            },
            {
                duration: NoteDuration.Crotchet,
                type: NoteType.Rest,
            }
        ],
        [
            {
                duration: NoteDuration.Crotchet,
                type: NoteType.Rest,
            },
            {
                duration: NoteDuration.Crotchet,
                type: NoteType.Note,
            }
        ],
        [
            {
                duration: NoteDuration.Minim,
                notes: [NoteType.Note, NoteType.Note, NoteType.Note],
                type: Triplet,
            }
        ],
        [
            {
                duration: NoteDuration.Minim,
                notes: [NoteType.Note, NoteType.Note, NoteType.Note],
                type: Triplet,
            }
        ],
    ],
    numberOfBars: 4,
    tempo: [NoteDuration.Crotchet, 80],
    timeSignature: [4, NoteDuration.Crotchet],
}

export default level;