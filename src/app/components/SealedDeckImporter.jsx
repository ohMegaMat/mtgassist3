import React, { Component } from "react";

//const CARDS_DEFINITION = [
//	{ id: 1, count: 1, imageUrl: "/db/cards/WAR/001.jpg", name: "Karn, the Great Creator" },
//	{ id: 2, count: 1, imageUrl: "/db/cards/WAR/002.jpg", name: "Ugin, the Ineffable" },
//	{ id: 3, count: 1, imageUrl: "/db/cards/WAR/003.jpg", name: "Ugin's Conjurant" },
//	{ id: 4, count: 3, imageUrl: "/db/cards/WAR/004.jpg", name: "Ajani's Pridemate" }
//  ];

//var path = require("path");
var CARDS_DEFINITION = require( '../db/sets/war.json' );

class SealedDeckImporter extends Component
{
	constructor() {
		super();
		this.deckToImport = React.createRef();
	};

  importDeck = () =>
  {
	let deck = { mainboard: [], sideboard: [] };

	// OBTIENE LA LISTA DE CARTAS DEL TEXTAREA
	let importPure = this.deckToImport.current.value;
	let lines = importPure.split('\n');
	let cards = lines.map(line => {
		let indexOfCardName = line.indexOf(' ');
		let cardCount = parseInt( line.slice(0, indexOfCardName) );
		let cardName = line.slice(indexOfCardName+1);
		return { cardCount: cardCount, cardName: cardName };
	});
	cards = cards.filter(card => !isNaN(card.cardCount));
	// MATCH CADA CARTA DEL TEXTAREA CON LA CARTA DE LA DB Y LA AGREGA AL SIDEBOARD
	deck.sideboard = cards.map(card => {
		let cardDefinition = CARDS_DEFINITION.find( cardDefinition => cardDefinition.name === card.cardName );
		let newCard = Object.assign({}, cardDefinition);
		newCard.count = card.cardCount;
		newCard.manaWeight = this.getManaWeight( cardDefinition );
		return newCard;
	});
	// CREAR EL DECK CORRESPONDIENTE
	this.props.onImportedDeck( deck );
  };

  getManaWeight = (card) => {
	let manaWeight = 0;
	let splitValue = card.manaCost.replace("{", "").replace("}", "").split("");
	splitValue.map(manaSymbol => {
		if( !isNaN(manaSymbol) )
			manaWeight += parseInt(manaSymbol);
		else
			manaWeight += 1;
	});

	if( card.colors.length > 1 ) {
		manaWeight = "M"+ manaWeight;
	}
	else if( card.colors.length < 1 ) {
		manaWeight = "L"+ manaWeight;
	}
	else {
		switch( card.colors[0] )
		{
			case 'B': {
				manaWeight = "A"+ manaWeight;
				break;
			}
			case 'G': {
				manaWeight = "B"+ manaWeight;
				break;
			}
			case 'R': {
				manaWeight = "C"+ manaWeight;
				break;
			}
			case 'W': {
				manaWeight = "D"+ manaWeight;
				break;
			}
			case 'U': {
				manaWeight = "E"+ manaWeight;
				break;
			}
		}
	}
	console.log(card.manaCost +" - "+ manaWeight);
	return manaWeight;
  }

  render()
  {
    return (
      <div id="sealedDeckImporter">
	  	<textarea id="deckToImport" ref={this.deckToImport}></textarea>
        <button onClick={this.importDeck}>Search</button>
      </div>
    );
  }
}

export default SealedDeckImporter;
