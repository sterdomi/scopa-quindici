import {CardSet} from "../app/cardSet";
import {Card, CardType} from "../app/card";
import {Playground} from "../app/specialEffects";
import {ScopaMediaMock} from "./simulate";


test('getCardsByPlaygroundAndType', () => {
    let media=new ScopaMediaMock();
    let geld1:Card=new Card("geld1",0,Playground.COMPUTER,CardType.GELD,1,false,media);
    let geld2:Card=new Card("geld2",0,Playground.PLAY,CardType.GELD,2,false,media);
    let stock3:Card=new Card("stock3",0,Playground.PLAY,CardType.SCHWERT,3,false,media);
    let stab9:Card=new Card("stab9",0,Playground.PLAY,CardType.STAB,9,false,media);
    let set:CardSet = new CardSet(geld1,[geld2,stock3,stab9]);
    let result:Card[] = set.getCardsByPlaygroundAndType(Playground.PLAY,CardType.GELD,[geld2,stock3,stab9]);
    expect(result.length).toBe(1);
    expect(result.pop()).toBe(geld2);
});

test('getCardsByPlaygroundAndValue', () => {
    let media=new ScopaMediaMock();
    let geld1:Card=new Card("geld1",0,Playground.COMPUTER,CardType.GELD,1,false,media);
    let geld2:Card=new Card("geld2",0,Playground.PLAY,CardType.GELD,2,false,media);
    let stock3:Card=new Card("stock3",0,Playground.PLAY,CardType.SCHWERT,3,false,media);
    let stab9:Card=new Card("stab9",0,Playground.PLAY,CardType.STAB,9,false,media);
    let set:CardSet = new CardSet(geld1,[geld2,stock3,stab9]);
    let result:Card[] = set.getCardsByPlaygroundAndValue(Playground.PLAY,3,[geld2,stock3,stab9]);
    expect(result.length).toBe(1);
    expect(result.pop()).toBe(stock3);
});

test('hasCardsByTypeAndValue', () => {
    let media=new ScopaMediaMock();
    let geld1:Card=new Card("geld1",0,Playground.COMPUTER,CardType.GELD,1,false,media);
    let geld2:Card=new Card("geld2",0,Playground.PLAY,CardType.GELD,2,false,media);
    let stock3:Card=new Card("schwert3",0,Playground.PLAY,CardType.SCHWERT,3,false,media);
    let stab9:Card=new Card("stab9",0,Playground.PLAY,CardType.STAB,9,false,media);
    let set:CardSet = new CardSet(geld1,[geld2,stock3,stab9]);
    let result:boolean = set.hasCardsByTypeAndValue(CardType.STAB, 3,[geld2,stock3,stab9]);
    let result2:boolean = set.hasCardsByTypeAndValue(CardType.SCHWERT, 3,[geld2,stock3,stab9]);
    expect(result).toBe(false);
    expect(result2).toBe(true);
});