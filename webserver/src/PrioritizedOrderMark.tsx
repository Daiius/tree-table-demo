import React from 'react';

import Stack from 'react-bootstrap/Stack';

import {
  OrderInfo,
  OrderType
} from './usePrioritizedOrders';

export type PrioritizedOrderMarkProps = {
  orderInfo?: OrderInfo;
  priority?: number;
}

type OrderMarkProps = {
  orderType?: OrderType;
}
const OrderMarkUp: React.FC<OrderMarkProps> = ({
  orderType
}) => orderType === "Descending"
  ? <i className="bi bi-caret-up-fill"/>
  : <i className="bi bi-caret-up"/>;
const OrderMarkDown: React.FC<OrderMarkProps> = ({
  orderType
}) => orderType === "Ascending"
  ? <i className="bi bi-caret-down-fill"/>
  : <i className="bi bi-caret-down"/>;

const PrioritizedOrderMark: React.FC<PrioritizedOrderMarkProps> = ({
  orderInfo,
  priority
}) => {
  return (
    <Stack direction="horizontal">
      <Stack>
        <OrderMarkUp orderType={orderInfo?.orderType} />
        <OrderMarkDown orderType={orderInfo?.orderType} />
      </Stack>
      {(priority != null) && (priority !== -1) && <div>{priority}</div> }
    </Stack>
  );
}

export default PrioritizedOrderMark;

