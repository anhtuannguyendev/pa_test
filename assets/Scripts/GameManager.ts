import { _decorator, Component, Node, Rect, Sprite, SpriteFrame, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    
    @property(Texture2D)
    texture: Texture2D = null;

    @property(Sprite)
    sprite: Sprite = null;

    protected start(): void {
        let cutPic = new SpriteFrame();
        cutPic.texture = this.texture;
        cutPic.rect = new Rect(0, 0, 100, 100);
        this.sprite.spriteFrame = cutPic;
    }
}


