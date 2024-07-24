import { _decorator, Button, Component, instantiate, Node, Prefab, Rect, renderer, Size, Sprite, SpriteFrame, sys, Texture2D, tween, UIOpacity, UITransform, Vec3 } from 'cc';
import { Piece } from './Piece';
import { AudioManager, ESoundEffect } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Picture')
export class Picture extends Component {

    @property(Sprite)
    spritePicture: Sprite = null;

    @property(Prefab)
    prefabPiece: Prefab = null;

    @property(Texture2D)
    texture2D: Texture2D = null;

    @property(Sprite)
    sprite: Sprite = null;

    @property(UIOpacity)
    opacityHint: UIOpacity = null;

    @property
    hintTime: number = 0.5;

    @property(Button)
    btnHint: Button = null;

    @property(Button)
    btnDownload: Button = null;

    public rows: number = 3;
    public columns: number = 3;

    public positions: Vec3[] = [];
    public pieces: Piece[] = [];
    public emptyIndex: number = 0;
    private showHint: boolean = false;

    start() {
        this.initialize();
        this.opacityHint.opacity = 0;
    }

    update(deltaTime: number) {

    }

    private initialize(): void {
        this.positions = this.getAllPositions();
        this.emptyIndex = this.positions.length - 1;
        this.setupPieces();
        this.randomPiece();
        this.btnDownload.node.active = false;
        this.btnHint.node.active = true;
    }

    private setupPieces(): void {
        let x = 0, y = 0;
        let i = 0;
        let count = 0;
        while (this.positions.length > 1) {
            let node = instantiate(this.prefabPiece);
            this.node.addChild(node);
            let pos = this.positions.shift();
            node.position = pos;
            let size = new Size(this.texture2D.width, this.texture2D.height);
            let piece = node.getComponent(Piece);
            piece.picture = this;
            piece.index = count;
            piece.correctPosition = pos;
            this.pieces.push(piece);
            let cutPic = new SpriteFrame();
            cutPic.texture = this.texture2D;
            let r = new Rect(x, y, size.x / this.columns, size.y / this.rows);
            console.log(r);
            cutPic.rect = r;
            piece.sprite.spriteFrame = cutPic;
            if ((count + 1) % 3 === 0) {
                x = 0;
                y += size.height / this.rows;
            }
            else {
                x += size.width / this.columns;
            }
            ++count;
        }
    }

    private getAllPositions(): Vec3[] {
        let positions = [];
        let localScale = this.spritePicture.node.scale;
        let pictureSize = this.spritePicture.getComponent(UITransform).contentSize;
        let width = pictureSize.width * localScale.x;
        let height = pictureSize.y * localScale.y;
        let y = height / this.rows;
        for (let i = 0; i < this.rows; ++i) {
            let x = -(width / this.columns);
            for (let j = 0; j < this.columns; ++j) {
                let pos = new Vec3(x, y);
                positions.push(pos);
                x += width / this.columns;
            }
            y -= height / this.rows;
        }
        return positions;
    }

    public hint(): void {
        AudioManager.playEffect(ESoundEffect.CLICK);
        if (this.showHint) return;
        this.showHint = true;
        tween(this.opacityHint).to(0.3, {opacity: 255}).start();
        this.scheduleOnce(() => {
            tween(this.opacityHint).to(0.3, {opacity: 0}).start();
            this.showHint = false;
        }, this.hintTime + 0.3);
    }

    public openStore(): void {
        AudioManager.playEffect(ESoundEffect.CLICK);
        sys.openURL("https://play.google.com/");
    }

    public checkWin(): boolean {
        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i].checkMatch()) continue;
                return false;
        }
        return true;
    }

    public completed(): void {
        this.btnHint.node.active = false;
        this.btnDownload.node.active = true;
        tween(this.opacityHint).to(0.3, {opacity: 255}).call(() => {
            this.node.active = false;
        }).start();
    }

    public randomPiece(): void {
        let maxLoop = 50;
        let minLoop = 10;
        let loopCount = Math.floor(Math.random() * (maxLoop - minLoop) + minLoop);
        console.log(loopCount);
        while (loopCount > 0) {
            let randomIndex = Math.floor(Math.random() * this.pieces.length);
            this.pieces[randomIndex].moveNow();
            --loopCount;
        }
    }
}


