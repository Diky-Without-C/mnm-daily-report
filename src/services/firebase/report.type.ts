export interface Report {
  category: "pre order" | "container";
  type: string;
  amount: number;
  code: string;
  from: "MC" | "LOKAL";
  number: number;
}
