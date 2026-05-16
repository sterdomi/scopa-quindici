import {Card, PLAY_Y} from "./card";
import {Playground, PlayMode, SpecialEffects} from "./specialEffects";
import {ScopaMedia} from "./scopaMedia";
import {Score} from "./score";
import {CardSet} from "./cardSet";
import {BaseScoringStrategy, HardScoringStrategy, GameContext} from "./scoringStrategy";


export abstract class Game implements GameContext {
    playerOneNickname:string;
    playerTwoNickname:string;
    activePlayer:Playground=Playground.PLAYER;
    actionAllowed:boolean=true;
    mode:PlayMode=PlayMode.START;
    cards:Card[]=[];
    lastPos:number=0;
    lastSize:number=null;
    specialEffects:SpecialEffects;
    score:Score;
    lastWin:Playground;
    backButton:boolean=false;
    media:ScopaMedia;
    scoringStrategy: BaseScoringStrategy = new HardScoringStrategy();
    private WAIT_500_MS:number=500;
    private WAIT_2000_MS:number=2000;
    private WAIT_3000_MS:number=3000;
    abstract getBestOfPermutations(listOfPermutations: CardSet[],playground:Playground):CardSet;
    abstract playBestCardPrio2(computerCards:Card[], playCards:Card[]):Card;
    abstract playBestCardPrio3(computerCards: Card[], playCards: Card[],playground:Playground);
    abstract isPlayerSwitch():boolean;
    abstract promiseCards(justPlayedCard:Card):boolean;
    abstract permutationsSearch(permutations: boolean[][], card: Card, playCards: Card[],setOfPermutations:CardSet[]);
    abstract isEnd():boolean;
    abstract isEndOfSimulatedGame():boolean;
    abstract checkScopaAtBegin();
    abstract checkPlaygroundPlay(setEnd: boolean);

    constructor(specialEffects:SpecialEffects,score:Score,media:ScopaMedia){
        this.specialEffects=specialEffects;
        this.score=score;
        this.media=media;
    }

    shuffle () {
        let i = 0
            , j = 0
            , temp = null

        for (i = this.cards.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1))
            temp = this.cards[i]
            this.cards[i] = this.cards[j]
            this.cards[j] = temp
        }
    }

    getPlayerOneNickname(): string {
        return this.playerOneNickname;
    }

    setPlayerOneNickname(name:string) {
        this.playerOneNickname=name;
    }

    arrangeCardsOnPlaygroundPlay(){
        let playCards=this.getCardsByPlayground(Playground.PLAY);
        let counter=0;
        playCards.sort((n1,n2) => {
            if (n1.pos > n2.pos) {
                return 1;
            }

            if (n1.pos < n2.pos) {
                return -1;
            }

            return 0;
        });
        for(let card of playCards){
            card.pos=counter;
            counter++;
        }
        this.lastPos=counter;
    }

    getCardsByPlayground(playground:Playground):Card[]{
        return this.cards.filter(card=>card.playground==playground);
    }

    getCandidatesOnTable(playedCard:Card):Card[]{
        return this.getCardsByPlayground(Playground.PLAY).filter(card=>card!=playedCard);
    }

    getValueOfCards(myCards:Card[]):number{
        return myCards.reduce((a:number, b:Card) => a + b.value, 0);
    }

    getValueOfCardsOnPlaygroundPlay():number{
        let playCards=this.getCardsByPlayground(Playground.PLAY);
        let filteredPlayCards=playCards.filter(card=>card.marked);
        let value=filteredPlayCards.reduce((a:number,b:Card)=>a+b.value,0);
        return value;
    }

    demark():void{
        for(let aCard of this.cards) {
            aCard.marked = false;
            aCard.justPlayed = false;
        }
    }

    // Finds the highest-scoring valid capture: generates all 2^n subsets of table cards,
    // checks each hand card against every subset, then picks the best scoring match.
    getBestCardSet(playCards:Card[],playerOrComputerCards:Card[],player:Playground):CardSet{
        let permutations:boolean[][]=this.getPermutations(playCards.length);
        let setOfPermutations:CardSet[]=[];
        for (let card of playerOrComputerCards) {
            this.permutationsSearch(permutations, card, playCards, setOfPermutations);
        }
        let set:CardSet = this.getBestOfPermutations(setOfPermutations,player);
        return set;
    }


    getCardToPlay(player:Playground){
        let playCards = this.cleanupCards();
        let computerCards=this.getCardsByPlayground(player);

        let set:CardSet = this.getBestCardSet(playCards,computerCards,Playground.COMPUTER);
        if (set !=null) {
            for (let card of set.setOfPermutations) {
                card.mark();
            }
            return set.playerCard
        }else{
            let card=this.playBestCardPrio2(computerCards,playCards);
            if(card==null) {
                card=this.playBestCardPrio3(computerCards,playCards,player);
            }
            return card;
        }
    }

    getTimeToWait(){
        let markedCards=this.getCardsByPlayground(Playground.PLAY).filter(card=>card.marked);
        if(markedCards.length==1){
            return this.WAIT_500_MS;//short because just played one card
        }else{
            return this.WAIT_2000_MS;// long to see which cards are taken
        }
    }

    computerMove(player:Playground):number {
        let computerCards=this.getCardsByPlayground(player);
        if(computerCards.length==0){
            return this.WAIT_500_MS;
        }
        let cardToPlay=this.getCardToPlay(player);
        this.playCard(cardToPlay);
        return this.getTimeToWait();
    }


    private playCard(card: Card) {
        card.mark();
        this.specialEffects.slap();
        card.justPlayed = true;
        this.move(card, card.getPlayPosition(this.lastPos), PLAY_Y, this.lastPos - 1);
        this.lastPos++;
    }

    private cleanupCards() {
        let internalCards = this.getCardsByInternalMark(this.cards, null).setOfPermutations;
        for (let card of internalCards) {
            card.internalMark = false;
        }
        let playCards = this.getCardsByPlayground(Playground.PLAY);
        for (let card of playCards) {
            card.internalMark = false;
        }
        return playCards;
    }

    getValueAfter(myCards:Card[]):number{
        let cardsOnTable=this.getCardsByPlayground(Playground.PLAY);
        const intersection = cardsOnTable.filter(e => myCards.indexOf(e) == -1);
        let value=intersection.reduce((a:number,b:Card)=>a+b.value,0);
        return value;
    }


    isValidGameCardClick(x:number,y:number):boolean{
        if(this.specialEffects.isSoundOrBombCardClicked(x,y,this.getPlayer())){
            return false;
        }
        if(this.specialEffects.back.isClicked(x,y) && this.hasInternalMarks()){
            this.showLastCards();
            return false;
        }
        //only activePlayer can click. Action must be allowed
        if(this.getPlayer()!=this.activePlayer || !this.actionAllowed){
            return false;
        }

        if(this.getCardsByPlayground(Playground.PLAYER).length<this.getCardsByPlayground(Playground.COMPUTER).length){
            for (let card of this.cards) {
                if(card.isClicked(x,y) && card.playground==Playground.PLAYER){
                    return false;
                }
            }
        }
        return true;
    }

    justPlayedMarker(card:Card){
        for (let pcard of this.cards) {
            pcard.justPlayed=false;
        }
        card.justPlayed = true;
    }

    handleValidGameCardClick(x: number, y: number){
        this.actionAllowed=false;
        this.arrangeCardsOnPlaygroundPlay();
        for (let card of this.cards) {
            if(card.isClicked(x,y)  && (card.playground==this.activePlayer||card.playground==Playground.PLAY||card.playground==Playground.CASA)){
                if(card.playground!=Playground.PLAY) {
                    this.justPlayedMarker(card);
                }
                if(card.playground==Playground.PLAYER){
                    this.playCard(card);
                }else{
                    card.mark();
                }
            }
        }
        this.actionAllowed=true;
    }

    cardClicked(x:number,y:number){
        let validClick=this.isValidGameCardClick(x,y);
        if(validClick){
            this.handleValidGameCardClick(x,y);
            if(this.isPlayerSwitch()){
                this.checkPlaygroundPlay(true);
                this.demark();
                this.activePlayer=Playground.COMPUTER;
            }else {
               this.promiseCards(this.getLastPlayedCard());
               if(this.isEnd()){
                   this.handleEnd();
               }
            }
            this.sizeCheck();
        }
    }

    hasInternalMarks(){
        return this.getCardsByInternalMark(this.cards,null).setOfPermutations.length>0
    }

    async showLastCards(){
        this.backButton=true;
        this.specialEffects.soundIsOn=false;
        this.actionAllowed=false;
        let cards:Card[]=this.getCardsByInternalMark(this.cards,null).setOfPermutations;
        let oldPlaygrounds:Playground[]=[];
        for(let card of cards){
            oldPlaygrounds.push(card.playground);
            card.playground=Playground.PLAY
        }
        this.arrangeCardsOnPlaygroundPlay();
        await this.delay(this.WAIT_3000_MS);
        for(let card of cards){
            card.playground=oldPlaygrounds.pop();
        }
        this.backButton=false;
        this.specialEffects.soundIsOn=true;
        this.actionAllowed=true;
    }

    move(card: Card, futurePosX: number, futurePosY: number, lastPos: number) {
        this.actionAllowed = false;
        card.pos = lastPos + 1;
        card.y = PLAY_Y;
        card.x = futurePosX;
        card.playground = Playground.PLAY;
        card.moving = false;
        this.actionAllowed = true;
    }

    stateOfGame(){
        let playerCards: Card[] = this.getCardsByPlayground(this.activePlayer);
        if(this.activePlayer==Playground.PLAYER){
            this.blinker(playerCards, 4);
            let combFound: Boolean = false;
            for (let card of playerCards) {
                if (!combFound) {
                    combFound = this.promiseCards(card);
                }
            }
        }
    }

    getAllCardsBut(allCards:Card[],butCard:Card){
        return allCards.filter(card=>card!=butCard)
    }

    // Returns all 2^size subsets of table cards as boolean arrays, encoded from binary:
    // e.g. size=3 → [true,true,true], [true,true,false], … [false,false,false]
    getPermutations(size: number): boolean[][] {
        let permutations:boolean[][]=[];
        if(size==0){
            return permutations;
        }
        for (let i = 0; i < Math.pow(2, size); i++) {
            let bin:string = i.toString(2);
            while (bin.length < size) {
                bin = "0" + ""+bin;
            }
            let chars = bin.split('');
            let boolArray = [];
            for (let j = 0; j < chars.length; j++) {
                boolArray[j] = chars[j] == '0' ? true : false;
            }
            permutations[i]=boolArray;
        }
        return permutations;
    }

    dealCards(){
        let nextCards=this.getCardsByPlayground(Playground.CASA);
        if(nextCards.length>=6) {
            if(this.getCardsByPlayground(Playground.PLAYER).length==0) {
                for (let i = 0; i < 3; i++) {
                    nextCards[i].playground = Playground.PLAYER;
                    nextCards[i].pos = i;
                }
            }
            if(this.getCardsByPlayground(Playground.COMPUTER).length==0) {
                for (let i = 3; i < 6; i++) {
                    nextCards[i].playground = Playground.COMPUTER;
                    nextCards[i].pos = i - 3;
                }
            }
            this.specialEffects.clearBombImpact();
        }
    }

    getPlayedPlayground(player:Playground):Playground{
        if(player==Playground.PLAYER){
            return Playground.GESPIELT_PLAYER
        }else{
            return Playground.GESPIELT_COMPUTER;
        }
    }

    getOtherPlayedPlayground(player:Playground):Playground{
        if(player==Playground.PLAYER){
            return Playground.GESPIELT_COMPUTER;
        }else{
            return Playground.GESPIELT_PLAYER;
        }
    }

    shouldDealCards():boolean{
        let retVal:boolean=false;
        retVal = this.getCardsByPlayground(Playground.PLAYER).length == 0;
        retVal = retVal && this.getCardsByPlayground(Playground.COMPUTER).length == 0;
        return retVal;

    }

    getLastPlayedCard(){
        let dCards=this.getCardsByPlayground(Playground.PLAY);
        for(let card of dCards){
            if(card.justPlayed){
                return card;
            }
        }
        return null;
    }

    handleEnd(){
        this.score.calculate(this);
        this.mode=PlayMode.END;
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    sizeCheck():void{
        //check factor:
        let sizeViolatedMax=false;
        let sizeViolatedMin=false;

        for (let card of this.cards) {
            if(Card.factor>=0 && card.getPosX()+card.getWidth()>(window.innerWidth-20)){
                sizeViolatedMax=true;
                this.lastSize=(window.innerWidth-20);
            }
            if(Card.factor<=1.0 && card.getPosX()+(card.getWidth()/2)<(window.innerWidth-20)){
                sizeViolatedMin=true;
            }
        }
        if(sizeViolatedMax){
            Card.factor = Card.factor - 0.1;
        }else if(sizeViolatedMin && this.lastSize<(window.innerWidth-20)){
            Card.factor = Card.factor + 0.1;
            this.lastSize=(window.innerWidth-20);
        }
    }

    display(ctx: CanvasRenderingContext2D):void{
        //this.sizeCheck();
        this.displayLabels(ctx);
        if(this.backButton){
            this.displayLastCardsByComputer(ctx);
        }else {
            this.displayCards(ctx);
            this.displaySpecialEffects(ctx);
        }
    }

    private displayLabels(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "white";
        ctx.font = "26px serif";
        let posY = this.media.innerHeight() - 30 - (((270) / 720 * this.media.innerHeight()) * Card.factor)
        ctx.fillText(this.getPlayerOneNickname(), this.media.innerWidth() / 2 - 130, posY);
        ctx.fillText("Computer", this.media.innerWidth() / 2 + 15, posY);
    }

    private displaySpecialEffects(ctx: CanvasRenderingContext2D) {
        this.specialEffects.display(ctx, this.getPlayer(), this.activePlayer, this.hasInternalMarks());
        for (let funImg of this.specialEffects.blinkImages) {
            ctx.drawImage(funImg, 0, 0, this.media.innerWidth(), this.media.innerHeight());
        }
    }

    private displayCards(ctx: CanvasRenderingContext2D) {
        for (let card of this.cards) {
            if (card.playground != Playground.CASA) {
                ctx.drawImage(card.getImage(this.getPlayer()), card.getPosX(), card.getPosY(), card.getWidth(), card.getHeight());
                if (card.highlighted || card.marked) {
                    this.drawGreenLineStroke(ctx, card);
                }
            }
        }
    }

    private drawGreenLineStroke(ctx: CanvasRenderingContext2D, card: Card) {
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'green';
        const y=card.getPosY() + card.getHeight()
        ctx.moveTo(card.getPosX(), y);
        ctx.lineTo(card.getPosX() + card.getWidth(), y);
        ctx.stroke();
    }

    private displayLastCardsByComputer(ctx: CanvasRenderingContext2D) {
        let lastPlayedCards = this.getCardsByInternalMark(this.cards, null).setOfPermutations;
        for (let card of this.cards) {
            if (card.playground != Playground.CASA) {
                ctx.drawImage(card.getImage(this.getPlayer()), card.getPosX(), card.getPosY(), card.getWidth(), card.getHeight());
            }
        }
        for (let card of lastPlayedCards) {
            ctx.drawImage(card.getImage(this.getPlayer()), card.getPosX(), card.getPosY(), card.getWidth(), card.getHeight());
            this.drawGreenLineStroke(ctx,card);
        }
    }

    getPlayer():Playground{
        return Playground.PLAYER
    }

    getOtherPlayer():Playground{
        return Playground.COMPUTER
    }

    getPlayerText(actPlayer:Playground,actPlayground:Playground){
        if(actPlayer==actPlayground){
            return this.playerOneNickname;
        }else{
            return this.playerTwoNickname;
        }
    }

    getWinMsg(language: string, nickname: string): string {
        if(language=='de'){
            return nickname + ' gewinnt!'
        }else if(language=='en'){
            return nickname + ' wins!';
        }else{
            return nickname + ' vince!';
        }
    }

    showScore(ctx: CanvasRenderingContext2D, cardIntro: Card, cardIntro2: Card, language: string, nickname: string, counter: number, innerWidth: number):void{
        ctx.font = "32px serif";
        ctx.fillStyle = "white";
        ctx.drawImage(cardIntro.getImage(Playground.CASA), cardIntro.getPosX(), cardIntro.getPosY(), cardIntro.getWidth(), cardIntro.getHeight());
        if(counter==2) {
            ctx.drawImage(cardIntro2.getImage(Playground.CASA), cardIntro2.getPosX(), cardIntro2.getPosY(), cardIntro2.getWidth(), cardIntro2.getHeight());
        }
        let xLeft=(innerWidth/2) -300;
        let xRight=(innerWidth/2)+200;
        ctx.fillText(this.getPlayerOneNickname(), xLeft, 80);
        ctx.fillText("Carte:" + this.score.cardCountPlayer1, xLeft, 120);
        ctx.fillText("Denari: " + this.score.denariCountPlayer1, xLeft, 160);
        ctx.fillText(Playground.PLAYER==this.score.setteBello?"Sette bello: 1":"Sette bello: 0", xLeft, 200);
        ctx.fillText(Playground.PLAYER==this.score.primera?"Primiera: 1":"Primiera: 0", xLeft, 240);
        ctx.fillText("Scope:"  + this.score.scopaPlayer1, xLeft, 280);
        ctx.fillText((language=='it'?"Totalmente:":'Total:') + this.score.scorePlayer1, xLeft, 320);

        ctx.fillText("Computer", xRight, 80);
        ctx.fillText("Carte: " + this.score.cardCountComputer, xRight, 120);
        ctx.fillText("Denari: " + this.score.denariCountComputer, xRight, 160);
        ctx.fillText(Playground.COMPUTER==this.score.setteBello?"Sette bello: 1":"Sette bello: 0", xRight, 200);
        ctx.fillText(Playground.COMPUTER==this.score.primera?"Primiera: 1":"Primiera: 0", xRight, 240);
        ctx.fillText("Scope: " + this.score.scopaComputer, xRight, 280);
        ctx.fillText((language=='it'?"Totalmente:":'Total:') + this.score.scoreComputer, xRight, 320);

        if(this.score.scorePlayer1>=15 && this.score.scorePlayer1>this.score.scoreComputer){
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.getWinMsg(language,nickname), this.media.innerWidth()/2-6, 80);
        }
        if(this.score.scoreComputer>=15 && this.score.scoreComputer>this.score.scorePlayer1){
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.getWinMsg(language,'computer'), this.media.innerWidth()/2-9, 80);
        }
    }

    async blinker(cards: Card[], count: number) {
        for (let card of cards) {
            card.highlighted = false;
        }
        for (let i: number = 0; i < count; i++) {
            for (let card of cards) {
                card.highlighted = !card.highlighted;
            }
            await this.delay(300);
        }
        for (let card of cards) {
            card.highlighted = false;
        }
    }

    cardsAreIdendical(cards1: Card[],cards2: Card[]){
        if(cards1.length!=cards2.length){
            return false;
        }
        let counter=0;
        for(let card of cards1){
            if(card.type!=cards2[counter].type || card.value!=cards2[counter].value){
                return false;
            }
            counter++;
        }
        return true;
    }

    async highlightNextCardsToPlay(cards: Card[],playCards: Card[],justPlayedCard:Card) {
        await this.delay(5000);
        if(this.cardsAreIdendical(playCards,this.getCardsByPlayground(Playground.PLAY))) {
            for (let card of cards) {
                card.highlighted = false;
            }
            for (let i: number = 0; i < 4; i++) {
                for (let card of cards) {
                    card.highlighted = !card.highlighted;
                }
                justPlayedCard.highlighted= !justPlayedCard.highlighted;
                await this.delay(300);
            }
            for (let card of cards) {
                card.highlighted = false;
            }
        }
    }

    getCardsByInternalMark(cards: Card[],card:Card):CardSet{
        let cardSet:CardSet=new CardSet(card,cards.filter(c=>c.internalMark));
        return cardSet;
    }


    getProbabilityOfRemainingCards(val:number,playground:Playground){
        if(val==0){
            return 0;
        }
        const playGroundGespielt=this.getPlayedPlayground(playground);
        const andererPlayerGespielt=this.getOtherPlayedPlayground(playground);
        // Count every copy of this value that the current mover can already see:
        // own hand, table, and both capture piles.
        const seenCount = this.cards.filter(card=>
            card.value===val && (
                card.playground===playground ||
                card.playground===Playground.PLAY ||
                card.playground===playGroundGespielt ||
                card.playground===andererPlayerGespielt
            )
        ).length;
        const unseenVal = Math.max(0, 4 - seenCount);
        if(unseenVal===0) return 0;
        // Unknown cards from the current mover's perspective = deck + opponent's hand.
        const opponentPlayground = playground===Playground.COMPUTER ? Playground.PLAYER : Playground.COMPUTER;
        const unknownCount = this.getCardsByPlayground(Playground.CASA).length +
                             this.getCardsByPlayground(opponentPlayground).length;
        if(unknownCount===0) return 0;
        return Math.round(100 * unseenVal / unknownCount);
    }

    scorePermutations(playground: Playground, cardSet: CardSet) {
        this.scoringStrategy.score(this, playground, cardSet);
    }

    scoreScopa(cardSet: CardSet): void { this.scoringStrategy.scoreScopa(this, cardSet); }
    scoreSetteBello(cardSet: CardSet): void { this.scoringStrategy.scoreSetteBello(this, cardSet); }
    scoreDenari(pg: Playground, cardSet: CardSet): void { this.scoringStrategy.scoreDenari(this, pg, cardSet); }
    scoreAnzahlKarten(pg: Playground, cardSet: CardSet): void { this.scoringStrategy.scoreAnzahlKarten(this, pg, cardSet); }
    scorePrimeria(pg: Playground, cardSet: CardSet): void { this.scoringStrategy.scorePrimiera(this, pg, cardSet); }
}



