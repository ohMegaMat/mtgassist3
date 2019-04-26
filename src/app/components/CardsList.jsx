import React, { Component } from "react";
import CardsListItem from "./CardsListItem";

class CardsList extends Component
{
  render()
  {
    let { cards } = this.props;
	let { view } = this.props;
	let { id } = this.props;
    return (
      <ul id={id+"_cardsList"} className="cardsList">
        {cards.map(card => (
          <CardsListItem
            card={card}
			view={view}
            id={id+"_card_"+(card.id)}
			key={id+"_card_"+(card.id)}
			onCardClick={this.props.onCardClick}
          />
        ))}
      </ul>
    );
  }
}

export default CardsList;
