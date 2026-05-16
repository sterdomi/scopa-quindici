import {CommandoCard, CardType, SoundCard} from "./card";
import {ScopaMedia} from "./scopaMedia";
export enum Playground{
    PLAYER="PLAYER",
    COMPUTER="COMPUTER",
    CASA="CASA",
    PLAY="PLAY",
    GESPIELT_PLAYER="GESPIELT_PLAYER",
    GESPIELT_COMPUTER="GESPIELT_COMPUTER"
}

export enum PlayMode{
    START="START",
    ON_PLAY="ON_PLAY",
    END="END"
}

export class SpecialEffects {
    private media:ScopaMedia;
    private scopaImg: HTMLImageElement;
    private scopa2Img: HTMLImageElement;
    private sound: HTMLAudioElement;
    private slapSound: HTMLAudioElement;
    private scopasound: HTMLAudioElement;
    private boomImg: HTMLImageElement;
    private backImg: HTMLImageElement;
    private bombsound: HTMLAudioElement;
    private newMsg: HTMLAudioElement;
    bomb:CommandoCard;
    back:CommandoCard;
    soundCard:SoundCard;
    blinkImages: HTMLImageElement[] = [];
    blinker: boolean = false;
    soundIsOn: boolean = false;
    isPlaying:boolean = false;
    lastAnger: boolean = false;
    bombImpactSide: Playground | null = null;
    private cracks: {x: number, y: number}[][] = [];
    private impactX: number = 0;
    private impactY: number = 0;

    constructor(media:ScopaMedia){
        this.media=media;
        this.scopaImg=media.getHTMLImageElementByName('scopa');
        this.scopa2Img=media.getHTMLImageElementByName('scopa2');
        this.sound=media.getHTMLAudioElementByName("trinity");
        this.slapSound=media.getHTMLAudioElementByName("slap");
        this.scopasound=media.getHTMLAudioElementByName("scopasound");
        this.boomImg=media.getHTMLImageElementByName('boom');
        this.backImg=media.getHTMLImageElementByName('back');
        this.bombsound=media.getHTMLAudioElementByName("bombsound");
        this.newMsg=media.getHTMLAudioElementByName("ring");
        this.bomb=media.getCommandoCardByName('bomb',1);
        this.back=media.getCommandoCardByName('back',0);
        this.soundCard=this.media.getSoundCardByName('sound_on');
    }

    display(ctx: CanvasRenderingContext2D,player:Playground,activePlayer:Playground,enabled:boolean){
        this.drawCracks(ctx);
        //draw
        ctx.drawImage(this.bomb.getFooterImage(enabled), this.bomb.getPosX(), this.bomb.getPosY(), this.bomb.getWidth(), this.bomb.getHeight());
        ctx.drawImage(this.back.getFooterImage(enabled), this.back.getPosX(), this.back.getPosY()+20, this.back.getWidth()*0.7, this.back.getHeight()*0.7);
        ctx.drawImage(this.soundCard.getIcon(this.soundIsOn), this.soundCard.getPosXByPlayer(player), this.soundCard.getPosY(), this.soundCard.getWidth(), this.soundCard.getHeight());
    }

    isSoundOrBombCardClicked(x:number,y:number,player:Playground):boolean{
        if(this.soundCard.isClickedByPlayer(x,y,player)){
            this.soundIsOn=!this.soundIsOn;
            this.playBackgroundSound();
            return true;
        }
        if(this.bomb.isClicked(x,y)){
            this.bombClicked(player);
        }


        return false;
    }

    async blinkImage(count: number) {
        for (let i: number = 0; i < count; i++) {
            this.blinker = !this.blinker;
            await this.delay(300);
        }
        this.blinkImages = [];
    }
    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    scopa(scopaCount:number): void {
        if(this.scopasound!=undefined) {
            this.scopasound.play();
            if (scopaCount == 1) {
                this.blinkImages[0] = this.scopaImg;
                this.scopasound.play();
            } else {
                this.blinkImages[0] = this.scopa2Img;
                this.scopasound.play();//TODO double scopa sound
            }
            this.blinkImage(4);
        }
    }

    angry(player:Playground): void {
        if (!this.lastAnger) {
            if(player==Playground.PLAYER) {
                this.bombClicked(Playground.COMPUTER);
            }else{
                this.bombClicked(Playground.PLAYER);
            }
        }
    }

    boom(): void {
            this.bombsound.play();
            this.blinkImages[0] = this.boomImg;
            this.blinkImage(2);

    }

    playBackgroundSound() {

        if (this.soundIsOn && !this.isPlaying) {
            this.playScoreSound(false);
            this.sound.loop = true;
            this.sound.play();
            this.isPlaying=true;
        } else if(!this.soundIsOn){
            this.sound.pause();
            this.isPlaying=false;
        }
    }

    playScoreSound(on: boolean){
        if (on) {
            //this.pompieri.loop = true;
            //this.pompieri.play();
        } else {
            //this.pompieri.pause();
        }
    }

    slap() {
        if(this.slapSound!=undefined) {
            this.slapSound.play();
        }
    }

    ring(){
        this.newMsg.play();
    }

    getBombTargetX(player:Playground):number{
        if(player==Playground.PLAYER) {
            return this.bomb.getPosX() + this.media.innerWidth() / 4;
        }else{
            return this.bomb.getPosX() - this.media.innerWidth() / 4;
        }
    }

    getBombFlightDistance(player:Playground){
        let x=this.bomb.getPosX();
        let targetX=this.getBombTargetX(player);
        return x-targetX;

    }

    bombIsFlying(player:Playground,targetX:number):boolean{
        if(player==Playground.PLAYER) {
            return this.bomb.x < targetX;
        }else{
            return this.bomb.x > targetX
        }
    }

    async bombClicked(player:Playground){
        this.bomb.x = this.bomb.getPosX();
        this.bomb.y = this.bomb.getPosY();
        let startY = this.bomb.getPosY();
        let targetX = this.getBombTargetX(player);
        let distance=this.getBombFlightDistance(player);
        let timeToFly=250/distance;
        let amplitude = 200;
        let counter=0;
        this.bomb.moving = true;
        while (this.bombIsFlying(player,targetX)) {
            counter++;
            this.bomb.y = startY + amplitude * Math.sin(this.bomb.x / distance * Math.PI);
            if(player==Playground.PLAYER) {
                this.bomb.x++;
            }else{
                this.bomb.x--;
            }
            if(counter%3==0) {
                await this.delay(timeToFly);
            }
        }
        this.boom();
        this.generateCracks(targetX, player);
        this.bomb.moving=false;
    }

    clearBombImpact() {
        this.bombImpactSide = null;
        this.cracks = [];
    }

    private generateCracks(targetX: number, player: Playground) {
        this.bombImpactSide = player;
        this.cracks = [];
        this.impactX = targetX;
        this.impactY = player === Playground.PLAYER
            ? this.media.innerHeight() * 0.78
            : this.media.innerHeight() * 0.22;

        const numCracks = 6 + Math.floor(Math.random() * 4);
        for (let i = 0; i < numCracks; i++) {
            const angle = (Math.PI * 2 / numCracks) * i + (Math.random() - 0.5) * 0.4;
            this.generateCrackLine(this.impactX, this.impactY, angle, 80 + Math.random() * 130, 0);
        }
    }

    private generateCrackLine(startX: number, startY: number, angle: number, length: number, depth: number) {
        const crack: {x: number, y: number}[] = [{x: startX, y: startY}];
        let curX = startX;
        let curY = startY;
        let curAngle = angle;
        let remaining = length;

        while (remaining > 10) {
            const seg = 15 + Math.random() * 25;
            curAngle += (Math.random() - 0.5) * 0.5;
            curX += Math.cos(curAngle) * seg;
            curY += Math.sin(curAngle) * seg;
            crack.push({x: curX, y: curY});
            remaining -= seg;

            if (depth < 2 && Math.random() < 0.25 && remaining > 30) {
                const branchAngle = curAngle + (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.4);
                this.generateCrackLine(curX, curY, branchAngle, remaining * 0.55, depth + 1);
            }
        }
        this.cracks.push(crack);
    }

    private drawCracks(ctx: CanvasRenderingContext2D) {
        if (this.bombImpactSide === null || this.cracks.length === 0) return;

        ctx.save();

        const grad = ctx.createRadialGradient(this.impactX, this.impactY, 0, this.impactX, this.impactY, 55);
        grad.addColorStop(0, 'rgba(15, 5, 0, 0.8)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.impactX, this.impactY, 55, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#120500';
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.88;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        for (const crack of this.cracks) {
            if (crack.length < 2) continue;
            ctx.beginPath();
            ctx.moveTo(crack[0].x, crack[0].y);
            for (let i = 1; i < crack.length; i++) {
                ctx.lineTo(crack[i].x, crack[i].y);
            }
            ctx.stroke();
        }

        ctx.restore();
    }




}
