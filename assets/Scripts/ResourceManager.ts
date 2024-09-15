import { _decorator, Component, EventTouch, Input, input, instantiate, math, Node, Prefab } from 'cc';
import { RewardType } from './Reward';
import { GameManager } from './GameManager';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {

    private static _instance: ResourceManager

    public static getInstance(): ResourceManager {
        return this._instance
    }

    @property
    topBorder: number = 500

    @property
    leftBorder: number = -230

    @property
    rightBorder: number = 230

    @property
    enemy0ProduceInteval: number = 1

    @property
    enemy1ProduceInteval: number = 3

    @property
    enemy2ProduceInteval: number = 5

    @property(Prefab)
    enemy0Prefab: Prefab = null

    @property(Prefab)
    enemy1Prefab: Prefab = null

    @property(Prefab)
    enemy2Prefab: Prefab = null

    @property
    rewardProduceInteval: number = 15

    @property(Prefab)
    reward1Prefab: Prefab = null

    @property(Prefab)
    reward2Prefab: Prefab = null

    @property([Node])
    enemyArray: Node[] = []

    doubleClickInterval: number = 0.3

    lastClickTime: number = 0

    protected onLoad(): void {
        ResourceManager._instance = this
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this)
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this)
        this.unschedule(this.produceEnemy0)
        this.unschedule(this.produceEnemy1)
        this.unschedule(this.produceEnemy2)
        this.unschedule(this.produceReward)
    }

    start() {
        this.schedule(this.produceEnemy0, this.enemy0ProduceInteval)
        this.schedule(this.produceEnemy1, this.enemy1ProduceInteval)
        this.schedule(this.produceEnemy2, this.enemy2ProduceInteval)
        this.schedule(this.produceReward, this.rewardProduceInteval)
    }

    update(deltaTime: number) {
        
    }

    onTouchEnd(event: EventTouch) {
        let currentTime = Date.now()
        let timeDiff = (currentTime - this.lastClickTime) / 1000
        if (timeDiff < this.doubleClickInterval) {
            this.onDoubleClick(event)
        }
        this.lastClickTime = currentTime
    }

    onDoubleClick(event: EventTouch) {
        GameManager.getInstance().useBomb()
        for (let enemy of this.enemyArray) {
            enemy.getComponent(Enemy).bombed()
        }
    }

    produce(prefab: Prefab, minX: number, maxX: number, y: number): Node {
        const node = instantiate(prefab)
        this.node.addChild(node)

        const x = math.randomRangeInt(minX, maxX)
        node.setPosition(x, y)
        return node
    }

    produceEnemy0() {
        const enemy = this.produce(this.enemy0Prefab, this.leftBorder + 15, this.rightBorder - 15, this.topBorder)
        this.enemyArray.push(enemy)
    }

    produceEnemy1() {
        const enemy = this.produce(this.enemy1Prefab, this.leftBorder + 30, this.rightBorder - 30, this.topBorder)
        this.enemyArray.push(enemy)
    }

    produceEnemy2() {
        const enemy = this.produce(this.enemy2Prefab, this.leftBorder + 70, this.rightBorder - 70, this.topBorder + 100)
        this.enemyArray.push(enemy)
    }
    
    produceReward() {
        const value = math.randomRangeInt(RewardType.DoubleShot, RewardType.Bomb + 1)
        switch (value) {
            case RewardType.DoubleShot:
                this.produce(this.reward1Prefab, this.leftBorder + 10, this.rightBorder - 10, this.topBorder)
                break
            case RewardType.Bomb:
                this.produce(this.reward2Prefab, this.leftBorder + 10, this.rightBorder - 10, this.topBorder)
                break
        }
    }

    consumeEnemy(enemy: Node) {
        const index = this.enemyArray.indexOf(enemy)
        if (-1 != index) {
            this.enemyArray.splice(index, 1)
        }
    }
}


