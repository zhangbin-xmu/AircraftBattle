import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HealthPointsUI')
export class HealthPointsUI extends Component {

    @property(Label)
    hpLebal: Label = null

    start() {

    }

    update(deltaTime: number) {
        
    }

    updateUI(hpLebal: string) {
        this.hpLebal.string = hpLebal
    }
}


