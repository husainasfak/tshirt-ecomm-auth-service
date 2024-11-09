import { NextFunction, Response } from 'express'

import { RegisterUserRequest } from '../types'
import { UserService } from '../services/User.service'
import { Logger } from 'winston'

import { validationResult } from 'express-validator'

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req)

        if (!result.isEmpty()) {
            return res.status(400).json({
                errors: result.array(),
            })
        }

        const { firstName, lastName, email, password } = req.body

        // if(!email){
        //     const error  = createHttpError(400,'Email not found')
        //     next(error)
        // }

        this.logger.debug('New Request to register a user', {
            firstName,
            lastName,
            email,
            password: '************',
        })
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            })
            this.logger.info('User has been created', { id: user.id })
            res.status(201).json({ id: user.id })
        } catch (err) {
            next(err)
            return
        }
    }
}
