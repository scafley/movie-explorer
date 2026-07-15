import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const tmdbAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(environment.tmdb.baseUrl)) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${environment.tmdb.accessToken}`,
      },
    });
    return next(authReq);
  }
  return next(req);
};
