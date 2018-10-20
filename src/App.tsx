import * as React from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import { CountInType } from './CountIn';
import { loadCustomLevel } from './customLevels';
import { LevelDesigner } from './LevelDesigner';
import { LevelDisplay } from './LevelDisplay';
import { getLevels } from './levels';
import { LevelSelect } from './LevelSelect';
import { loadLevel } from './loadLevel';
import { ILevel } from './musicData';

interface IState {
    levels: ILevel[];
    countIn: CountInType;
}

export class App extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            countIn: CountInType.OneBar,
            levels: getLevels(),
        };
    }

    public render() {
        const renderLevel = (props: any) => {
            const levelNum = parseInt(props.match.params.id, 10);
            const music = loadLevel(this.state.levels[levelNum - 1]);
            return <LevelDisplay
                music={music}
                countIn={this.state.countIn}
                nextLevelNum={levelNum < this.state.levels.length - 1 ? levelNum + 1 : undefined}
            />
        };

        const renderCustom = (props: any) => {
            const music = loadCustomLevel(props.match.params.levelData);
            return <LevelDisplay
                music={music}
                countIn={this.state.countIn}
                nextLevelNum={undefined}
            />
        };

        const renderDesigner = (props: any) => {
            return <LevelDesigner
                loadData={props.levelData as string}
            />
        };

        const renderLevelSelect = () => <LevelSelect levels={this.state.levels} />

        return <Switch>
            <Route path="/level/:id" render={renderLevel} />
            <Route path="/design/:levelData?" render={renderDesigner} />
            <Route path="/custom/:levelData" render={renderCustom} />
            <Route render={renderLevelSelect} />
        </Switch>
    }
}