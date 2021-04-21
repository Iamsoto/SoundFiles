import React  from 'react';

import PodcastCard from 'components/Content/PodcastCard.js'

// All items component
// Important! add unique key
const PodcastCards = ({items, row_name, load_amount}) => 
         items.slice(0,load_amount).map(card_item => {
            var card_key = row_name.concat("_"+ card_item.pk);
            return (<React.Fragment key={card_key}>
                    <PodcastCard 
                       podcast={card_item} 
                    />
                </React.Fragment>);
        }
);

export default PodcastCards;

