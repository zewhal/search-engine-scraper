



export interface SERPQueryParams {
    query: string
    page: number,
    pageStart?: number
}

export interface SERPResultItem {
  title: string;
  url: string;
  snippet?: string;
  position?: number;
}

export interface SERPResponse {
  engine: string;
  query: string;
  page: number;
  results: SERPResultItem[];
}