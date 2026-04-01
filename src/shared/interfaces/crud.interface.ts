export interface CRUD<T, createDtoT, updateDtoT> {
  create(dto: createDtoT): Promise<T>;
  update(id: number, dto: updateDtoT): Promise<T>;
  delete(id: number): Promise<void>;
  getAll(): Promise<T[]>;
  getById(...any): Promise<T>;
}
