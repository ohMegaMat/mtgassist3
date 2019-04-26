import React, { Component } from "react";

class DeckTester extends Component
{
	constructor()
	{
		super()
		let { deck } = this.props;
		let deckCopy = Object.assign({}, deck);
		deckCopy.mainboard = deck.mainboard.slice();
		deckCopy.sideboard = deck.sideboard.slice();
		this.state = { deck: deckCopy, library: [], hand: [], battlefield: [], graveyard: [], exile: [], life: 20 };
	}

	updateState = state =>
	{
		let stateUpdated = Object.assign({}, state);
		stateUpdated.library = state.library.slice();
		stateUpdated.hand = state.hand.slice();
		stateUpdated.battlefield = state.battlefield.slice();
		stateUpdated.graveyard = state.graveyard.slice();
		stateUpdated.exile = state.exile.slice();
		console.log( "stateUpdated "+ JSON.stringify(stateUpdated) );
		this.setState( stateUpdated );
	}
 
	fold = (state, shouldSetState) =>
	{
		var foldedState = state.copy;
		foldedState.library = foldedState.library.concat( this.state.hand.slice() ).concat( this.state.battlefield.slice() ).concat( this.state.graveyard.slice() ).concat( this.state.exile.slice() );
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
		let stateUpdated = Object.assign({}, this.state);
		// METE TODAS LAS CARTAS EN library
		stateUpdated = this.fold( stateUpdated );
		// MEZCLA Y ROBA 7 CARTAS
		stateUpdated = this.shuffleLibrary();
		stateUpdated = this.drawCards( 7 );
		this.setState( stateUpdated );
	}
	
	mulligan()
	{
		let stateUpdated = Object.assign({}, this.state);
		var mulliganSize = this.state.hand.lenght - 1;
		// METE TODAS LAS CARTAS EN library
		stateUpdated = this.fold( stateUpdated );
		// MEZCLA Y ROBA mulliganSize CARTAS
		stateUpdated = this.shuffleLibrary();
		stateUpdated = this.drawCards( mulliganSize );
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
		let stateUpdated = Object.assign({}, this.state);
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
		console.log( "onMainBoardCardClick" );

		let { deck } = this.props;
		let deckCopy = Object.assign({}, deck);

		// SI ES LA UNICA CARTA, ELIMINARLA
		deckCopy.mainboard = deck.mainboard.slice();
		let cardInMainBoard = deckCopy.mainboard.find( card => card.id === cardId );
		if( cardInMainBoard.count > 1 ) {
			cardInMainBoard.count--;
		}
		else {
			deckCopy.mainboard = deckCopy.mainboard.filter( card => card.id !== cardId );
		}

		// SI NO ES TIERRA BASICA, PASAR LA CARTA AL SIDEBOARD
		let landCard = LANDS_DEFINITION.find( card => card.id === cardId );
		if( landCard === undefined ) {
			deckCopy.sideboard = deck.sideboard.slice();
			let cardInSideBoard = deckCopy.sideboard.find( card => card.id === cardId );
			if( cardInSideBoard !== undefined ) {
				cardInSideBoard.count++;
			}
			else {
				let newCard = Object.assign({}, cardInMainBoard);
				newCard.count = 1;
				deckCopy.sideboard.push( newCard );
			}
		}

		// ACTUALIZAR EL DECK
		this.props.onUpdateDeck( deckCopy );
	};

	render()
	{
		return (
			<div id="deckTester">
				<ul>
					<li><button onClick={this.restart}>Restart</button></li>
					<li><button onClick={this.mulligan}>Mulligan</button></li>
					<li><button onClick={(e) => this.drawCards(this.state, true, 1, e)}>Draw</button></li>
					<li><button onClick={(e) => this.props.onCardClick(this.state, true, e)}>Shuffle</button></li>
				</ul>
				<p>Hand ({this.hand.lenght})</p>
				<CardsList cards={this.hand} onCardClick={this.onHandCardClick} view={VIEW_IMAGEONLY} />
				<p>Battlefield ({this.battlefield.lenght})</p>
				<CardsList cards={this.battlefield} onCardClick={this.onBattlefieldCardClick} view={VIEW_IMAGEONLY} />
			</div>
		);
	}
}

export default DeckTester;
