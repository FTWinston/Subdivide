import * as React from 'react';
import './App.css';
import { levels } from './levels';
import { loadLevel } from './loadLevel';
import { MusicDisplay } from './MusicDisplay';

class App extends React.Component {
    public render() {
        const music = levels.map((l, i) => {
            const data = loadLevel(l);
            return (
                <MusicDisplay key={i}
                    bars={data.bars}
                    tempo={data.tempo}
                    timeSignature={data.timeSignature}
                />
            );
        });

        return (
        <div className="App">
            {music}
        </div>
        );
    }
}

export default App;
