export type NoteDuration = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 18 | 24 | 32;

export const enum NoteType {
    Rest = 0,
    Note,
    /*
    Tied,
    Stacatto,
    Legato,
    Accented,
    */
}

export const Triplet = -1;

export interface INote {
    duration: NoteDuration;
    type: NoteType;
}

export interface ITriplet {
    type: -1;
    duration: NoteDuration;
    notes: [NoteType, NoteType, NoteType];
}

export type MusicElement = INote | ITriplet;

interface IMusicBase {
    name: string;
    timeSignature: [NoteDuration, number];
    tempo: [NoteDuration, number];
}

export interface ILevel extends IMusicBase {
    numberOfBars: number;

    noteSequences: MusicElement[][];
}

export interface IMusic extends IMusicBase {
    bars: MusicElement[][];
}