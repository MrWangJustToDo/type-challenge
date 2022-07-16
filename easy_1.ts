// 1 Pick --> MyPick

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface Todo {
  title: string;
  completed: boolean;
  description: string;
}

type A = MyPick<Todo, "completed" | "title">;

type A_1 = Pick<Todo, "completed" | "title">;

// 2 Readonly --> MyReadonly

type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface Todo_2 {
  name?: string;
  title?: string;
}

type B = MyReadonly<Todo_2>;

type B_2 = Readonly<Todo_2>;

// 3 Tuple to Object

type TupleToObject<T extends readonly any[]> = {
  [Q in T[number]]: Q;
};

const tuple = ["tesla", "model 3", "model X", "model Y"] as const;

type result = TupleToObject<typeof tuple>;

// 4 first of array

type First<T extends unknown[]> = T extends [...infer First, ...infer Last]
  ? First
  : never;

type First_1<T extends unknown[]> = T extends [] ? never : T[0];

type First_2<T extends unknown[]> = T extends { length: 0 } ? never : T[0];

type First_3<T extends unknown[]> = T["length"] extends 0 ? never : T[0];

type arr1 = ["a", "b", "c"];
type arr2 = [3, 2, 1];

type head1 = First<arr1>; // expected to be 'a'
type head2 = First_1<arr2>; // expected to be 3

// 5 Length of Tuple

type Length<T extends unknown[]> = T["length"];

type tesla = ["tesla", "model 3", "model X", "model Y"];
type spaceX = [
  "FALCON 9",
  "FALCON HEAVY",
  "DRAGON",
  "STARSHIP",
  "HUMAN SPACEFLIGHT"
];

type teslaLength = Length<tesla>; // expected 4
type spaceXLength = Length<spaceX>; // expected 5

// 6 Exclude

type MyExclude<T, K> = T extends K ? never : T;

type Result = MyExclude<"a" | "b" | "c", "a">; // 'b' | 'c'

// 7 Await

type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? MyAwaited<P>
    : P
  : never;

type X = Promise<string>;
type Y = Promise<{ field: number }>;
type Z = Promise<Promise<string | number>>;
type Z1 = Promise<Promise<Promise<string | boolean>>>;

type ExampleType = Promise<string>;

type Result_1 = MyAwaited<Z1>; // string

// 8 If

type If<T extends true | false, P, Q> = T extends true ? P : Q;

type If_a = If<true, "a", "b">; // expected to be 'a'
type If_b = If<false, "a", "b">; // expected to be 'b'

// 9 contact

type Concat<T extends unknown[], Q extends unknown[]> = [...T, ...Q];

type Concat_Result = Concat<[1], [2]>; // expected to be [1, 2]
type Concat_B = Concat<["1", 2, "3"], [false, boolean, "4"]>;

// 10 Includes

type Includes<T extends unknown[], P> = T extends [infer First, ...infer Last]
  ? First extends P
    ? true
    : Includes<Last, P>
  : false;

type isPillarMen = Includes<["Kars", "Esidisi", "Wamuu", "Santana"], "Dio">; // expected to be `false`

// 11 Push

type Push<T extends unknown[], P> = [...T, P];

type PushResult = Push<[1, 2], "3">; // [1, 2, '3']

// 12 Unshift

type Unshift<T extends unknown[], P> = [P, ...T];

type UnshiftResult = Unshift<[1, 2], 0>; // [0, 1, 2,]

// 13 Parameters

type MyParameters<T extends (...args) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

const foo = (arg1: string, arg2: number): void => {};

type FunctionParamsType = MyParameters<typeof foo>; // [arg1: string, arg2: number]

// 14 Last --> like first

type Last<T extends unknown[]> = T extends []
  ? never
  : T extends { length: 1 }
  ? T[0]
  : T extends [infer First, ...infer Rest]
  ? Last<Rest>
  : never;

type GetLast_1 = Last<[]>; // never

type GetLast_2 = Last<[1, 2, true]>; // true

type GetLast_3 = Last<["1"]>; // '1'

// @ts-expect-error
type GetLast_4 = Last<"foo">;
