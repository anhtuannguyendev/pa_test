import { _decorator, Component, Node, Sprite, Tween, tween, Vec3 } from 'cc';
import { Picture } from './Picture';
import { AudioManager, ESoundEffect } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Piece')
export class Piece extends Component {
    
    @property(Sprite)
    sprite: Sprite = null;

    @property
    duration: number = 0;

    public picture: Picture = null;
    public correctPosition: Vec3;
    public index: number = 0;
    public moving: boolean = false;
    
    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public checkMatch(): boolean {
        let localPosition = this.node.getPosition();
        return this.correctPosition.x === localPosition.x && this.correctPosition.y === localPosition.y;
    }

    private onTouchEnd(event: TouchEvent): void {
        if (!this.canMove()) {
            AudioManager.playEffect(ESoundEffect.WRONG);
            return;
        }
        AudioManager.playEffect(ESoundEffect.SLIDE);
        this.move(this.duration);
    }

    public move(duration: number = 0): void {
        if (this.moving) return;
        this.moving = true;
        let newPos = this.picture.positions.shift();
        let currentPos = this.node.getPosition();
        this.picture.positions.push(currentPos);
        let temp = this.index;
        this.index = this.picture.emptyIndex;
        this.picture.emptyIndex = temp;
        Tween.stopAllByTarget(this.node);
        tween(this.node).to(duration ? duration : 0, {position: newPos}, {easing: "cubicOut"})
            .call(() => {
                this.moving = false;
                if (this.picture.checkWin())
                    this.picture.completed();
            }).start();
    }

    public moveNow(): void {
        let newPos = this.picture.positions.shift();
        let currentPos = this.node.getPosition();
        this.picture.positions.push(currentPos);
        let temp = this.index;
        this.index = this.picture.emptyIndex;
        this.picture.emptyIndex = temp;
        this.node.position = newPos;
    }

    private canMove(): boolean {
        let index1 = this.index;
        let index2 = this.picture.emptyIndex;
        let columns = this.picture.columns;
        let rows = this.picture.rows;
        // Left
        if (index1 % columns === 0) {
            if (index2 === index1 - columns || index2 === index1 + columns || index2 === index1 + 1)
                return true;
            return false;
        }
        else if ((index1 + 1) % columns === 0) {
            if (index2 === index1 - columns || index2 === index1 + columns || index2 === index1 - 1)
                return true;
            return false;
        }
        else {
            if (index2 === index1 - columns || index2 === index1 + columns || index2 === index1 - 1 || index2 === index1 + 1)
                return true;
            return false;
        }
    }
}


