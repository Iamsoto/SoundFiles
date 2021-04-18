import React  from 'react';

import EpisodeCard from 'components/Landing/EpisodeCard.js'

// All items component
// Important! add unique key
const EpisodeCards = ({items, row_name, load_amount}) => 
         items.map(card_item => {
            var card_key = row_name.concat("_"+ card_item.pk);
            return (<React.Fragment key={card_key}>
                    <EpisodeCard 
                        episode={card_item}
                    />
                </React.Fragment>);
        }
);

export default EpisodeCards;

