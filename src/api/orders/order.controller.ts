import { Request, Response, NextFunction } from 'express';
import { createNewOrder, getAllOrders, updateOrderStatus,getOrderStatusForCustomer } from './order.service';


export const postOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await createNewOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const patchOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await updateOrderStatus(id, status);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

export const getCustomerOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await getOrderStatusForCustomer(req.params.id);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
}