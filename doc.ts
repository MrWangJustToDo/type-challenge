const a = ["1", 2, 3, 4, 5] as const;

type a_1 = typeof a[number];
type a_2 = keyof typeof a;

type b = {
  a: string;
  b: number;
  c: string;
  d: number[];
};

type b_1 = b[keyof b];
type b_2 = keyof b;
