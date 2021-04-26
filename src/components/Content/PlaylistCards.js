import React  from 'react';

import PlaylistCard from 'components/Content/PlaylistCard.js'

// All items component
// Important! add unique key
const PlaylistCards = ({items, row_name, load_amount}) => 
         items.slice(0,load_amount).map(card_item => {
            var card_key = row_name.concat("_"+ card_item.pk);
            return (<React.Fragment key={card_key}>
                    <PlaylistCard 
                       playlist={card_item} 
                    />
                </React.Fragment>);
        }
);

export default PlaylistCards;

