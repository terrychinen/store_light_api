import { query } from '../query/query';
import { Request, Response } from 'express';
import { CategoryModel } from '../models/category.model';


//================== OBTENER TODAS LAS CATEGORIAS ==================//
export async function getCategories(req: Request, res: Response){
    const offset = Number(req.query.offset);
    const state = Number(req.query.state);

    if(Number.isNaN(offset) || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'offset' y 'state' son obligatorio!`});

    try {
        const getQuery = `SELECT * FROM category WHERE state = ${state} LIMIT 20`;
        
        return await query(getQuery).then(data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== CREAR UNA CATEGORIA ==================//
export async function createCategory(req: Request, res: Response) {
    const category: CategoryModel = req.body;

    if(category.name == null || Number.isNaN(category.state)) return res.status(404).json({ok: false, message: `La variable 'name' y 'state' son obligatorio!`});

    try {
        const categoryName = category.name;
        category.name = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    
        const queryCheck = `SELECT * FROM category WHERE name = "${category.name}"`;
       
        return await query(queryCheck).then(async dataCheck => {
            if(dataCheck.result[0][0] != null) {return res.status(400).json({ok: false, message: 'La categoría ya existe!'});}
            const insertQuery = `INSERT INTO category (name, state) VALUES ("${category.name}", "${category.state}")`;
    
            return await query(insertQuery).then(data => {
                if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
                return res.status(data.status).json({ok: true, message: 'Categoría creado correctamente'});
            });
        });
    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== ACTUALIZAR UNA CATEGORIA ==================//
export async function updateCategory(req: Request, res: Response) {
    const category: CategoryModel = req.body;
    const categoryID = req.params.category_id;

    if(category.name == null || Number.isNaN(category.category_id) || Number.isNaN(category.state)) return res.status(404).json({ok: false, message: `La variable 'category_id', 'name' y 'state' son obligatorio!`});

    try {
        const categoryName = category.name;
        category.name = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

        const queryCheckId = `SELECT * FROM category WHERE category_id = "${categoryID}"`;

        return await query(queryCheckId).then(async dataCheckId => {
            if(!dataCheckId.ok) return res.status(500).json({ok: false, message: dataCheckId.message});
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `La categoría con el id ${categoryID} no existe!`});

            const queryCheck = `SELECT * FROM category WHERE name = "${category.name}"`;

            return await query(queryCheck).then(async dataCheck => {
                if(!dataCheck.ok) return res.status(500).json({ok: false, message: dataCheck.message});
                if(dataCheck.result[0][0] != null) return res.status(406).json({ok: false, message: 'La categoría ya existe!'});

                const updateQuery = `UPDATE category SET name="${category.name}", state = "${category.state}" WHERE category_id = "${categoryID}"`;    

                return await query(updateQuery).then(async dataUpdate => {
                    if(!dataUpdate.ok) return res.status(dataUpdate.status).json({ok: false, message: dataUpdate.message});    
                    return res.status(dataUpdate.status).json({ok: true, message: 'La categoría se actualizó correctamente'});
                });
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }   
}




//================== ELIMINAR UNA CATEGORIA POR SU ID ==================//
export async function deleteCategory(req: Request, res: Response) {
    const categoryID = req.params.category_id;

    const checkIdQuery = `SELECT * FROM category WHERE category_id = ${categoryID}`;

    try {
        return await query(checkIdQuery).then(async dataCheckId => {
            if(dataCheckId.result[0][0] == null) return res.status(400).json({ok: false, message: `La categoría con el id ${categoryID} no existe!`});
            const deleteQuery = `DELETE FROM category WHERE category_id = ${categoryID}`;
    
            return await query(deleteQuery).then(dataDelete => {
                if(!dataDelete.ok) return res.status(dataDelete.status).json({ok: false, message: dataDelete.message})
                return res.status(dataDelete.status).json({ok: true, message: 'La categoría se eliminó correctamente'});
            });
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}




//================== BUSCAR CATEGORIA POR SU NOMBRE  ==================//
export async function searchCategory(req: Request, res: Response){
    const search = req.body.search;
    const searchBy = req.body.search_by;
    const state = Number(req.body.state);

    if(search == null || Number.isNaN(state)) return res.status(404).json({ok: false, message: `La variable 'search' y 'state' son obligatorio!`});

    try {        
        let columnName = '';

        if(searchBy == 0) {
            columnName = 'category_id';
        }else {
            columnName = 'name';
        }

        const querySearch = `SELECT * FROM category WHERE ${columnName} LIKE "%${search}%" AND state = ${state} LIMIT 10`;

        return await query(querySearch).then( data => {
            if(!data.ok) return res.status(data.status).json({ok: false, message: data.message})
            return res.status(data.status).json({ok: true, message: data.message, result: data.result[0]});
        });

    }catch(error) {
        return res.status(500).json({ok: false, message: error});
    }
}