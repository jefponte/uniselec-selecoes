import { Course } from "./Course";


export interface Results {
    data:  ProcessSelection[];
    links: Links;
    meta:  Meta;
}
export interface Result {
    data:  ProcessSelection;
}

export interface ProcessSelection {
    id?:              number;
    name:            string;
    description:            string;
    status:           string;
    start_date:           string;
    end_date:           string;
    type:           string;
    courses: Course[];
    created_at?: null | string;
    updated_at?: null | string;
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

export interface ProcessSelectionParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}