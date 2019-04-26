import React, { Component } from "react";

//const CARDS_DEFINITION = [
//	{ id: 1, count: 1, imageUrl: "/db/cards/WAR/001.jpg", name: "Karn, the Great Creator" },
//	{ id: 2, count: 1, imageUrl: "/db/cards/WAR/002.jpg", name: "Ugin, the Ineffable" },
//	{ id: 3, count: 1, imageUrl: "/db/cards/WAR/003.jpg", name: "Ugin's Conjurant" },
//	{ id: 4, count: 3, imageUrl: "/db/cards/WAR/004.jpg", name: "Ajani's Pridemate" }
//  ];

const CARDS_DEFINITION = require('../../war.json');

class SealedDeckImporter extends Component
{
	constructor() {
		super()
		this.deckToImport = React.createRef()
	}

  importDeck = () =>
  {
	let deck = { mainboard: [], sideboard: [] };

	// OBTIENE LA LISTA DE CARTAS DEL TEXTAREA
	let importPure = this.deckToImport.current.value;
	console.log( JSON.stringify(importPure) );
	// MATCH CADA CARTA DEL TEXTAREA CON LA CARTA DE LA DB
//	deck.sideboard = results.map(result =>
	// CREAR EL DECK CORRESPONDIENTE
//	this.props.onImportedDeck( deckCopy );
  };

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
