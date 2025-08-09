declare module 'chord-mark' {
    interface ChordNode {
        chord: string;
        position: number;
    }

    interface Line {
        type: 'line';
        chords: ChordNode[];
        lyrics: string;
    }

    interface Section {
        type: 'section';
        name: string;
        lines: Line[];
    }

    type ChordChart = Array<Line | Section>;

    export function parse(text: string): ChordChart;
    export function render(chordChart: ChordChart): string;
}