import React, { Component } from "react";
import CardsList from "./CardsList";
import { VIEW_STANDARD, VIEW_IMAGEONLY } from "../components/CardsListItem";

class DeckTester extends Component
{
	constructor(props)
	{
		super(props);
		let { deck } = props;
		let deckCopy = Object.assign({}, deck);
		deckCopy.mainboard = deck.mainboard.slice();
		deckCopy.sideboard = deck.sideboard.slice();
		this.state = { deck: deckCopy, library: [], hand: [], battlefield: [], graveyard: [], exile: [], life: 20 };
	}

	componentWillReceiveProps(nextProps)
	{
		let { deck } = nextProps;
		let deckCopy = Object.assign({}, deck);
		deckCopy.mainboard = deck.mainboard.slice();
		deckCopy.sideboard = deck.sideboard.slice();
		// PARA CADA CARTA EN mainboard CREA UNA COPIA POR count PARA library
		var cards = [];
		deckCopy.mainboard.forEach(card => {
			for (let i = 0; i < card.count; ++i) {
				var cardCopy = Object.assign({}, card);
				cardCopy.count = 1;
				cardCopy.indexInDeck = i;
				cards.push( cardCopy );
			}
		});
		this.setState({ deck: deckCopy, library: cards });
	}
	
	updateState = state =>
	{
		let stateUpdated = Object.assign({}, state);
		stateUpdated.library = state.library.slice();
		stateUpdated.hand = state.hand.slice();
		stateUpdated.battlefield = state.battlefield.slice();
		stateUpdated.graveyard = state.graveyard.slice();
		stateUpdated.exile = state.exile.slice();
//		console.log( "stateUpdated "+ JSON.stringify(stateUpdated) );
		this.setState( stateUpdated );
	}
 
	fold = (state, shouldSetState) =>
	{
		let foldedState = Object.assign({}, state);
		foldedState.library = state.library.slice().concat( state.hand.slice() ).concat( state.battlefield.slice() ).concat( state.graveyard.slice() ).concat( state.exile.slice() );
		foldedState.hand = [];
		foldedState.battlefield = [];
		foldedState.graveyard = [];
		foldedState.exile = [];
		if( shouldSetState )
			this.setState( foldedState );
		return foldedState;
	}
	
	restart()
	{
		// METE TODAS LAS CARTAS EN library
		let stateUpdated = this.fold( this.state );
		// MEZCLA Y ROBA 7 CARTAS
		stateUpdated = this.shuffleLibrary( stateUpdated );
		stateUpdated = this.drawCards(stateUpdated, false, 7);
		this.setState( stateUpdated );
	}
	
	mulligan()
	{
		var mulliganSize = this.state.hand.length > 0 ? this.state.hand.length - 1 : 0;
		// METE TODAS LAS CARTAS EN library
		let stateUpdated = this.fold( this.state );
		// MEZCLA Y ROBA mulliganSize CARTAS
		stateUpdated = this.shuffleLibrary( stateUpdated );
		stateUpdated = this.drawCards(stateUpdated, false, mulliganSize);
		this.setState( stateUpdated );
	}
	
	drawCards = (state, shouldSetState, nCards) =>
	{
		let stateUpdated = Object.assign({}, state);
		// TOMA LAS n CARTAS DEL FINAL DEL ARRAY library Y LAS PONE EN EL ARRAY hand
		stateUpdated.library = state.library.slice(0, -nCards);
		stateUpdated.hand = state.hand.slice();
		stateUpdated.hand = stateUpdated.hand.concat( state.library.slice(-nCards) );
		if( shouldSetState )
			this.setState( stateUpdated );
		return stateUpdated;
	}
	
	shuffleLibrary = (state, shouldSetState) =>
	{
		let stateUpdated = Object.assign({}, state);
		stateUpdated.library = state.library.slice();
		var i, j, temp;
		for(i = stateUpdated.library.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			temp = stateUpdated.library[i];
			stateUpdated.library[i] = stateUpdated.library[j];
			stateUpdated.library[j] = temp;
		}
		if( shouldSetState )
			this.setState( stateUpdated );
		return stateUpdated;
	}
	
	onHandCardClick = cardId =>
	{
		let stateUpdated = Object.assign({}, this.state);

		// SI ES LA UNICA CARTA, ELIMINARLA
		stateUpdated.hand = this.state.hand.slice();
		let cardInHand = stateUpdated.hand.find( card => card.id === cardId );
		if (cardInHand.count > 1) {
			cardInHand.count--;
		} else {
			stateUpdated.hand = stateUpdated.hand.filter(card => card.id !== cardId);
		}

		// PASAR LA CARTA AL BATTLEFIELD
		stateUpdated.battlefield = this.state.battlefield.slice();
		let cardInBattlefield = stateUpdated.battlefield.find( card => card.id === cardId );
		if (cardInBattlefield !== undefined) {
			cardInBattlefield.count++;
		} else {
			let newCard = Object.assign({}, cardInBattlefield);
			newCard.count = 1;
			stateUpdated.battlefield.push(newCard);
		}

		// ACTUALIZAR EL DECK
		this.setState(stateUpdated);
	};

	render()
	{
		return (
			<div id="deckTester">
				<ul className="buttonsListHorizontal">
					<li>
						<button onClick={e => this.restart(e)}>Restart</button>
					</li>
					<li>
						<button onClick={e => this.mulligan(e)}>Mulligan</button>
					</li>
					<li>
						<button onClick={e => this.drawCards(this.state, true, 1, e)}>Draw</button>
					</li>
					<li>
						<button onClick={e => this.props.onCardClick(this.state, true, e)}>Shuffle</button>
					</li>
				</ul>
				<p>Hand ({this.state.hand.length})</p>
				<CardsList
					id="hand"
					cards={this.state.hand}
					onCardClick={this.onHandCardClick}
					view={VIEW_IMAGEONLY}
				/>
				<p>Battlefield ({this.state.battlefield.length})</p>
				<CardsList
					id="bf"
					cards={this.state.battlefield}
					onCardClick={this.onBattlefieldCardClick}
					view={VIEW_IMAGEONLY}
				/>
			</div>
		);
	}
}

export default DeckTester;
