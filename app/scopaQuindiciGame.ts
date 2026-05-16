import {Playground} from "./specialEffects";
import {Card, CardType} from "./card";
import {CardSet} from "./cardSet";
import {Game} from "./game";

export class ScopaQuindici extends Game{
    checkPlaygroundPlay(setEnd: boolean) {
        if (this.getValueOfCardsOnPlaygroundPlay() == 15) {
            this.lastWin = this.activePlayer;
            //await this.delay(300);
            let hasSetteBello = false;
            let hasAnother7 = false;
            let moreCardsOnTable = false;
            for (let card of this.getCardsByPlayground(Playground.PLAY)) {
                if (card.marked) {
                    if (card.type == CardType.GELD && card.value == 7) {
                        hasSetteBello = true;
                    } else if (card.value == 7) {
                        hasAnother7 = true;
                    }
                    card.playground = this.getPlayedPlayground(this.activePlayer);
                    card.internalMark = true;
                    //card.justPlayed = false;
                } else {
                    moreCardsOnTable = true;
                }
            }
            if (!moreCardsOnTable) {
                this.score.scopa(this.activePlayer);
                this.specialEffects.scopa(1);
            }
            if (hasSetteBello && hasAnother7 && this.specialEffects.bomb.moving == false && this.activePlayer == Playground.PLAYER) {
                this.specialEffects.bombClicked(Playground.COMPUTER);
            }
        }
        if (this.shouldDealCards()) {
            this.dealCards();
        }
        if (setEnd && this.isEnd()) {
            this.handleEnd();
        }
    }

    isEnd():boolean{
        let lastCard = this.getLastPlayedCard();
        let retValue = (this.getPlayer()==this.activePlayer &&
            this.getCardsByPlayground(Playground.PLAYER).length==0 &&
            this.getCardsByPlayground(Playground.COMPUTER).length==0 &&
            this.getCardsByPlayground(Playground.CASA).length==0 &&
            (lastCard==null ||
                this.recursiveSearch(lastCard.value,this.getCardsByPlayground(Playground.PLAY),[])!=15||
                this.recursiveSearch(0,this.getCardsByPlayground(Playground.PLAY),[])!=15));
        return retValue;
    }

    permutationsSearch(permutations: boolean[][], card: Card, playCards: Card[],fifteenOfPermutations:CardSet[]) {
        for(let i=0;i<permutations.length;i++){
            let val=card.value;
            for(let j=0;j<permutations[i].length;j++){
                playCards[j].internalMark=permutations[i][j];
                if(permutations[i][j]){
                    val+=playCards[j].value;
                }
            }
            if(val==15){
                fifteenOfPermutations.push(this.getCardsByInternalMark(playCards,card));
            }
            for(let card of playCards){
                card.internalMark=false;
            }
        }
    }

    promiseCards(justPlayedCard:Card):boolean{
        let playCards=this.getCardsByPlayground(Playground.PLAY);
        if(justPlayedCard!=null) {
            let candidateCards = this.getCandidatesOnTable(justPlayedCard);
            if (candidateCards.length != 0) {
                let fifteenCards: Card[] = [];
                let number = this.recursiveSearch(justPlayedCard.value, candidateCards, fifteenCards)
                if (number == 15) {
                    this.highlightNextCardsToPlay(fifteenCards,playCards,justPlayedCard);
                    return true;
                }
            }
        }
        return false;
    }

    isPlayerSwitch():boolean{
        let playCards=this.getCardsByPlayground(Playground.PLAY);
        let justPlayedCard:Card=this.getLastPlayedCard();
        if(justPlayedCard==null){
            return false;
        }
        let candidateCards=this.getCandidatesOnTable(justPlayedCard);
        if(candidateCards.length==0){
            return true; //not possible to take any card
        }
        let fifteenCards:Card[]=[];
        let number=this.recursiveSearch(justPlayedCard.value,candidateCards,fifteenCards)
        if(number==15){
            return this.getValueOfCardsOnPlaygroundPlay() == 15;//player can take cards
        }
        return true;//not possible to take any card
    }

    //playBestCardBetween5And15
    playBestCardPrio3(computerCards: Card[], playCards: Card[],playground:Playground) {
        let card1:Card;
        let card2:Card;
        let card3:Card;
        let wahrscheinlichkeit1=100;
        let wahrscheinlichkeit2=100;
        let wahrscheinlichkeit3=100;

        for(let mc of computerCards){
            if(mc.value!=7 && mc.type!=CardType.GELD){
                card1=mc;
                wahrscheinlichkeit1=this.getProbabilityOfRemainingCards(mc.value,playground);
                break;
            }
        }
        //still no card, try no denari
        for(let mc of computerCards){
            if(mc.type!=CardType.GELD){
                card2=mc;
                wahrscheinlichkeit2=this.getProbabilityOfRemainingCards(mc.value,playground);
                break;
            }
        }
        //still no card, play the best
        let minWahrsheinlicheit=1000;
        for(let mc of computerCards){
            wahrscheinlichkeit3=this.getProbabilityOfRemainingCards(mc.value,playground);
            if(minWahrsheinlicheit>wahrscheinlichkeit3){
                minWahrsheinlicheit=wahrscheinlichkeit3;
                card3=mc;
            }
        }
        if(card3.value!=7){
            return card3
        }else if(wahrscheinlichkeit2>=wahrscheinlichkeit1 && card1!=null){
            return card1;
        }else if(wahrscheinlichkeit1>wahrscheinlichkeit2 && card2!=null){
            return card2;
        }else{
            return card3;
        }

    }

    //playBestCardPrio2
    playBestCardPrio2(computerCards:Card[], playCards:Card[]):Card{
        let valueOfCards = this.getValueOfCards(playCards);
        //try less then 5 points withoud denari
        for (let card of computerCards) {
            if(card.type!=CardType.GELD && card.value+valueOfCards<5){
                return card;
            }
        }
        //try less then 5 points any
        for (let card of computerCards) {
            if(card.value+valueOfCards<5){
                return card;
            }
        }
        //try more then 15 points without 7
        for (let card of computerCards) {
            if(card.value!=7 && card.value+valueOfCards>15){
                return card;
            }
        }
        //try more then 15 points without denari
        for (let card of computerCards) {
            if(card.type!=CardType.GELD && card.value+valueOfCards>15){
                return card;
            }
        }
        //try more then 15 points any
        for (let card of computerCards) {
            if(card.value+valueOfCards>15){
                return card;
            }
        }
        return null;

    }

    getBestOfPermutations(listOfPermutations: CardSet[],playground:Playground):CardSet {
        let maxScore=-1000;
        let retVal:CardSet=null;
        for(let cardSet of listOfPermutations){
            this.scorePermutations(playground,cardSet);
            if(cardSet.score>maxScore){
                maxScore=cardSet.score;
                retVal=cardSet;
            }
        }
        return retVal;
    }

    isEndOfSimulatedGame():boolean{
        let lastCard = this.getLastPlayedCard();
        let retValue = (this.getCardsByPlayground(Playground.PLAYER).length==0 &&
            this.getCardsByPlayground(Playground.COMPUTER).length==0 &&
            this.getCardsByPlayground(Playground.CASA).length==0 &&
            (lastCard==null ||
                this.recursiveSearch(lastCard.value,this.getCardsByPlayground(Playground.PLAY),[])!=15||
                this.recursiveSearch(0,this.getCardsByPlayground(Playground.PLAY),[])!=15));
        return retValue;
    }

    async checkScopaAtBegin(){
        let playCards:Card[]=this.getCardsByPlayground(Playground.PLAY);
        let ret:number=0;
        for(let card of playCards){
            ret+=card.value;
        }
        if(ret==15 || ret==30){
            for(let card of playCards){
                card.marked=true;
            }
            await this.delay(750);
            for(let card of playCards){
                card.playground=this.getPlayedPlayground(this.activePlayer);
            }
        }
        if(ret==15){
            this.score.scopa(this.activePlayer);
            this.specialEffects.scopa(1);
        }else if(ret==30){
            this.score.scopa(this.activePlayer);
            this.score.scopa(this.activePlayer);
            this.specialEffects.scopa(2);
        }
    }

    recursiveSearch(value:number,candidateCards:Card[],fifteenCards:Card[]):number{
        let totalSum=0;
        for (let card of candidateCards) {
            totalSum=totalSum+card.value;
            if(value+card.value==15){
                fifteenCards.push(card);
                return 15;
            }else if(value+card.value<15){
                let subsetCards=this.getAllCardsBut(candidateCards,card);
                if(subsetCards.length==0){
                    return value+card.value;
                }
                let sum=this.recursiveSearch(value+card.value,subsetCards,fifteenCards);
                if(sum==15){
                    fifteenCards.push(card);
                    return 15;
                }else if(sum<15){
                    return sum;
                }
            }
        }
        return value+totalSum;
    }
    scorePermutations(playground:Playground,cardSet:CardSet){
        super.scorePermutations(playground,cardSet);
        this.scoreValueAfter(cardSet, playground);
    }

    private scoreValueAfter(cardSet: CardSet, playground: Playground) {
        //Was nachher noch auf dem Tisch ist (<5 und >15 geben 25 Punkte)
        if (this.getValueAfter(cardSet.setOfPermutations) < 5 || this.getValueAfter(cardSet.setOfPermutations) >= 15) {
            cardSet.score += 25;
        } else {//minus punkte fuer Gefahr einer Scopa
            let scopaCard = 15 - this.getValueAfter(cardSet.setOfPermutations);
            let wahrscheinlichkeit = this.getProbabilityOfRemainingCards(scopaCard, playground);
            cardSet.score -= wahrscheinlichkeit;
        }
    }
}