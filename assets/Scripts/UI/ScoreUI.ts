import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreUI')
export class ScoreUI extends Component {

    @property(Label)
    scoreLabel: Label = null

    start() {

    }

    update(deltaTime: number) {
        
    }

    updateUI(scoreLabel: string) {
        this.scoreLabel.string = scoreLabel
    }
}


