import { _decorator, Canvas, Component, Size, Node, UITransform, Vec3, view, screen } from 'cc';
const { ccclass, property } = _decorator;



@ccclass('FitContent')
export class FitContent extends Component {

    @property(UITransform)
    uiContent: UITransform = null;

    @property(Node)
    nodeCanvas: Node = null;

    private contentSize;
    onLoad() {
        console.log("_this ", this);
        this.contentSize = new Size(this.uiContent.width, this.uiContent.height);
        this.onUpdateSize();
        this.nodeCanvas.on(Node.EventType.SIZE_CHANGED, this.onUpdateSize, this);
    }

    public onUpdateSize(): void {
        let visibleSize = view.getVisibleSize();
        let ratio
        if (visibleSize.width > visibleSize.height) {
            ratio = visibleSize.height / this.contentSize.height;
        }
        else {
            ratio = visibleSize.width / this.contentSize.width;
        }
        // let scale = this.uiContent.node.scale;
        // this.uiContent.setContentSize(contentSize.width * ratio * scale.x, contentSize.height * ratio * scale.y);
        this.uiContent.node.scale = new Vec3(ratio, ratio, ratio);
    }
}

