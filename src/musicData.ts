export const enum NoteLength {
    Semibreve = 96,
    
    DottedMinim = 72,
    Minim = 48,
    TripletMinim = 32,
    
    DottedCrotchet = 36,
    Crotchet = 24,
    TripletCrotchet = 16,
    
    DottedQuaver = 18,
    Quaver = 12,
    TripletQuaver = 8,
    
    DottedSemiquaver = 9,
    Semiquaver = 6,
    TripletSemiquaver = 4,
}

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

export interface INote {
    length: NoteLength;
    type: NoteType;
}

export type Tempo = [NoteLength, number];

export type TimeSignature = [number, NoteLength];

interface IMusicBase {
    name: string;
    timeSignature: TimeSignature;
    tempo: Tempo;
}

export interface ILevel extends IMusicBase {
    numberOfBars: number;
    noteSequences: INote[][];
}

export interface IMusic extends IMusicBase {
    bars: INote[][];
}

export type Rhythm = number[];