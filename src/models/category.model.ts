import { ICategory } from '../interfaces/category.interface';

export class CategoryModel implements ICategory{
    category_id?: Number;
    name: string;
    state: Number;
}