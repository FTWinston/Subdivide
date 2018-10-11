import * as React from 'react';
import './App.css';
import { determineRhythm } from './determineRhythm';
import { levels } from './levels';
import { loadLevel } from './loadLevel';
import { MusicDisplay } from './MusicDisplay';

class App extends React.Component {
    public render() {
        const music = levels.map((l, i) => {
            const data = loadLevel(l);
            const rhythm = determineRhythm(data);

            return [
                <h2 key={i.toString() + 'h'}>{data.name}</h2>,
                <MusicDisplay key={i}
                    bars={data.bars}
                    tempo={data.tempo}
                    timeSignature={data.timeSignature}
                />,
                <div key={i.toString() + 't'}>
                    {rhythm.startWithRest ? 'Don\'t beat immediately' : 'Beat immediately'}
                    {rhythm.beatSeparation.map((delay, j) => <div key={j}>{delay}ms</div>)}
                </div>
            ];
        });

        return (
        <div className="App">
            {music}
        </div>
        );
    }
}

export default App;
