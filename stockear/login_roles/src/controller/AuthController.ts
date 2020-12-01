import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { validate } from 'class-validator';
import { checkJwt } from '../middleware/jwt';

class AuthController {
    static login = async (req: Request, res: Response) => {
        //req es lo que nos enviara el front-end
        const { username, password } = req.body;
        if (!(username && password)) {
            return res.status(404).json({ message: 'Usuario y Contraseña son requeridos' });
        }
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { username } });
        }
        catch (e) {
            return res.status(404).json({ message: 'Usuario / Contraseña son incorrectos' });
        }

        //verificando la contraseña
        if (!user.checkPassword(password)) {
            return res.status(400).json({ message: 'Usuario / Contraseña son incorrectos' });
        }
        const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });
        const role = user.rol;
        const userId = user.id;
        res.json({ message: 'Ok', token, role, userId });
    };

    static changePassword = async (req: Request, res: Response) => {
        const { userId } = res.locals.jwtPayload;
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).json({ message: 'La contraseña nueva / anterior son requeridas' });
        }
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(userId);
        }
        catch (e) {
            res.status(400).json({ message: 'Algo anda mal >:V ' })
        }
        if (!user.checkPassword(oldPassword)) {
            return res.status(401).json({ message: 'Verifique su contraseña anterior' });
        }
        user.password = newPassword;
        const opcionesValidacion = { validationError: { target: false, value: false } };
        const errors = await validate(user, opcionesValidacion);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
        //has de la contraseña
        user.hashPassword();
        userRepository.save(user);
        res.json({ message: 'Se ha cambiado la contraseña' });
    };

    static forgotPassword = async (req: Request, res: Response) => {
        const { username } = req.body;
        if (!(username)) {
            return res.status(404).json({ message: "El nombre de usuario es necesario" });
        }
        const message = 'Se envio un link a su correo para reestablecer su contraseña.';
        let verificationLink;
        let emailStatus = 'Ok';

        const userRepo = getRepository(User);
        let user: User;
        try {
            user = await userRepo.findOneOrFail({ where: { username } });
            const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecretReset, { expiresIn: '10m' });
            verificationLink = `http://localhost:3000/new-password/${token}`;
            user.resetToken = token;
        } catch (e) {
            return res.json({ message });
        }

        //para hacer 

        try {
            //envio de email
        } catch (error) {
            emailStatus = error;
            return res.status(400).json({ message: 'algo anda mal :V' });
        }

        try {
            await userRepo.save(user);
        } catch (error) {
            emailStatus = error;
            return res.status(400).json({ message: 'Algo anda mal :V' });
        }

        res.json({ message, info: emailStatus, test: verificationLink });
    };

    static createNewPassword = async (req: Request, res: Response) => {
        const { newPassword } = req.body;
        const resetToken = req.headers['reset'] as string;
        if (!(resetToken && newPassword)) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
        }
        const userRepo = getRepository(User);
        let user: User;
        let jwtPayload;
        try {
            jwtPayload = jwt.verify(resetToken, config.jwtSecretReset);
            user = await userRepo.findOneOrFail({ where: { resetToken } });
        } catch (error) {
            return res.status(401).json({ message: 'algo anda mal'});
        }

        user.password=newPassword;

        const validationOps={validationError:{tarjet:false,value:false}};
        const errors=await validate(user,validationOps);

        if(errors.length >0){
            return res.status(400).json(errors);
        }

        try {
            user.hashPassword();
            await userRepo.save(user);
        } catch (error) {
            return res.status(401).json({message:'algo anda mal'});
        }

        res.json({message:'Contraseña cambiada'});
    }
}
export default AuthController;