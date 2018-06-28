import { ErrorHandler, Inject, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/**
 * this error handler class extends angular's ErrorHandler
 * in order to automatically format ordercloud error messages
 * and display them in toastr
 */
export class AppErrorHandler extends ErrorHandler {
    constructor(@Inject(Injector) private readonly injector: Injector) {
        super();
    }

    public handleError(ex: any): void {
        this.displayError(ex);
        super.handleError(ex);
    }

    /**
     * use this to display error message
     * but continue exection of code
     */
    public displayError(ex: any): void {
        let message = '';
        if (ex && ex.error && ex.error.Errors && ex.error.Errors.length) {
            const e = ex.error.Errors[0];
            message = e.ErrorCode === 'NotFound' ? `${e.Data.ObjectType} ${e.Data.ObjectID} not found.` : e.Message;
        } else if (ex && ex.error && ex.error['error_description']) {
            message = ex.error['error_description'];
        } else if (ex.error) {
            message = ex.error;
        } else if (ex.message) {
            message = ex.message;
        } else {
            message = 'An error occurred';
        }
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        this.toastrService.error(message, 'Error', { onActivateTick: true });
    }

    /**
     * Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
     */
    private get toastrService(): ToastrService {
        return this.injector.get(ToastrService);
    }
}
