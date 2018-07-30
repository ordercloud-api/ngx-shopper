export enum OrderStatus {
  Unsubmitted = 'Unsubmitted',
  AwaitingApproval = 'AwaitingApproval',
  Declined = 'Declined',
  Open = 'Open',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

export const OrderStatusMap = {
  [OrderStatus.Unsubmitted]: 'Unsubmitted',
  [OrderStatus.AwaitingApproval]: 'Awaiting Approval',
  [OrderStatus.Declined]: 'Declined',
  [OrderStatus.Open]: 'Open',
  [OrderStatus.Completed]: 'Completed',
  [OrderStatus.Canceled]: 'Canceled',
};
