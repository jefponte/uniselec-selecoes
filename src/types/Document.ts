

export interface Results {
    data:  Document[];
    links: Links;
    meta:  Meta;
}
export interface Result {
    data:  Document;
}

export interface Document {
    id:          number;
    title:       string;
    description: string;
    path:        string;
    filename:    string;
    email_verified_at: null | string;
    created_at: null | string;
    updated_at: null | string;
}
export interface Links {
  prev: string;
  last: string;
  next: string;
  first: string;
}

export interface Meta {
  to: number;
  from: number;
  path: string;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
}

export interface DocumentParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
  process_selection_id?:number;
}