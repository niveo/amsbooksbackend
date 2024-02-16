export interface IDataBaseService<T> {
  create(value: T): Promise<any>;
  update(id: number, value: T): Promise<number>;
}
