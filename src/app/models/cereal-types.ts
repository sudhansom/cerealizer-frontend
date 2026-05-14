export enum IType {
  COLD = 'C',
  HOT = 'H',
}

export interface ICereal {
  id: string;
  name: string;
  mfr: string;
  type: IType;
  calories: number;
  protein: number;
  fat: number;
  sodium: number;
  fiber: number;
  carbo: number;
  sugar: number;
  potass: number;
  vitamins: number;
  shelf: number;
  weight: number;
  cups: number;
  rating: number;
  image?: string;
}

export interface ISearchInputs {
  items: string[];
  conditions: string[];
  /**
   * `null` represents a row whose value the user left blank; the service
   * skips those rows when building the query so the backend doesn't see a
   * `value=` param with `null`/`undefined`/`0` and treat it as a filter.
   */
  values: (string | number | null)[];
}
