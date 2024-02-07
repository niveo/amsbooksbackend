export interface IDataBaseService {
  create(value: any): Promise<any>;
  update(id: number, value: any): Promise<number>;
}
