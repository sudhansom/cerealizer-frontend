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
  self: number;
  weight: number;
  cups: number;
  rating: number;
  image?: string;
}

export interface ISearchInputs {
  items: Set<string>;
  conditions: string[];
  values: (string | number)[];
}
