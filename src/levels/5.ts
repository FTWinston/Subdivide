import { ILevel, NoteDuration, NoteType } from '../musicData';

const level: ILevel = {
    name: 'Shorter notes',
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
                duration: NoteDuration.Quaver,
                type: NoteType.Note,
            },
            {
                duration: NoteDuration.Quaver,
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
                duration: NoteDuration.Quaver,
                type: NoteType.Note,
            },
            {
                duration: NoteDuration.Quaver,
                type: NoteType.Note,
            }
        ],
        [
            {
                duration: NoteDuration.Quaver,
                type: NoteType.Note,
            },
            {
                duration: NoteDuration.Quaver,
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
                duration: NoteDuration.Quaver,
                type: NoteType.Note,
            },
            {
                duration: NoteDuration.Quaver,
                type: NoteType.Note,
            }
        ],
    ],
    numberOfBars: 4,
    tempo: [NoteDuration.Crotchet, 80],
    timeSignature: [4, NoteDuration.Crotchet],
}

export default level;