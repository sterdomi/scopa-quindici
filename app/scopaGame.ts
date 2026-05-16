import {Playground, SpecialEffects} from "./specialEffects";
import {Card, CardType} from "./card";
import {CardSet} from "./cardSet";
import {Game} from "./game";
import {HardWithRiskScoringStrategy} from "./scoringStrategy";
import {Score} from "./score";
import {ScopaMedia} from "./scopaMedia";

export class Scopa extends Game {

    constructor(specialEffects: SpecialEffects, score: Score, media: ScopaMedia) {
        super(specialEffects, score, media);
        this.scoringStrategy = new HardWithRiskScoringStrategy();
    }

    isEnd(): boolean {
        let lastCard = this.getLastPlayedCard();
        let playCards=this.getCardsByPlayground(Playground.PLAY).filter(card=>card!=lastCard);
         let possibleCombination=this.getBestCardSet(playCards,[lastCard],this.activePlayer);
        let retValue = (this.getPlayer() == this.activePlayer &&
            this.getCardsByPlayground(Playground.PLAYER).length == 0 &&
            this.getCardsByPlayground(Playground.COMPUTER).length == 0 &&
            this.getCardsByPlayground(Playground.CASA).length == 0 &&
            (lastCard == null || possibleCombination==null));
        return retValue;
    }

    // For each subset in permutations: if the subset's total equals the played card's value,
    // it is a valid capture and added to the result. Same-value match short-circuits all others
    // (Scopa rule: an exact match on the table must be taken instead of a sum combination).
    permutationsSearch(permutations: boolean[][], selectedComputerCard: Card, playCardsOnTable: Card[], selectedOfPermutations: CardSet[]) {
        //first check if the exact value of the card is on the table (rule: same card first)
        if(!selectedComputerCard){
            return;
        }
        let sameValueCard=playCardsOnTable.find(cardOnPlay=>cardOnPlay.value==selectedComputerCard.value && selectedComputerCard!=cardOnPlay);
        if(sameValueCard){
            let cardSet:CardSet=new CardSet(selectedComputerCard,[sameValueCard]);
            selectedOfPermutations.push(cardSet);
            return; //only this combination is valid!
        }

        for (let i = 0; i < permutations.length; i++) {
            let val = 0;
            for (let j = 0; j < permutations[i].length; j++) {
                playCardsOnTable[j].internalMark = permutations[i][j];
                if (permutations[i][j]) {
                    val += playCardsOnTable[j].value;
                }
            }
            if (val == selectedComputerCard.value) {
                selectedOfPermutations.push(this.getCardsByInternalMark(playCardsOnTable, selectedComputerCard));
            }
            for (let card of playCardsOnTable) {
                card.internalMark = false;
            }
        }
    }

    promiseCards(justPlayedCard: Card): boolean {
        let playCards = this.getCardsByPlayground(Playground.PLAY);
        if (justPlayedCard != null) {
            let candidateCards = this.getCandidatesOnTable(justPlayedCard);
            if (candidateCards.length != 0) {
                let cardSet:CardSet = this.getBestCardSet(playCards,[justPlayedCard],Playground.PLAYER);
                if (cardSet) {
                    this.highlightNextCardsToPlay(cardSet.setOfPermutations, playCards, justPlayedCard);
                    return true;
                }
            }
        }
        return false;
    }

    hasSameCardOnTable(myCardVal:number,playCardsOnTable:Card[]):boolean{
        let availableCards=playCardsOnTable.filter(card=>myCardVal==card.value);
        if(availableCards.length==0){
            return false;
        }
        return availableCards.find(card=>card.marked)==null;
    }

    getCardsByMarkButNotMyOwn(justPlayedCard:Card){
        let cards=this.getCardsByPlayground(Playground.PLAY).filter(card=>card!=justPlayedCard && card.marked);
        return cards;
    }

    checkPlaygroundPlay(setEnd: boolean) {
        let justPlayedCard: Card = this.getLastPlayedCard();
        let selectedCards=this.getCardsByMarkButNotMyOwn(justPlayedCard);
        let valueOfMarkedCards=selectedCards.reduce((sum, current) => sum + current.value, 0);
        if(!justPlayedCard){
            return;
        }
        if (valueOfMarkedCards == justPlayedCard.value) {
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

    isPlayerSwitch(): boolean {
        let playCards = this.getCardsByPlayground(Playground.PLAY);
        let justPlayedCard: Card = this.getLastPlayedCard();
        if (justPlayedCard == null) {
            return false;
        }
        let candidateCards = this.getCandidatesOnTable(justPlayedCard);
        if (candidateCards.length == 0) {
            return true; //not possible to take any card
        }
        let selectedCards = this.getCardsByMarkButNotMyOwn(justPlayedCard);
        let cardsOnTable = this.getAllCardsBut(this.getCardsByPlayground(Playground.PLAY), justPlayedCard);
        //Wenn mehrere Karten auf dem Tisch ausgewaehlt wurden aber eine Karte mit demselben Wert dort liegt.
        if (this.hasSameCardOnTable(justPlayedCard.value, cardsOnTable) && selectedCards.length > 1) {
            return false;
        }
        let valSelectedCards = selectedCards.reduce((sum, current) => sum + current.value, 0);
        if(valSelectedCards == justPlayedCard.value){
            return true;//player has correct cards.
        }
        let cardSet:CardSet = this.getBestCardSet(playCards.filter(pcard=>pcard!=justPlayedCard),[justPlayedCard],Playground.PLAYER);
        return cardSet==null;

    }



    //playBestCardBetween5And15
    playBestCardPrio3(computerCards: Card[], playCards: Card[], playground: Playground) {
        let card1: Card = null;
        let card2: Card = null;
        let card3: Card = null;
        let wahrscheinlichkeit1 = Infinity;
        let wahrscheinlichkeit2 = Infinity;
        let wahrscheinlichkeit3 = Infinity;

        for (let mc of computerCards) {
            const prob = this.getProbabilityOfRemainingCards(mc.value, playground);
            if (mc.value !== 7 && mc.type !== CardType.GELD && prob < wahrscheinlichkeit1) {
                wahrscheinlichkeit1 = prob;
                card1 = mc;
            }
            if (mc.type !== CardType.GELD && prob < wahrscheinlichkeit2) {
                wahrscheinlichkeit2 = prob;
                card2 = mc;
            }
            if (prob < wahrscheinlichkeit3) {
                wahrscheinlichkeit3 = prob;
                card3 = mc;
            }
        }

        if (card3.value !== 7) {
            return card3;
        } else if (card1 !== null && wahrscheinlichkeit1 <= wahrscheinlichkeit2) {
            return card1;
        } else if (card2 !== null) {
            return card2;
        } else {
            return card3;
        }
    }

    //playBestCardPrio2
    playBestCardPrio2(computerCards: Card[], playCards: Card[]): Card {
        let valueOfCards = this.getValueOfCards(playCards);

        //try more then 10 points without 7
        for (let card of computerCards) {
            if (card.value != 7 && card.value + valueOfCards > 10) {
                return card;
            }
        }
        //try more then 10 points without denari
        for (let card of computerCards) {
            if (card.type != CardType.GELD && card.value + valueOfCards > 10) {
                return card;
            }
        }
        //try more then 10 points any
        for (let card of computerCards) {
            if (card.value + valueOfCards > 10) {
                return card;
            }
        }
        return null;
    }

    getBestOfPermutations(listOfPermutations: CardSet[], playground: Playground): CardSet {
        let maxScore = -1000;
        let retVal: CardSet = null;
        for (let cardSet of listOfPermutations) {
            this.scorePermutations(playground, cardSet);
            if (cardSet.score > maxScore) {
                maxScore = cardSet.score;
                retVal = cardSet;
            }
        }
        return retVal;
    }

    isEndOfSimulatedGame(): boolean {
        let lastCard = this.getLastPlayedCard();
        let playCards=this.getCardsByPlayground(Playground.PLAY).filter(card=>card!=lastCard);
        let possibleCombination=this.getBestCardSet(playCards,[lastCard],this.activePlayer);
        let retValue = (this.getCardsByPlayground(Playground.PLAYER).length == 0 &&
            this.getCardsByPlayground(Playground.COMPUTER).length == 0 &&
            this.getCardsByPlayground(Playground.CASA).length == 0 &&
            (lastCard == null ||
                possibleCombination==null));
        return retValue;
    }

    async checkScopaAtBegin() {
        // noop, gibt es nicht
    }

}