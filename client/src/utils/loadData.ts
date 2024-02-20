import { useLoaderData as useLoaderDataOriginal } from "react-router-dom";
interface UseLoaderDataHook {
  <T>(): T;
}

export const useLoaderData: UseLoaderDataHook = () => {
  const useLoaderDataRef = useLoaderDataOriginal as UseLoaderDataHook;
  return useLoaderDataRef();
};

function abc<T extends { id: string }>(item: T[]): string {
  return item[0].id;
}
const add = [{ id: "ac" }];
abc(add);

class Items<U> {
  public items: U[];

  constructor(...values: U[]) {
    this.items = values;
  }
}

class Collection<T> extends Items<T> {
  getFirstItem(): T {
    return this.items[0];
  }
}

const letters = new Collection<string>("A", "b", "c");
const item = letters.getFirstItem();
console.log("item =>", item.toUpperCase());

class Person {
  firstName: string;
  lastName: string;

  constructor(fname: string, lname: string) {
    this.firstName = fname;
    this.lastName = lname;
  }
}

function display<T extends Person>(per: T): void {
  console.log(`${per.firstName} ${per.lastName}`);
}
const per = new Person("Bill", "Gates");
display(per); //Output: Bill Gate
