import React  from 'react';

import SubscriptionCard from 'components/Content/SubscriptionCard.js'

// All items component
// Important! add unique key
const SubscriptionCards = ({items, row_name, load_amount}) => 
         items.slice(0,load_amount).map(card_item => {
            var card_key = row_name.concat("_"+ card_item.pk);
            return (<React.Fragment key={card_key}>
                    <SubscriptionCard 
                        episode={card_item}
                    />
                </React.Fragment>);
        }
);

export default SubscriptionCards;

