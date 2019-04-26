import React, { Component } from "react";
import CardsList from "./CardsList";
import { VIEW_STANDARD, VIEW_IMAGEONLY } from "../components/CardsListItem"

const LANDS_DEFINITION = [
	{ id: 250, imageUrl: "/db/cards/WAR/250.jpg", name: "Plains" },
	{ id: 253, imageUrl: "/db/cards/WAR/253.jpg", name: "Swamp" },
	{ id: 256, imageUrl: "/db/cards/WAR/256.jpg", name: "Island" },
	{ id: 259, imageUrl: "/db/cards/WAR/259.jpg", name: "Mountain" }, 
	{ id: 262, imageUrl: "/db/cards/WAR/262.jpg", name: "Forest" }
  ];

class SealedDeckEditor extends Component
{
	onMainBoardCardClick = cardId =>
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

	onSideBoardCardClick = cardId =>
	{
		console.log( cardId );

		let { deck } = this.props;
		let deckCopy = Object.assign({}, deck);

		// SI ES LA UNICA CARTA, ELIMINARLA
		deckCopy.sideboard = deck.sideboard.slice();
		let cardInSideBoard = deckCopy.sideboard.find( card => card.id === cardId );
		console.log( "cardInSideBoard "+ cardInSideBoard );
		if( cardInSideBoard.count > 1 ) {
			cardInSideBoard.count--;
		}
		else {
			deckCopy.sideboard = deckCopy.sideboard.filter( card => card.id !== cardId );
		}
		console.log( "deckCopy "+ JSON.stringify(deckCopy) );

		// SI NO ES TIERRA BASICA, PASAR LA CARTA AL MAINBOARD
		deckCopy.mainboard = deck.mainboard.slice();
		let cardInMainBoard = deckCopy.mainboard.find( card => card.id === cardId );
		console.log( "cardInMainBoard "+ cardInMainBoard );
		if( cardInMainBoard !== undefined ) {
			cardInMainBoard.count++;
		}
		else {
			let newCard = Object.assign({}, cardInSideBoard);
			newCard.count = 1;
			deckCopy.mainboard.push( newCard );
		}

		console.log( "deckCopy "+ JSON.stringify(deckCopy) );
		// ACTUALIZAR EL DECK
		this.props.onUpdateDeck( deckCopy );
	};

	addCard = cardId =>
	{
		let { deck } = this.props;
		let deckCopy = Object.assign({}, deck);

		// AGREGAR LA CARTA AL MAINBOARD
		deckCopy.mainboard = deck.mainboard.slice();
		let cardInMainBoard = deckCopy.mainboard.find( card => card.id === cardId );
		console.log( "cardInMainBoard "+ cardInMainBoard );
		if( cardInMainBoard !== undefined ) {
			cardInMainBoard.count++;
		}
		else {
			let landCard = LANDS_DEFINITION.find( card => card.id === cardId );
			let newCard = Object.assign({}, landCard);
			newCard.count = 1;
			deckCopy.mainboard.push( newCard );
		}

		console.log( "deckCopy "+ JSON.stringify(deckCopy) );
		// ACTUALIZAR EL DECK
		this.props.onUpdateDeck( deckCopy );
	}

	render()
	{
		let { deck } = this.props;
		return (
			<div id="sealedDeckEditor">
				<p>SideBoard ({deck.sideboard.lenght})</p>
				<CardsList id="sb" cards={deck.sideboard} onCardClick={this.onSideBoardCardClick} view={VIEW_IMAGEONLY} />
				<ul id="basicLandsList" className="cardsList">
					<li>Lands:</li>
					<li className="cardResult imageOnly border border-light"><img alt="Plains" src="/db/cards/Lands/Plains.jpg" onClick={(e) => this.addCard(250, e)}/></li>
					<li className="cardResult imageOnly border border-light"><img alt="Island" src="/db/cards/Lands/Island.jpg" onClick={(e) => this.addCard(253, e)}/></li>
					<li className="cardResult imageOnly border border-light"><img alt="Swamp" src="/db/cards/Lands/Swamp.jpg" onClick={(e) => this.addCard(256, e)}/></li>
					<li className="cardResult imageOnly border border-light"><img alt="Mountain" src="/db/cards/Lands/Mountain.jpg" onClick={(e) => this.addCard(259, e)}/></li>
					<li className="cardResult imageOnly border border-light"><img alt="Forest" src="/db/cards/Lands/Forest.jpg" onClick={(e) => this.addCard(262, e)}/></li>
				</ul>
				<p>MainBoard ({deck.mainboard.lenght})</p>
				<CardsList id="mb" cards={deck.mainboard} onCardClick={this.onMainBoardCardClick} view={VIEW_IMAGEONLY} />
			</div>
		);
	}
}

export default SealedDeckEditor;
