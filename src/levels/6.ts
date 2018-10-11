import { ILevel, NoteDuration, NoteType } from '../musicData';

const level: ILevel = {
    name: 'Triplets',
    noteSequences: [
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
                length: NoteDuration.TripletCrotchet,
                type: NoteType.Note,
            },
            {
                length: NoteDuration.TripletCrotchet,
                type: NoteType.Note,
            },
            {
                length: NoteDuration.TripletCrotchet,
                type: NoteType.Note,
            }
        ],
        [
            {
                length: NoteDuration.TripletCrotchet,
                type: NoteType.Note,
            },
            {
                length: NoteDuration.TripletCrotchet,
                type: NoteType.Note,
            },
            {
                length: NoteDuration.TripletCrotchet,
                type: NoteType.Note,
            }
        ],
    ],
    numberOfBars: 4,
    tempo: [NoteDuration.Crotchet, 80],
    timeSignature: [4, NoteDuration.Crotchet],
}

export default level;