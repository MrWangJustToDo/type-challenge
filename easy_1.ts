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
