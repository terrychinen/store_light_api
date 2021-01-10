import { Request, Response } from "express";

export async function indexWelcome(req: Request, res: Response) {
    return res.json({
        message: 'Bienvenido a Almacen API'
    });
}