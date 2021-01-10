import { ICategory } from '../interfaces/category.interface';

export class CategoryModel implements ICategory{
    category_id?: number;
    name: string;
    state: number;
}