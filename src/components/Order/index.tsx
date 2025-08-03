import type { Report } from "@services/firebase/report.type";
import formatNumber from "@services/xlsx/utils/formatNumber";

interface OrderListProps {
  orders: Report[];
}

export default function OrderList({ orders }: OrderListProps) {
  return (
    <ul className="flex h-full w-full flex-col items-center overflow-x-hidden overflow-y-auto">
      {orders.map((order) => {
        return (
          <li
            key={order.code}
            className="mb-2 flex h-12 w-full items-center justify-between rounded-lg bg-gray-100 p-2"
          >
            <span>
              ({order.category === "pre order" ? `PO.${order.number}` : ""}/
              {order.from}) {order.code} {order.type}{" "}
              {formatNumber(order.amount)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
