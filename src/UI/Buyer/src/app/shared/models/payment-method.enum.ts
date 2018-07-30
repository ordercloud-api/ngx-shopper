export enum PaymentMethod {
  PurchaseOrder = 'PurchaseOrder',
  SpendingAccount = 'SpendingAccount',
  CreditCard = 'CreditCard',
}

export const PaymentMethodMap = {
  [PaymentMethod.PurchaseOrder]: 'Purchase Order',
  [PaymentMethod.SpendingAccount]: 'Spending Account',
  [PaymentMethod.CreditCard]: 'Credit Card',
};
