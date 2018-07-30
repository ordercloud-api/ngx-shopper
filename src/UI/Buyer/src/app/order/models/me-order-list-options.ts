export interface MeOrderListOptions {
  search?: string;
  status?: string;
  sortBy?: string;
  page?: number;
  filters?: { [key: string]: string | string[] };
}
