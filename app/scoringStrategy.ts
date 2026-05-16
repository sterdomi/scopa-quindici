import {Card, CardType} from "./card";
import {CardSet} from "./cardSet";
import {Playground} from "./specialEffects";
import {Score} from "./score";

export interface GameContext {
    cards: Card[];
    score: Score;
    getCardsByPlayground(p: Playground): Card[];
    getPlayedPlayground(p: Playground): Playground;
    getOtherPlayedPlayground(p: Playground): Playground;
    getProbabilityOfRemainingCards(val: number, playground: Playground): number;
    getValueAfter(cards: Card[]): number;
}

export interface ScoringStrategy {
    score(game: GameContext, playground: Playground, cardSet: CardSet): void;
}

export abstract class BaseScoringStrategy implements ScoringStrategy {
    score(game: GameContext, playground: Playground, cardSet: CardSet): void {
        const pg = game.getPlayedPlayground(playground);
        this.scoreScopa(game, cardSet);
        this.scoreDenari(game, pg, cardSet);
        this.scoreSetteBello(game, cardSet);
        this.scoreAnzahlKarten(game, pg, cardSet);
        this.scorePrimiera(game, pg, cardSet);
        this.scoreRisk(game, playground, cardSet);
    }

    public scoreRisk(game: GameContext, playground: Playground, cardSet: CardSet): void {}

    public scoreScopa(game: GameContext, cardSet: CardSet): void {
        if (cardSet.setOfPermutations.length == game.getCardsByPlayground(Playground.PLAY).length) {
            cardSet.score = 100;
        }
    }

    public scoreSetteBello(game: GameContext, cardSet: CardSet): void {
        cardSet.score += cardSet.hasCardsByTypeAndValue(CardType.GELD, 7, cardSet.setOfPermutations) ? 100 : 0;
        cardSet.score += (cardSet.playerCard.type == CardType.GELD && cardSet.playerCard.value == 7) ? 100 : 0;
    }

    public scoreDenari(game: GameContext, pg: Playground, cardSet: CardSet): void {
        const denariGespielt = cardSet.getCardsByPlaygroundAndType(pg, CardType.GELD, game.cards).length;
        const denariPlay = cardSet.getCardsByPlaygroundAndType(Playground.PLAY, CardType.GELD, cardSet.setOfPermutations).length;
        const denariPlayer = cardSet.playerCard.type == CardType.GELD ? 1 : 0;
        if (denariGespielt > 5) {
            cardSet.score -= 5;
        } else if (denariGespielt + denariPlayer + denariPlay > 5) {
            cardSet.score += 100;
        } else {
            cardSet.score += Math.round((denariPlay + denariPlayer) * 15);
        }
    }

    public scoreAnzahlKarten(game: GameContext, pg: Playground, cardSet: CardSet): void {
        const cardCount = game.getCardsByPlayground(pg).length;
        if (cardCount < 21) {
            if ((cardSet.setOfPermutations.length + 1 + cardCount) > 20) {
                cardSet.score += 100;
            } else {
                cardSet.score += (cardSet.setOfPermutations.length + 1) * 5;
            }
        }
    }

    public scorePrimiera(game: GameContext, pg: Playground, cardSet: CardSet): void {
        const valueOfPrimera = game.score.getValueOfPrimera(game.getCardsByPlayground(pg));
        const primeraOfThis = game.score.getValueOfPrimera(cardSet.setOfPermutations.concat(cardSet.playerCard));
        const primeraTogether = game.score.getValueOfPrimera(game.getCardsByPlayground(pg).concat(cardSet.setOfPermutations).concat(cardSet.playerCard));
        const opponentPg = game.getOtherPlayedPlayground(pg);
        const opponentPrimiera = game.score.getValueOfPrimera(game.getCardsByPlayground(opponentPg));
        if (valueOfPrimera < 26) {
            if (primeraTogether >= 26) {
                cardSet.score += 100;
            } else if (opponentPrimiera < 26) {
                cardSet.score += Math.round(100 / 26 * primeraOfThis);
            }
        } else if (opponentPrimiera < 26) {
            // Defensive: deny opponent key Primiera cards from the table
            const opponentWithCaptures = game.score.getValueOfPrimera(
                game.getCardsByPlayground(opponentPg).concat(cardSet.setOfPermutations)
            );
            const denial = opponentWithCaptures - opponentPrimiera;
            if (denial > 0) {
                cardSet.score += Math.round(50 / 26 * denial);
            }
        }
    }
}

export class EasyScoringStrategy extends BaseScoringStrategy {
    public scoreDenari(): void {}
    public scoreAnzahlKarten(): void {}
    public scorePrimiera(): void {}
}

export class MediumScoringStrategy extends BaseScoringStrategy {
    public scoreRisk(game: GameContext, playground: Playground, cardSet: CardSet): void {
        const tableRemaining = game.getValueAfter(cardSet.setOfPermutations);
        // For placements (no capture), playerCard is added to the table — include its value
        const remaining = cardSet.setOfPermutations.length === 0
            ? tableRemaining + cardSet.playerCard.value
            : tableRemaining;
        const dangerCard = 15 - remaining;
        if (dangerCard >= 1 && dangerCard <= 10) {
            cardSet.score -= game.getProbabilityOfRemainingCards(dangerCard, playground);
        }
    }
}

export class HardScoringStrategy extends BaseScoringStrategy {

}

export class HardWithRiskScoringStrategy extends HardScoringStrategy {
    score(game: GameContext, playground: Playground, cardSet: CardSet): void {
        super.score(game, playground, cardSet);
        if (game.getValueAfter(cardSet.setOfPermutations) > 10) {
            cardSet.score += 25;
        } else {
            const scopaCard = game.getValueAfter(cardSet.setOfPermutations);
            cardSet.score -= game.getProbabilityOfRemainingCards(scopaCard, playground);
        }
    }
}
