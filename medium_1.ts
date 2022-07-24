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
