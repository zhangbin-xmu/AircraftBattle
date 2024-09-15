import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum RewardType {
    DoubleShot,
    Bomb
}

@ccclass('Reward')
export class Reward extends Component {
    
    @property
    bottomBorder: number = -380

    @property
    speed: number = 90

    @property
    rewardType: RewardType = RewardType.DoubleShot

    start() {

    }

    update(deltaTime: number) {
        const p = this.node.position
        this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z)

        if (this.node.position.y < this.bottomBorder - 100) {
            this.node.destroy()
        }
    }
}


