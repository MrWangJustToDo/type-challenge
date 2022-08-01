// 1. Get Return Type

type MyReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer P
  ? P
  : never;

const fn = (v: boolean) => {
  if (v) return 1;
  else return 2;
};

type a = MyReturnType<typeof fn>; // should be "1 | 2"

// 2. Omit

type MyExclude_1<T, P> = T extends P ? never : T;

type MyOmit<T, P> = Pick<T, MyExclude_1<keyof T, P>>;

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyOmit<Todo, "description" | "title">;

const todo: TodoPreview = {
  completed: false,
};

// 3. Readonly 2

type MyPick_1<T, P extends keyof T> = { [O in P]: T[O] };

type MyReadonly2<T, P extends keyof T> = Readonly<MyPick_1<T, P>> &
  MyOmit<T, P>;

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

const todo_2: MyReadonly2<Todo, "title" | "description"> = {
  title: "Hey",
  description: "foobar",
  completed: false,
};

// @ts-expect-error
todo_2.title = "Hello"; // Error: cannot reassign a readonly property
// @ts-expect-error
todo_2.description = "barFoo"; // Error: cannot reassign a readonly property
todo_2.completed = true; // OK

// 4. Deep Readonly

type DeepReadonly<T> = T extends Object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

type X = {
  x: {
    a: 1;
    b: "hi";
  };
  y: "hey";
};

type Expected = {
  readonly x: {
    readonly a: 1;
    readonly b: "hi";
  };
  readonly y: "hey";
};

type Todo_2 = DeepReadonly<X>; // should be same as `Expected`

// 5. Tuple to Union

type TupleToUnion<T extends unknown[]> = T[number];

type Arr = ["1", "2", "3"];

type Test = TupleToUnion<Arr>; // expected to be '1' | '2' | '3'

// 6. Chainable Options

type Chainable_1<Options extends object = {}> = {
  option<K extends string, V>(
    key: K extends keyof Options ? never : K,
    value: V
  ): Chainable_1<Options & { [S in K]: V }>;
  get(): { [K in keyof Options]: Options[K] };
};

interface Chainable<T = unknown> {
  option<P extends string = string, Q = unknown>(
    key: P extends keyof T ? never : P,
    value: Q
  ): Chainable<MyOmit<T, P> & { [K in P]: Q }>;

  get(): T;
}

declare const config: Chainable;

const result = config
  .option("foo", 123)
  .option("name", "type-challenges")
  .option("bar", { value: "Hello World" })
  .get();

const result2 = config
  .option("name", "another name")
  // @ts-expect-error
  .option("name", "last name")
  .get();

// expect the type of result to be:
interface Result {
  foo: number;
  name: string;
  bar: {
    value: string;
  };
}

// 7 Last of Array

type Last<T extends unknown[]> = T extends []
  ? never
  : T extends [infer Q]
  ? Q
  : T extends [...infer P, infer Q]
  ? Q
  : never;

type arr1 = ["a", "b", "c"];
type arr2 = [3, 2, 1];

type tail1 = Last<arr1>; // expected to be 'c'
type tail2 = Last<arr2>; // expected to be 1

// 8 Pop

type Pop<T extends unknown[]> = T extends []
  ? []
  : T extends [...infer Q, infer P]
  ? Q
  : never;

type Shift<T extends unknown[]> = T extends []
  ? []
  : T extends [infer Q, ...infer P]
  ? P
  : never;

type Push<T extends unknown[], K> = [...T, K];

type Unshift<T extends unknown[], K> = [K, ...T];

type re1 = Pop<arr1>; // expected to be ['a', 'b']
type re2 = Pop<arr2>; // expected to be [3, 2]

// 9 Promise.all

type PromiseResult<T extends unknown> = T extends Promise<infer P>
  ? P extends Promise<unknown>
    ? PromiseResult<P>
    : P
  : T;

type PromiseAll_1<T extends readonly unknown[]> = Promise<{
  [K in keyof T]: PromiseResult<T[K]>;
}>;

const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

function PromiseAll<T extends readonly unknown[]>(
  PromiseArray: T
): PromiseAll_1<T> {
  return Promise.all(PromiseArray) as PromiseAll_1<T>;
}

type f = PromiseAll_1<[typeof promise1, typeof promise2, typeof promise3]>;

// expected to be `Promise<[number, 42, string]>`
const p = PromiseAll([promise1, promise2, promise3] as const);

// 10 Type Lookup

interface Cat {
  type: "cat";
  breeds: "Abyssinian" | "Shorthair" | "Curl" | "Bengal";
}

interface Dog {
  type: "dog";
  breeds: "Hound" | "Brittany" | "Bulldog" | "Boxer";
  color: "brown" | "white" | "black";
}

type LookUp<T extends { type: string }, K extends string> = T extends {
  type: infer Q;
}
  ? Q extends K
    ? T
    : never
  : never;

type MyDogType = LookUp<Cat | Dog, "dog">; // expected to be `Dog`

// 11 Trim Left

type TrimLeft<T extends string> = T extends ` ${infer R}` ? TrimLeft<R> : T;

type trimed = TrimLeft<"  Hello World  ">; // expected to be 'Hello World  '
