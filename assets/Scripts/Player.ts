import { _decorator, Animation, AudioClip, Collider2D, Component, Contact2DType, EventTouch, Input, input, instantiate, IPhysics2DContact, Node, Prefab, Sprite, Vec3 } from 'cc';
import { Reward, RewardType } from './Reward';
import { GameManager } from './GameManager';
import { HealthPointsUI } from './UI/HealthPointsUI';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

enum GunType {
    None,
    SingleShot,
    DoubleShot
}

@ccclass('Player')
export class Player extends Component {

    @property
    topBorder: number = 380

    @property
    bottomBorder: number = -380

    @property
    leftBorder: number = -230

    @property
    rightBorder: number = 230

    @property
    shootInterval: number = 0.5

    shootTimer: number = 0

    @property
    gunType: GunType = GunType.SingleShot

    @property
    doubleShotDuration: number = 10

    doubleShotTimer: number = 0

    @property(Node)
    bulletParent: Node = null

    @property(Prefab)
    bullet1Prefab: Prefab = null

    @property(Prefab)
    bullet2Prefab: Prefab = null

    @property(Node)
    bulletMainPosition: Node = null

    @property(Node)
    bulletLeftPosition: Node = null

    @property(Node)
    bulletRightPosition: Node = null

    @property(AudioClip)
    bulletAudio: AudioClip = null

    @property
    audioVolume: number = 0.3

    @property
    hp: number = 3

    @property(HealthPointsUI)
    hpUI: HealthPointsUI = null

    @property(Animation)
    anim: Animation = null

    @property
    animDown: string = ''

    @property
    animHit: string = ''

    collider: Collider2D = null

    @property
    invincibleDuration: number = 1

    invincibleTimer: number = 0

    isInvincible: boolean = false

    controllable: boolean = true

    @property(AudioClip)
    reward1Audio: AudioClip = null

    @property(AudioClip)
    reward2Audio: AudioClip = null

    @property
    rewardAudioVolume: number = 0.5

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.collider = this.getComponent(Collider2D)
        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this) 
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    start() {
        this.hpUI.updateUI(this.hp.toString())
        GameManager.getInstance().node.on('GAME_PAUSE', () => {
            this.controllable = false
        })
        GameManager.getInstance().node.on('GAME_RESUME', () => {
            this.controllable = true
        })
    }

    update(deltaTime: number) {
        switch (this.gunType) {
            case GunType.SingleShot:
                this.singleShot(deltaTime)
                break
            case GunType.DoubleShot:
                this.doubleShot(deltaTime)
                break
        }

        if (this.isInvincible) {
            this.invincibleTimer += deltaTime
            if (this.invincibleTimer > this.invincibleDuration) {
                this.isInvincible = false
            }
        }
    }

    onTouchMove(event: EventTouch) {
        if (!this.controllable || this.hp <= 0) {
            return
        }
        
        const p = this.node.position
        let target = new Vec3(p.x + event.getDeltaX(), p.y + event.getDeltaY(), p.z)

        if (target.x < this.leftBorder) {
            target.x = this.leftBorder
        }
        if (target.x > this.rightBorder) {
            target.x = this.rightBorder
        }
        if (target.y > this.topBorder) {
            target.y = this.topBorder
        }
        if (target.y < this.bottomBorder) {
            target.y = this.bottomBorder
        }
        this.node.setPosition(target)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const reward = otherCollider.getComponent(Reward)
        if (reward) {
            this.contactWithReward(reward)
        } else {
            this.contactWithEnemy()
        }
    }

    contactWithEnemy() {
        if (this.isInvincible) {
            return
        }

        this.isInvincible = true
        this.invincibleTimer = 0

        this.changeHealthPoints(-1)
        this.anim.play(this.hp > 0 ? this.animHit : this.animDown)
        if (this.hp <= 0) {
            this.crash()
        }
    }

    contactWithReward(reward: Reward) {
        switch (reward.rewardType) {
            case RewardType.DoubleShot:
                AudioManager.inst.playOneShot(this.reward1Audio, this.rewardAudioVolume)
                this.switchToDoubleShot()
                break
            case RewardType.Bomb:
                AudioManager.inst.playOneShot(this.reward2Audio, this.rewardAudioVolume)
                GameManager.getInstance().changeBombStock(1)
                break
        }

        reward.getComponent(Collider2D).enabled = false
        reward.getComponent(Sprite).enabled = false
    }

    switchToSingleShot() {
        this.gunType = GunType.SingleShot
    }

    switchToDoubleShot() {
        this.gunType = GunType.DoubleShot
        this.doubleShotTimer = 0
    }

    singleShot(deltaTime: number) {
        this.shootTimer += deltaTime
        if (this.shootTimer >= this.shootInterval) {
            AudioManager.inst.playOneShot(this.bulletAudio, this.audioVolume)
            this.shootTimer = 0
            const bulletMain = instantiate(this.bullet1Prefab)
            this.bulletParent.addChild(bulletMain)
            bulletMain.setWorldPosition(this.bulletMainPosition.worldPosition)
        }
    }

    doubleShot(deltaTime: number) {
        this.doubleShotTimer += deltaTime
        if (this.doubleShotTimer > this.doubleShotDuration) {
            this.switchToSingleShot()
        }

        this.shootTimer += deltaTime
        if (this.shootTimer >= this.shootInterval) {
            AudioManager.inst.playOneShot(this.bulletAudio, this.audioVolume)
            this.shootTimer = 0

            const bulletLeft = instantiate(this.bullet2Prefab)
            const bulletRight = instantiate(this.bullet2Prefab)

            this.bulletParent.addChild(bulletLeft)
            this.bulletParent.addChild(bulletRight)

            bulletLeft.setWorldPosition(this.bulletLeftPosition.worldPosition)
            bulletRight.setWorldPosition(this.bulletRightPosition.worldPosition)
        }
    }

    changeHealthPoints(increment: number) {
        this.setHeathPoints(this.hp + increment)
    }

    setHeathPoints(hp: number) {
        this.hp = hp
        this.hpUI.updateUI(this.hp.toString())
    }

    crash() {
        this.gunType = GunType.None
        if (this.collider) {
            this.collider.enabled = false
        }
        this.scheduleOnce(() => {
            GameManager.getInstance().gameOver()
        }, 1)
    }
}


