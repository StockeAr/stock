import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';

@Injectable()
export class AdminIntercetpor implements HttpInterceptor {

    constructor(private auth: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {

        /* if (req.url.includes('users')) {
            const authToken = this.auth.userTokenValue;
            const authReq = req.clone({
                setHeaders: {
                    auth: authToken,
                },
            });
            return next.handle(authReq);
        } */
        const userValue = this.auth.userValue;
        if (userValue) {
            const authReq = req.clone({
                setHeaders: {
                    auth: userValue.token
                },
                //headers:req.headers.set('admin',userValue.userId.toString())
            });
            return next.handle(authReq);   
        }
        return next.handle(req);
    }
}